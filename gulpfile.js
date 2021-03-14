const gulp = require("gulp");
const path = require("path");
gulp.task("default", function() {
    require("child_process").fork(path.join(__dirname, "../tools/Package.js"));
});
gulp.task("watch", function() {
    return gulp.watch("./js/**/*.*", gulp.series("default"));
});