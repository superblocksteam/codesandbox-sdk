import ora from "ora";

import { CodeSandbox } from "../../../";

export async function hibernateSandbox(sandboxId: string) {
  const sdk = new CodeSandbox();

  const spinner = ora("Hibernating sandbox...").start();
  await sdk.sandbox.hibernate(sandboxId);
  spinner.succeed("Sandbox hibernated successfully");

  // eslint-disable-next-line no-console
  console.log(sandboxId);
}
