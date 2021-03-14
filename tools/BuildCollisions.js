const fs = require("fs");
const path = require("path");
const getPixels = require("get-pixels");

const colpath = path.join(__dirname, "collisionimg");
const BuildCollisions = async function() {
	const cols = {};
	const promises = fs.readdirSync(colpath).map(f => {
		return new Promise((resolve, reject) => {
			getPixels(path.join(colpath, f), (e, p) => {
				if(e) { reject(e); }
				const width = p.shape[0];
				const height = p.shape[1];
				const res = [];
				for(let y = 0; y < height; y++) {
					const row = [];
					for(let x = 0; x < width; x++) {
						const idx = 4 * (y * width + x);
						row.push(p.data[idx + 3] >= 250);
					}
					res.push(row);
				}
				cols[f.split(".")[0]] = res;
				resolve(true);
			});
		});
	});
	await Promise.all(promises);
	const vals = [];
	for(const key in cols) {
		const str = JSON.stringify(cols[key]).replace(/"/g, "").replace(/(?:[^\,]*\,){500}/g, "$&\n");
		vals.push(`"${key}": ${str}`);
	}
	fs.writeFileSync(path.join(__dirname, "../js/worldmap/collisions.js"), `const collisions = {
${vals.join(",\n")}
};`);
	console.log("Built Collisions");
};
const BuildCaveCollisions = async function() {
	const ProcessChunk = function(pData, topx, topy, fullwidth, size) {
		const res = [];
		for(let y = topy; y < topy + size; y++) {
			const row = [];
			for(let x = topx; x < topx + size; x++) {
				const idx = 4 * (y * fullwidth + x); // RGBA
				if(pData[idx + 3] === 0) { // 0A = empty
					row.push(0);
					continue;
				}
				if(pData[idx] >= 250) { // 255R
					if(pData[idx + 1] >= 250) { // 255R255G
						if(pData[idx + 2] >= 250) { // 255R255G255B = white
							row.push(10); // boss
						} else { // 255R255G = yellow
							row.push(2); // treasure
						}
					} else { // 255R0G = red
						const blue = pData[idx + 2];                            
						if(blue < 50) {
							row.push(3); // 255R0B = enemy type A
						} else if(blue < 200) { 
							row.push(4); // 255R155B = enemy type B
						} else {
							row.push(5); // 255R255B = enemy type C
						}
					}
				} else if(pData[idx + 1] >= 250) { // 255G
					if(pData[idx + 2] >= 250) { // 255G255B
						row.push(12); // healing station
					} else {
						row.push(11); // guranteed hole
					}
				} else if(pData[idx + 2] >= 250) { // 255B
					row.push(9); // guranteed treasure
				} else { // 0R0G0B
					row.push(1); // wall
				}
			}
			res.push(row);
		}
		return res;
	}
	const ArrToJSON = res => JSON.stringify(res)
								 .replace(/]/g, "]\r\n")
								 .replace(/\[\[\[/g, "[\r\n[[")
								 .replace(/,\[\[/g, ",\r\n[[") + ";\r\n";
	getPixels(path.join(__dirname, "cave.png"), (e, p) => {
		const width = p.shape[0], height = p.shape[1];
		const colSm = [];
		for(let y = 1; y < 43; y += 6) { // small chunks
			for(let x = 1; x < width; x += 6) {
				colSm.push(ProcessChunk(p.data, x, y, width, 5));
			}
		}
		const colMd = [];
		for(let y = 43; y < 79; y += 12) { // medium chunks
			for(let x = 1; x < width; x += 12) {
				colMd.push(ProcessChunk(p.data, x, y, width, 11));                    
			}
		}

		const colLg = [];
		for(var y = 79; y < height; y += 24) { // boss chunks
			for(var x = 1; x < width; x += 24) {
				colLg.push(ProcessChunk(p.data, x, y, width, 23));                    
			}
		}
		const resStr = `const cavecollisions = ${ArrToJSON(colSm)}
const cavecollisionsMed = ${ArrToJSON(colMd)}
const cavecollisionsBoss = ${ArrToJSON(colLg)}`;
		fs.writeFileSync(path.join(__dirname, "../js/worldmap/cavecollisions.js"), resStr);
		console.log("Built Cave Collisions");
	});
};

BuildCollisions();
BuildCaveCollisions();