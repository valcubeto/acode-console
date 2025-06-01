System.register("esbuild.config", ["esbuild", "child_process"], function (exports_1, context_1) {
    "use strict";
    var esbuild, child_process_1, isServe, zipPlugin, buildConfig;
    var __moduleName = context_1 && context_1.id;
    // Function to pack the ZIP file
    function packZip() {
        child_process_1.exec("node .vscode/pack-zip.js", (err, stdout, stderr) => {
            if (err || stderr) {
                console.error("Error packing zip:");
                console.error({ err, stderr });
                return;
            }
            console.log(stdout.trim());
        });
    }
    return {
        setters: [
            function (esbuild_1) {
                esbuild = esbuild_1;
            },
            function (child_process_1_1) {
                child_process_1 = child_process_1_1;
            }
        ],
        execute: function () {
            isServe = process.argv.includes("--serve");
            // Custom plugin to pack ZIP after build or rebuild
            zipPlugin = {
                name: "zip-plugin",
                setup(build) {
                    build.onEnd(packZip);
                }
            };
            // Base build configuration
            buildConfig = {
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
        }
    };
});
System.register("src/main", ["fs"], function (exports_2, context_2) {
    "use strict";
    var fs_1, plugin, AcodePlugin;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (fs_1_1) {
                fs_1 = fs_1_1;
            }
        ],
        execute: function () {
            plugin = JSON.parse(fs_1.readFileSync('plugin.json', 'utf8'));
            AcodePlugin = class AcodePlugin {
                baseUrl;
                async init($page, cacheFile, cacheFileUrl) {
                    // Add your initialization code here
                }
                async destroy() {
                    // Add your cleanup code here
                }
            };
            if (window.acode) {
                const acodePlugin = new AcodePlugin();
                acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
                    if (!baseUrl.endsWith('/')) {
                        baseUrl += '/';
                    }
                    acodePlugin.baseUrl = baseUrl;
                    await acodePlugin.init($page, cacheFile, cacheFileUrl);
                });
                acode.setPluginUnmount(plugin.id, () => {
                    acodePlugin.destroy();
                });
            }
        }
    };
});
