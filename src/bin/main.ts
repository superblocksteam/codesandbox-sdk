import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { buildCommand } from "./commands/build";
import { forkSandbox } from "./commands/sandbox/fork";
import { hibernateSandbox } from "./commands/sandbox/hibernate";
import { shutdownSandbox } from "./commands/sandbox/shutdown";

yargs(hideBin(process.argv))
  .usage("CodeSandbox SDK CLI - Manage your CodeSandbox projects")
  .demandCommand(1, "Usage: csb <command> [options]")
  .scriptName("csb")
  .strict()
  .recommendCommands()
  .command(buildCommand)
  .command(
    "sandbox <action> <id>",
    "Manage sandboxes",
    (yargs) => {
      return yargs
        .positional("action", {
          describe: "Action to perform on the sandbox",
          choices: ["hibernate", "fork", "shutdown"],
          type: "string",
        })
        .positional("id", {
          describe: "ID of the sandbox",
          type: "string",
          demandOption: true,
        });
    },
    async (argv) => {
      if (argv.action === "hibernate") {
        await hibernateSandbox(argv.id);
      } else if (argv.action === "fork") {
        await forkSandbox(argv.id);
      } else if (argv.action === "shutdown") {
        await shutdownSandbox(argv.id);
      }
    }
  )
  .parse();
