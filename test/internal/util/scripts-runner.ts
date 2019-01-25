import { assert } from "chai";

import { runScript } from "../../../src/internal/util/scripts-runner";
import { useFixtureProject } from "../../helpers/project";

const TS_NODE_ARGS = [
  "--require",
  "dotenv/config",
  "--require",
  "ts-node/register"
];

describe("Scripts runner", () => {
  useFixtureProject("project-with-scripts");

  it("Should load buidler/register successfully", async () => {
    const statusCode = await runScript(
      "./successful-script.js",
      [],
      [...TS_NODE_ARGS, "--require", __dirname + "/../../../src/register"]
    );
    assert.equal(statusCode, 0);

    // We check here that the script is correctly testing this:
    const statusCode2 = await runScript("./successful-script.js");
    assert.notEqual(statusCode2, 0);
  });

  it("Should pass params to the script", async () => {
    const statusCode = await runScript("./params-script.js", ["a", "b", "c"]);
    assert.equal(statusCode, 0);

    // We check here that the script is correctly testing this:
    const statusCode2 = await runScript("./params-script.js");
    assert.notEqual(statusCode2, 0);
  });

  it("Should run the script to completion", async () => {
    const before = new Date();
    await runScript("./async-script.js");
    const after = new Date();

    assert.isAtLeast(after.getTime() - before.getTime(), 100);
  });

  it("Should resolve to the status code of the script run", async () => {
    const statusCode1 = await runScript("./async-script.js");
    assert.equal(statusCode1, 0);

    const statusCode2 = await runScript("./failing-script.js");
    assert.notEqual(statusCode2, 0);

    const statusCode3 = await runScript(
      "./successful-script.js",
      [],
      [...TS_NODE_ARGS, "--require", __dirname + "/../../../src/register"]
    );
    assert.equal(statusCode3, 0);
  });
});
