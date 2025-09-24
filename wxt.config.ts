import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";

const appInfo = JSON.parse(
  fs.readFileSync(resolve(__dirname, "package.json"), "utf-8")
);

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: [
      "activeTab",
      "scripting",
      "sidePanel",
      "storage",
      "tabs",
      "downloads",
    ],
    action: {},
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
  },
  vite: () => ({
    define: {
      "process.env.APP_VERSION": JSON.stringify(appInfo.version),
    },
  }),
  modules: ["@wxt-dev/module-react"],
});
