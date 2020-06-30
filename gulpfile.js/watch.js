const { watch, src, dest } = require("gulp");
const ts = require("gulp-typescript");
const fs = require("fs");
const tsConfig = require("../tsconfig.json");
const { info, error, success } = require("./logs");
const transpile = require("./transpile");

const tsProject = ts.createProject(tsConfig.compilerOptions);

module.exports = function watchTS(cb) {
	const inRoot = "src/";
	const outRoot = "dist/";
	const globToWatch = "src/**/*.ts";

	// Path manipulation helpers
	const convertPath = (path) => path.replace(inRoot, outRoot);
	const fileName = (path) => path.split("/").pop();
	const pathNoFile = (path) => convertPath(path).replace(fileName(path), "");
	const convertExtensionAndPath = (path) =>
		convertPath(path).replace(".ts", ".js");

	const watcher = watch([globToWatch]);

	watcher.on("change", function (inPath) {
		const outPath = pathNoFile(inPath);

		info(`Compiling ${inPath} --> ${outPath}`);

		let transpileError = false;
		src(inPath)
			.pipe(tsProject(ts.reporter.longReporter()))
			.on("error", (err) => {
				transpileError = true;
				error(err);
				error("Error transpiling TypeScript");
			})
			.pipe(dest(outPath))
			.on("end", (obj) => {
				if (!transpileError) success("Transpiled TypeScript successfully");
			});
	});

	watcher.on("ready", () => {
		transpile(() => {
			success("Transpiled TypeScript successfully");
		});
	});

	watcher.on("add", function (inPath) {
		info(`File ${inPath} was added`);

		const outPath = convertExtensionAndPath(inPath);

		fs.writeFile(outPath, "", (err) => {
			if (err) {
				error(err);
			} else {
				info(`Wrote file ${outPath}`);
			}
		});
	});

	watcher.on("unlink", function (inPath) {
		info(`File ${inPath} was removed`);

		const outPath = convertExtensionAndPath(inPath);

		fs.unlink(outPath, (err) => {
			if (err) {
				error(err);
			} else {
				info(`Removed ${outPath}`);
			}
		});
	});

	watcher.on("close", () => {
		cb();
	});
};
