import fs from "fs";
import csv from "csv-parser";
import validator from "validator";
import path from "path";
import {
  FULL_HEADERS,
  DEFAULT_HEADERS,
  COMPLETE_NAME_PATTERN,
  DISPLAY_NAME_PATTERN,
  ADDRESS_PATTERN,
} from "./constants.js";
import { fotmatJsonResult, mapHeaders } from "./helpers.js";
import { processToSendDataToArc } from "./processDataToSendToArc.js";

const directoryUploads = process.cwd() + "/csvs";
const directoryLogs = process.cwd() + "/logs";

const errorText = (header, index, valueColumn) => {
  return `Empty value or incorrect value for header "${header}" at row ${
    index + 1
  } value received: "${valueColumn}" \n`;
};

const processFile = async (file, headings) => {
  let parsingError = "";
  console.log("File processing and validation has begun.");

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
      console.error("Parsing error:", err.message);
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
    const logPath = path.join(directoryLogs, "csv_error_logs.txt");
    fs.writeFile(logPath, dataParsed, (err) => {
      if (err) {
        console.error("Error creating CSV error file:", err);
      } else {
        console.log("CSV errors have been regitered in this file: ", logPath);
      }
    });
    return null;
  }
  console.log("File processing and validation completed.");
  return dataParsed;
};

const uploadCsvFileToServer = async (file) => {
  await fs.promises
    .mkdir(directoryUploads, { recursive: true })
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

const saveDataLog = async (data) => {
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

    console.log(
      "Total error requests:",
      errorRequests.length,
      "Total success requests:",
      successRequests.length
    );

    const currentDate = new Date().toISOString().replace(/[:.]/g, "-");
    if (errorRequests.length > 0) {
      const objectResult = JSON.stringify({ records: errorRequests }, null, 2);
      const logPath = path.join(
        directoryLogs,
        `error_logs_request_${currentDate}.json`
      );
      await fs.promises.writeFile(logPath, objectResult);
      console.log("Success log saved at:", logPath);
    }

    if (successRequests.length > 0) {
      const objectResult = JSON.stringify(
        { records: successRequests },
        null,
        2
      );
      const logPath = path.join(
        directoryLogs,
        `success_logs_request_${currentDate}.json`
      );
      await fs.promises.writeFile(logPath, objectResult);
      console.log("Success log saved at:", logPath);
    }
  } catch (error) {
    console.error("Error saving data logs:", error);
  }
};

const userMigrationArcIdentityController = async (req) => {
  const file = await uploadCsvFileToServer(req.files.files);
  const dataParsed = await processFile(file, req.body.headings);
  console.log("Data parsed length:", dataParsed ? dataParsed.length : 0);
  if (dataParsed === null) {
    console.log("File processing failed due to validation errors.");
    return [];
  }

  let responseData = [];
  try {
    responseData = await processToSendDataToArc(dataParsed);
  } catch (error) {
    console.error("Error during user migration process:", error);
  }

  console.log("User migration process completed.", responseData.length);
  await saveDataLog(responseData).catch(() => {});
  console.log("Data logs saved.");
};

export default userMigrationArcIdentityController;
