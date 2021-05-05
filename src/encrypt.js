"use strict";
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

async function encryptFile({ region, cmk, configFileLocation }) {
  AWS.config.update({
    region,
    credentials: {
      accessKeyId: process.evn.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  if (!fs.existsSync(configFileLocation)) {
    throw Error(`Conbfig file location: ${configFileLocation} doesn't exists`);
  }

  const kmsEncrypt = async (plaintext) => {
    const kms = new AWS.KMS();
    const params = {
      KeyId: cmk,
      Plaintext: Buffer.from(plaintext),
    };
    const encrypted = await kms.encrypt(params).promise();
    return encrypted.CiphertextBlob.toString("base64");
  };

  const rawdata = fs.readFileSync(configFileLocation);
  const config = JSON.parse(rawdata);
  if (!config.Environment || !config.Environment.Variables) {
    throw Error(`There isn't any environment variables present in config file`);
  }
  const variablesNames = Object.keys(config.Environment.Variables);
  for (const name of variablesNames) {
    config.Environment.Variables[name] = await kmsEncrypt(
      config.Environment.Variables[name]
    );
    console.log("encrypted: ", config.Environment.Variables[name]);
  }
  const filename = path.basename(configFileLocation, "json");
  const basepath = path.dirname(configFileLocation);
  const encryptedFilename = `${filename}.encrypted.json`;
  fs.writeFileSync(encryptedFilename, JSON.stringify(config, null, 2));

  return path.join(basepath, encryptedFilename);
}

module.exports.encryptFile = encryptFile;
