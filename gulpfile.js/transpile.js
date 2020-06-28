const { src, dest } = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const { info, error } = require("./logs");

const outputPath = "./dist";
const inputPath = "./src";

function transpile(cb) {
	info("Starting TypeScript compiler");
	src(`${inputPath}/**/*.ts`)
		.pipe(tsProject())
		.on("error", (err) => {
			error(err.message);
			process.kill(process.pid, "SIGINT");
		})
		.pipe(dest(outputPath));
	cb();
}

module.exports = transpile;
