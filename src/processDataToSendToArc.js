import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });
import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestToArcXP = async (data, logger) => {
  try {
    logger.info({
      message: "Sending POST request to Arc XP",
    });
    let retries = 0;
    const maxRetries = parseInt(process.env.MAX_RETRIES) || 6;
    const retryDelay = parseInt(process.env.RETRY_DELAY_MS) || 10000;

    while (retries < maxRetries) {
      const response = await axios.post(
        `${process.env.URL_ARC_XP}/identity/api/v1/migrate`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AUTH_TOKEN_ARC_XP}`,
          },
        }
      );
      if (response.status === 429) {
        retries++;

        logger.info({
          message: `Received 429 Too Many Requests. Retry ${retries}/${maxRetries}`,
          type: "warning",
        });
        if (retries > maxRetries) {
          logger.error({
            message: `Exceeded maximum retries (${maxRetries}) for 429 errors.`,
          });
        }
        await sleep(retryDelay);
        continue;
      }
      const records = response?.data?.records ?? [];
      logger.info({
        message: `POST request to Arc XP successful. Records processed: ${records.length}`,
      });
      await sleep(process.env.DELAY_BETWEEN_REQUESTS_MS || 937.5);
      return { ok: true, data: records };
    }
  } catch (error) {
    logger.error({
      message: `Error during POST request to Arc XP: ${error.message}`,
    });
    if (error.response) {
      logger.error({
        message: `Error data: ${JSON.stringify(error.response.data)}`,
      });
      logger.error({
        message: `Error status: ${error.response.status}`,
      });
    }
    return { ok: false, error: error.message || "Unknown error", records: [] };
  }
};

const sliceAndProcessDataRowsARCXP = (data, logger) => {
  logger.info({
    message: "Slicing data into chunks for Arc XP processing",
  });
  const slicedData = [];
  const maxRows = parseInt(process.env.MAX_ROWS_PER_REQUEST) || 100;
  for (let i = 0; i < data.length; i += maxRows) {
    const chunk = data.slice(i, i + maxRows);
    if (chunk.length > 0) slicedData.push(chunk);
  }
  return slicedData;
};

export const processToSendDataToArc = async (data, logger) => {
  logger.info({
    message: "Starting to process data to send to Arc...",
    dataLength: Array.isArray(data.length) ? data.length : 0,
  });
  const slicedData = sliceAndProcessDataRowsARCXP(data || [], logger);
  logger.info({
    message: "Data sliced into chunks for Arc processing.",
    chunks: slicedData.length,
  });
  const response = await Promise.all(
    slicedData.map((dataChunk) =>
      requestToArcXP({ records: dataChunk }, logger)
    )
  );
  logger.info({
    message: "All data chunks processed and sent to Arc.",
    responseLength: response.length,
  });
  return response;
};
