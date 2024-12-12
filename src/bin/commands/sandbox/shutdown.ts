import ora from "ora";

import { CodeSandbox } from "../../../";

export async function shutdownSandbox(sandboxId: string) {
  const sdk = new CodeSandbox();

  const spinner = ora("Shutting down sandbox...").start();
  await sdk.sandbox.shutdown(sandboxId);
  spinner.succeed("Sandbox shutdown successfully");

  // eslint-disable-next-line no-console
  console.log(sandboxId);
}
