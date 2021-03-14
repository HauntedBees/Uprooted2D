const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const Filter = async function(type, subpath, specifics) {
	const inpath = path.join(__dirname, "../img", subpath);
	const outpath = path.join(__dirname, `../img${type}`, subpath);
	const files = fs.readdirSync(inpath);
	if(!fs.existsSync(outpath)) { fs.mkdirSync(outpath); }

	const Processes = {
		"hq4x": f => new Promise((resolve, reject) => {
			const cmd = ffmpeg(path.join(inpath, f));
			cmd.outputOptions(["-y", "-vf", "scale=iw/4:ih/4:flags=neighbor,hqx=4"]);
			cmd.output(path.join(outpath, f));
			cmd.on("end", () => { console.log(`Processed ${subpath}/${f}`); resolve(true); });
			cmd.on("error", () => reject());
			cmd.run();
		})
		// TODO: scale4x?
	};

	for(let i = 0; i < files.length; i++) {
		const f = files[i];
		const inputpath = path.join(inpath, f);
		if(specifics.length && specifics.indexOf(f.split(".")[0]) < 0) { continue; }
		if(fs.lstatSync(inputpath).isDirectory()) {
			await Filter(type, f, specifics);
		} else {
			await Processes[type](f);
		}
	}
}

const type = process.argv[2].toLowerCase();
Filter(type, "", process.argv.slice(3));