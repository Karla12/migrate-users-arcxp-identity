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
      `${process.env.URL_HERALDOCO_ARC_XP}/identity/api/v1/migrate`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTH_TOKEN_ARC_XP}`,
        },
      }
    );
    console.log(
      "Response from Arc XP:",
      response.data.records.length,
      "records."
    );
    console.log("Ending POST request to Arc XP at: ", new Date().toISOString());
    return response && response.data ? response.data : [];
  } catch (error) {
    console.error("Error during POST request:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
  }
};

const sliceAndProcessDataRowsARCXP = (data) => {
  console.log("Slicing data into chunks for Arc XP processing");
  const slicedData = [];
  const maxRows = parseInt(process.env.MAX_ROWS_PER_REQUEST) || 100;
  for (let i = 0; i <= data.length; i += maxRows) {
    const chunk = data.slice(i, i + maxRows);
    slicedData.push(chunk);
  }
  return slicedData;
};

export const processToSendDataToArc = async (data) => {
  console.log("Starting to process data to send to Arc...", data.length);
  const slicedData = sliceAndProcessDataRowsARCXP(data);
  console.log("Sliced data into", slicedData.length, "chunks.");
  const response = await Promise.all(
    slicedData.map((dataChunk) => requestToArcXP({ records: dataChunk }))
  );
  console.log("All data chunks processed and sent to Arc.", response.length);
  return response;
};
