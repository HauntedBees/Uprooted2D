const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const { spawn } = require("child_process");
const s2xpath = "C:/scale2x/scalex.exe";

const Resize = async function(inPath, tempPath, outPath, callback) {
    const img = sharp(inPath);
    return img.metadata().then(metadata => {
        img.extend({ top: 0, left: 0, right: 0, bottom: 0, background:"#00000000" })
            .resize({ width: metadata.width * 0.25, kernel: sharp.kernel.nearest }).toFile(tempPath, () => {
            imagemin([tempPath], {
                destination: tempPath,
                plugins: [imageminPngquant()]
            }).then(() => callback(tempPath, outPath));
        });
    });
}

const Filter = async function(type, subpath, specifics) {
	const inpath = path.join(__dirname, "../img", subpath);
	const temppath = path.join(__dirname, `temp/img${type}`, subpath);
	const outpath = path.join(__dirname, `../img${type}`, subpath);
	const files = fs.readdirSync(inpath);
	if(!fs.existsSync(temppath)) { fs.mkdirSync(temppath); }
	if(!fs.existsSync(outpath)) { fs.mkdirSync(outpath); }

	const Processes = {
		"hq4x": f => new Promise((resolve, reject) => {
			const cmd = ffmpeg(path.join(inpath, f));
			cmd.outputOptions(["-y", "-vf", "scale=iw/4:ih/4:flags=neighbor,hqx=4"]);
			cmd.output(path.join(outpath, f));
			cmd.on("end", () => { console.log(`Processed ${subpath}/${f}`); resolve(true); });
			cmd.on("error", () => reject());
			cmd.run();
		}),
		"s4xe": f => new Promise((resolve, reject) => {
			Resize(path.join(inpath, f), path.join(temppath, f), path.join(outpath, f), (infile, outfile) => {
				const s4x = spawn(s2xpath, ["-k", "4", infile, outfile]);
				s4x.on("close", () => { console.log(`Processed ${subpath}/${f}`); resolve(true) });
				s4x.stderr.on("data", () => reject());
			});
		})
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