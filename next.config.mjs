
import { withLingo } from "@lingo.dev/compiler/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default async function config() {
  return await withLingo(nextConfig, {
    sourceRoot: "./src/app",
    sourceLocale: "en",
    targetLocales: ["es", "de", "fr"],
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
    buildMode: "translate",
  });
}
