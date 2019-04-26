var gulp = require("gulp");
var fs = require("fs");
var cp = require("child_process");
var foreach = require("gulp-foreach");
var getPixels = require("get-pixels");
gulp.task("default", function(cb) {
    var version = Math.floor(1000 * Math.random());
    fs.writeFile("junk/logging.js", "console.log('Code Version: " + version + "');", function() { console.log(version); });
    cp.execFile("uglify.cmd");
    cp.execFile("uglifymin.cmd");
    cb();
});
gulp.task("watch", function() {
    return gulp.watch("./js/**/*.*", gulp.series("default"));
});
gulp.task("egg", function() {
    console.log("poop");
});
gulp.task("buildcollisions", function() {
    fs.writeFile("js/worldmap/collisions.js", "const collisions = {\r\n");
    return gulp.src("./collision/*.png").pipe(foreach(function(stream, file) {
        var pathArr = file.path.split("\\");
        var len = pathArr.length;
        var path = pathArr[len - 2] + "/" + pathArr[len - 1];
        var name = pathArr[len - 1].replace(".png", "");
        getPixels(path, function(e, p) {
            var width = p.shape[0];
            var height = p.shape[1];
            var res = [];
            for(var y = 0; y < height; y++) {
                var row = [];
                for(var x = 0; x < width; x++) {
                    var idx = 4 * (y * width + x);
                    row.push(p.data[idx + 3] >= 250);
                }
                res.push(row);
            }
            var str = JSON.stringify(res);
            str = str.replace(/(?:[^\,]*\,){500}/g, "$&\n");
            fs.appendFile("js/worldmap/collisions.js", "\"" + name + "\": " + str + ", \r\n");
        });
        return stream;
    }));
    // NOTE: currently you must manually delete the final comma and add the "};" to the end of the file.
});
gulp.task("buildcavecollisions", function() {
    fs.writeFile("js/worldmap/cavecollisions.js", "");
    return gulp.src("./extbuild/cave.png").pipe(foreach(function(stream, file) {
        var pathArr = file.path.split("\\");
        var len = pathArr.length;
        var path = pathArr[len - 2] + "/" + pathArr[len - 1];
        var ProcessChunk = function(pData, topx, topy, fullwidth, size) {
            var res = [];
            for(var y = topy; y < topy + size; y++) {
                var row = [];
                for(var x = topx; x < topx + size; x++) {
                    var idx = 4 * (y * fullwidth + x); // RGBA
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
                            var blue = pData[idx + 2];                            
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
        };
        var ArrToJSON = function(res) {
            var str = JSON.stringify(res);
            str = str.replace(/]/g, "]\r\n").replace(/\[\[\[/g, "[\r\n[[").replace(/,\[\[/g, ",\r\n[[") + ";\r\n";
            return str;
        };
        getPixels(path, function(e, p) {
            var width = p.shape[0], height = p.shape[1];
            var res = [];
            fs.appendFile("js/worldmap/cavecollisions.js", "const cavecollisions = \r\n");
            for(var y = 1; y < 43; y += 6) { // small chunks
                for(var x = 1; x < width; x += 6) {
                    res.push(ProcessChunk(p.data, x, y, width, 5));                    
                }
            }
            fs.appendFile("js/worldmap/cavecollisions.js", ArrToJSON(res));
            res = [];
            fs.appendFile("js/worldmap/cavecollisions.js", "const cavecollisionsMed = \r\n");
            for(var y = 43; y < 79; y += 12) { // medium chunks
                for(var x = 1; x < width; x += 12) {
                    res.push(ProcessChunk(p.data, x, y, width, 11));                    
                }
            }
            fs.appendFile("js/worldmap/cavecollisions.js", ArrToJSON(res));
            res = [];
            fs.appendFile("js/worldmap/cavecollisions.js", "const cavecollisionsBoss = \r\n");
            for(var y = 79; y < height; y += 24) { // boss chunks
                for(var x = 1; x < width; x += 24) {
                    res.push(ProcessChunk(p.data, x, y, width, 23));                    
                }
            }
            fs.appendFile("js/worldmap/cavecollisions.js", ArrToJSON(res));
        });
        return stream;
    }));
});