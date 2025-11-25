import express from "express";
import fileUpload from "express-fileupload";
import userMigrationArcIdentityService from "./userMigrationArcidentity.service.js";

const app = express();
app.use(fileUpload());

app.post("/csvprocess", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ error: "No files were uploaded." });
  }

  if (
    !req.body.headings ||
    req.body.headings.length === 0 ||
    !["full", "default"].includes(req.body.headings)
  ) {
    return res
      .status(400)
      .send({ error: "No valid type headings were provided." });
  }

  userMigrationArcIdentityService(req);

  return res.send({
    message:
      "This process runs in the background and will take a few minutes to complete.",
  });
});

app.listen(3000);
