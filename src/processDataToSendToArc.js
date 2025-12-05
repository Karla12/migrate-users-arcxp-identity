import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });
import axios from "axios";

const requestToArcXP = async (data) => {
  try {
    console.log(
      "Sending POST request to Arc XP at: ",
      new Date().toISOString()
    );
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
    const records = response?.data?.records ?? [];
    console.log(
      "Response from Arc XP:",
      response.data.records.length,
      "records."
    );
    console.log("Ending POST request to Arc XP at: ", new Date().toISOString());
    return { ok: true, data: records };
  } catch (error) {
    console.error("Error during POST request:", error.message || error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
    }
    return { ok: false, error: error.message || "Unknown error", records: [] };
  }
};

const sliceAndProcessDataRowsARCXP = (data) => {
  console.log("Slicing data into chunks for Arc XP processing");
  const slicedData = [];
  const maxRows = parseInt(process.env.MAX_ROWS_PER_REQUEST) || 100;
  for (let i = 0; i < data.length; i += maxRows) {
    const chunk = data.slice(i, i + maxRows);
    if (chunk.length > 0) slicedData.push(chunk);
  }
  return slicedData;
};

export const processToSendDataToArc = async (data) => {
  console.log(
    "Starting to process data to send to Arc...",
    Array.isArray(data.length) ? data.length : 0
  );
  const slicedData = sliceAndProcessDataRowsARCXP(data || []);
  console.log("Sliced data into", slicedData.length, "chunks.");
  const response = await Promise.all(
    slicedData.map((dataChunk) => requestToArcXP({ records: dataChunk }))
  );
  console.log("All data chunks processed and sent to Arc.", response.length);
  return response;
};
