import fs from "fs";
import csv from "csv-parser";
import validator from "validator";
import path from "path";
import { createLogger, transports, format } from "winston";
import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });
import {
  FULL_HEADERS,
  DEFAULT_HEADERS,
  COMPLETE_NAME_PATTERN,
  DISPLAY_NAME_PATTERN,
  ADDRESS_PATTERN,
} from "./constants.js";
import { fotmatJsonResult, mapHeaders } from "./helpers.js";
import { processToSendDataToArc } from "./processDataToSendToArc.js";

const currentDate = new Date().toISOString().replace(/[:.]/g, "-");
console.log("Current date for logs: ", process.env.CSV_UPLOAD_DIR);
const directoryUploads =
  process.cwd() + (process.env.CSV_UPLOAD_DIR || "/csv_uploads");
const directoryLogRequest =
  process.cwd() + (process.env.LOG_REQUEST_DIR || "/logs_requests");
const directoryLogs = process.cwd() + (process.env.LOG_DIR || "/logs");

const errorText = (header, index, valueColumn) => {
  return `Empty value or incorrect value for header "${header}" at row ${
    index + 1
  } value received: "${valueColumn}" \n`;
};

const processFile = async (file, headings, logger) => {
  let parsingError = "";
  logger.info({
    message: "File processing and validation has begun.",
  });

  const promise = new Promise((resolve, reject) => {
    const results = [];

    const mapValuesAditional = ({ header, index, value }) => {
      let valueColumn = value ? value.trim() : "";

      const validationTypeEmpty =
        typeof valueColumn !== "string" ||
        validator.isEmpty(valueColumn) === true;

      if (
        header === "email" &&
        (validationTypeEmpty || validator.isEmail(valueColumn) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "userName" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 5, max: 100 }) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        (header === "credentials" ||
          header === "lastLoginDate" ||
          header === "createdOn") &&
        validationTypeEmpty
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "grantType" &&
        (validationTypeEmpty ||
          !["password", "facebook", "google", "apple"].includes(valueColumn))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        (header === "firstName" || header === "lastName") &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 100 }) === false ||
          !validator.matches(valueColumn, COMPLETE_NAME_PATTERN))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "secondLastName" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 50 }) === false ||
          !validator.matches(valueColumn, COMPLETE_NAME_PATTERN))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "displayName" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 100 }) === false ||
          !validator.matches(valueColumn, DISPLAY_NAME_PATTERN))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "gender" &&
        (validationTypeEmpty ||
          !["MALE", "FEMALE", "NON_CONFORMING", "PREFER_NOT_TO_SAY"].includes(
            valueColumn
          ))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "birthYear" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 4, max: 4 }) === false ||
          validator.matches(valueColumn, /^[1-9][0-9]{3}/) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "birthMonth" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 2, max: 2 }) === false ||
          validator.matches(valueColumn, /^[0][1-9]|^[1-9][0-2]?/) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "birthDay" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 2, max: 2 }) === false ||
          validator.matches(
            valueColumn,
            /^[0][1-9]|^([1-9]|[12][0-9]|3[01])$/
          ) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "phone" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 0, max: 19 }) === false ||
          validator.matches(valueColumn, /[0-9-]+/) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "typeContacts" &&
        (validationTypeEmpty ||
          !["WORK", "HOME", "PRIMARY", "OTHER"].includes(valueColumn))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        (header === "line1" || header == "line2") &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 256 }) === false ||
          !validator.matches(valueColumn, /[a-zA-Z-_0-9]+/))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "locality" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 100 }) === false ||
          !validator.matches(valueColumn, ADDRESS_PATTERN))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "region" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 256 }) === false ||
          !validator.matches(valueColumn, ADDRESS_PATTERN))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "postal" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 6, max: 6 }) === false ||
          !validator.matches(valueColumn, /[\p{L}0-9_-]+/))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "country" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 2, max: 2 }) === false ||
          !validator.matches(valueColumn, /^[A-Z]{2}/))
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "typeAddresses" &&
        (validationTypeEmpty ||
          ["WORK", "HOME", "PRIMARY", "OTHER"].includes(valueColumn) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "name" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 30 }) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "value" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 1000 }) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "typeAttributes" &&
        (validationTypeEmpty ||
          ["String", "Number", "Boolean", "Date"].includes(valueColumn) ===
            false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "legacyId" &&
        (validationTypeEmpty ||
          validator.isLength(valueColumn, { min: 1, max: 50 }) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "deletionRule" &&
        (validator.isEmpty(valueColumn) === true ||
          validator.isInt(valueColumn) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      if (
        header === "emailVerified" &&
        (validator.isEmpty(valueColumn) === true ||
          validator.isBoolean(valueColumn) === false)
      ) {
        parsingError += errorText(header, index, valueColumn);
        parser.end();
      }

      return valueColumn;
    };
    const parser = fs.createReadStream(file).pipe(
      csv({
        mapHeaders: mapHeaders,
        mapValues: mapValuesAditional,
      })
    );

    parser.on("headers", (headers) => {
      const headersCsv = headings === "full" ? FULL_HEADERS : DEFAULT_HEADERS;
      if (headers.some((header) => !headersCsv.includes(header))) {
        parsingError += `Invalid headers found: ${headers.filter(
          (header) => !headersCsv.includes(header)
        )} \n`;
        parser.end();
      }
    });
    parser.on("data", (data) => {
      const dataResult = fotmatJsonResult(data);
      results.push(dataResult);
    });
    parser.on("error", (err) => {
      parsingError = err;
      logger.error({ message: `Parsing error: ${err.message}` });
      parser.end();
    });
    parser.on("end", () => {
      if (parsingError !== "") {
        resolve(parsingError);
      } else {
        resolve(results);
      }
    });
  });

  const dataParsed = await promise;

  if (typeof dataParsed === "string" && dataParsed !== "") {
    const logPath = path.join(directoryLogs, "csv_error_logs.log");
    fs.writeFile(logPath, dataParsed, (err) => {
      if (err) {
        logger.error({
          message: `Error creating CSV error file: ${err.message}`,
        });
      } else {
        logger.info({
          message: `CSV errors have been registered in this file: ${logPath}`,
        });
      }
    });
    return null;
  }
  logger.info({
    message: "File processing and validation completed.",
  });
  return dataParsed;
};

