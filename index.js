const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const { encryptFile } = require("./src/encrypt");

try {
  const region = core.getInput("aws-region");
  const cmk = core.getInput("aws-cmk");
  const inputFile = core.getInput("config-file-location");

  const configFileLocation = path.join(github.workspace, inputFile);
  console.log(configFileLocation, github.workspace);
  const encryptedFile = encryptFile({ region, cmk, configFileLocation });
  core.setOutput("encrypted-file-location", encryptedFile);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
