import { initPitcherClient } from "@codesandbox/pitcher-client";

import { SandboxWithoutClient } from "./sandbox";
import { DEFAULT_SUBSCRIPTIONS, type SandboxStartData } from "./sandbox-client";

export { SandboxStartData };

/**
 * With this function you can connect to a sandbox from the browser.
 *
 * ## Why does this exist?
 *
 * The CodeSandbox API is a REST API that you can use to control sandboxes. However, it
 * requires your CodeSandbox API token to be sent with every request. This makes it
 * unsafe to use from the browser, where you don't want to expose your API token.
 *
 * With this helper function, you can create a connection to a sandbox without
 * exposing your API token.
 *
 * ## Example
 *
 * To use this function, you first need to start a sandbox on the server:
 *
 * ```ts
 * import { CodeSandbox } from "@codesandbox/sdk";
 *
 * const client = new CodeSandbox(apiToken);
 *
 * const startData = await client.sandbox.start("my-sandbox-id");
 * ```
 *
 * Then you can start a sandbox using this start data in the browser:
 *
 * ```ts
 * import { connectToSandbox } from "@codesandbox/sdk/browser";
 *
 * // Get the start data from the server
 * const startData = ...;
 *
 * const sandbox = await connectToSandbox(startData);
 * ```
 */
export async function connectToSandbox(
  startInfo: SandboxStartData,
): Promise<SandboxWithoutClient> {
  const pitcherClient = await initPitcherClient(
    {
      appId: "sdk",
      instanceId: startInfo.id,
      onFocusChange() {
        return () => {};
      },
      requestPitcherInstance: async () => {
        const data = startInfo;

        return {
          bootupType: data.bootup_type as
            | "RUNNING"
            | "CLEAN"
            | "RESUME"
            | "FORK",
          pitcherURL: data.pitcher_url,
          workspacePath: data.workspace_path,
          userWorkspacePath: data.user_workspace_path,
          pitcherManagerVersion: data.pitcher_manager_version,
          pitcherVersion: data.pitcher_version,
          latestPitcherVersion: data.latest_pitcher_version,
          pitcherToken: data.pitcher_token,
          cluster: data.cluster,
        };
      },
      subscriptions: DEFAULT_SUBSCRIPTIONS,
    },
    () => {},
  );

  return new SandboxWithoutClient(pitcherClient);
}
