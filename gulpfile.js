var gulp = require("gulp");
var fs = require("fs");
var cp = require("child_process");
var foreach = require("gulp-foreach");
var getPixels = require("get-pixels");
gulp.task("default", function() {
    var version = Math.floor(1000 * Math.random());
    fs.writeFile("logging.js", "console.log('Code Version: " + version + "');");
    cp.execFile("uglify.cmd");
    cp.execFile("uglifymin.cmd");
});
gulp.task("watch", function() {
    gulp.watch("./js/**/*.*", ["default"]);
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
                    row.push(p.data[idx + 3] === 255);
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