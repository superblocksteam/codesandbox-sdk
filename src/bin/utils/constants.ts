/* eslint-disable no-console */

export const BASE_URL = process.env.BASE_URL ?? "https://api.codesandbox.io";

export const getApiKey = () => {
  const _API_KEY = process.env.CSB_API_KEY;
  if (!_API_KEY) {
    console.error("CSB_API_KEY environment variable is not set");
    console.error("You can generate one at https://codesandbox.io/t/api");
    process.exit(1);
  }

  return _API_KEY;
};