const uploadCsvFileToServer = async (file) => {
  await fs.promises
    .mkdir(directoryUploads, { recursive: true })
    .catch(() => {});
  await fs.promises
    .mkdir(directoryLogRequest, { recursive: true })
    .catch(() => {});
  await fs.promises.mkdir(directoryLogs, { recursive: true }).catch(() => {});

  const csvFile = file;
  const ext = path.extname(csvFile.name) || ".csv";
  const base = path.basename(csvFile.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
  const safeDate = new Date().toISOString().replace(/[:.]/g, "-");
  const uploadPath = path.join(directoryUploads, `${base}_${safeDate}${ext}`);
  await new Promise((resolve, reject) => {
    csvFile.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  return uploadPath;
};

const saveDataLog = async (data, logger) => {
  try {
    let errorRequests = [];
    let successRequests = [];

    (data || []).forEach((item) => {
      const records = item.ok ? item.data : [];
      records.forEach((element) => {
        if (element.success === false && element.errorMessage !== "")
          errorRequests.push(element);

        if (element.success === true && element.errorMessage == "")
          successRequests.push(element);
      });
    });

    logger.info({
      message: `Total error requests: ${errorRequests.length}, Total success requests: ${successRequests.length}`,
    });

    if (errorRequests.length > 0) {
      const objectResult = JSON.stringify({ records: errorRequests }, null, 2);
      const logPath = path.join(
        directoryLogRequest,
        `error_logs_request_${currentDate}.json`
      );
      await fs.promises.writeFile(logPath, objectResult);
      logger.info({ message: `Error log saved at: ${logPath}` });
    }

    if (successRequests.length > 0) {
      const objectResult = JSON.stringify(
        { records: successRequests },
        null,
        2
      );
      const logPath = path.join(
        directoryLogRequest,
        `success_logs_request_${currentDate}.json`
      );
      await fs.promises.writeFile(logPath, objectResult);
      logger.info({
        message: `Success log saved at: ${logPath}`,
      });
    }
  } catch (error) {
    logger.error({
      message: `Error saving data logs: ${error.message}`,
    });
  }
};

const userMigrationArcIdentityController = async (req) => {
  console.log("User migration process started.");
  const logger = createLogger({
    format: format.combine(format.timestamp(), format.json(), format.simple()),
    transports: [
      new transports.File({ filename: directoryLogs + `/${currentDate}.log` }),
    ],
  });
  logger.info({ message: "User migration process started.", type: "info" });
  const file = await uploadCsvFileToServer(req.files.files);
  const dataParsed = await processFile(file, req.body.headings, logger);
  logger.info({
    message: "Data parsed length: " + (dataParsed ? dataParsed.length : 0),
  });
  if (dataParsed === null) {
    logger.error({
      message: "File processing failed due to validation errors.",
    });
    console.log("File processing failed due to validation errors.");
    return;
  }

  let responseData = [];
  try {
    responseData = await processToSendDataToArc(dataParsed, logger);
    console.log("Data has been sent to Arc for processing.");
    logger.info({
      message: "Data has been sent to Arc for processing.",
    });
  } catch (error) {
    logger.error({
      message: `Error during user migration process: ${error.message}`,
    });
    console.log(`Error during user migration process: ${error.message}`);
    return;
  }
  logger.info({ message: "User migration process completed." });
  await saveDataLog(responseData, logger).catch(() => {});
  logger.info({ message: "Data logs have been saved." });
  console.log("User migration process completed.");
};

export default userMigrationArcIdentityController;
