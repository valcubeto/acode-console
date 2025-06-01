import * as esbuild from "esbuild";
import { exec } from "child_process";

const isServe = process.argv.includes("--serve");

// Function to pack the ZIP file
function packZip() {
  exec("bun .vscode/pack-zip.js", (err, stdout, stderr) => {
    if (err || stderr) {
      console.error("Error packing zip:");
      console.error({ err, stderr });
      return;
    }
    console.log(stdout.trim());
  });
}

// Custom plugin to pack ZIP after build or rebuild
const zipPlugin = {
  name: "zip-plugin",
  setup(build) {
    build.onEnd(packZip);
  }
};

// Base build configuration
let buildConfig = {
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  logLevel: "info",
  color: true,
  outdir: "dist",
  plugins: [zipPlugin]
};

// Main function to handle both serve and production builds
(async function () {
  if (!isServe) {
    console.log("Building for production...");

    await esbuild.build(buildConfig);

    console.log("Production build complete.");
    return;
  }
  console.log("Starting development server...");

  // Watch and Serve Mode
  const ctx = await esbuild.context(buildConfig);

  await ctx.watch();
  const { host, port } = await ctx.serve({
    servedir: ".",
    port: 3000
  });

  console.log(`Serving on http://${host}:${port}`);
})();
