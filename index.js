const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const { encryptFile } = require("./src/encrypt");

try {
  const region = core.getInput("aws-region");
  const cmk = core.getInput("aws-cmk");
  const inputFile = core.getInput("config-file-location");
  const accessKeyId = core.getInput("aws-access-key-id");
  const secretAccessKey = core.getInput("aws-secret-access-key");

  const configFileLocation = path.join(process.env.GITHUB_WORKSPACE, inputFile);
  const encryptedFile = encryptFile({
    region,
    cmk,
    configFileLocation,
    accessKeyId,
    secretAccessKey,
  });
  core.setOutput("encrypted-file-location", encryptedFile);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
