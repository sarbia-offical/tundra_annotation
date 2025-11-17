import { defineConfig } from "wxt";
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
  analysis: {
    enabled: process.env.NODE_ENV === "production",
  },
  vite: (env) => ({
    define: {
      "process.env.APP_VERSION": JSON.stringify(appInfo.version),
    },
    build: {
      minify: "esbuild",
      target: "esnext",
      cssMinify: true,
      rollupOptions: {
        output: {
          compact: true,
        },
      },
    },
    esbuild: {
      drop: env.command === "build" ? ["console", "debugger"] : [],
      legalComments: "none",
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
  }),
  modules: ["@wxt-dev/module-react"],
});
