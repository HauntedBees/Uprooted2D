const gulp = require("gulp");
const path = require("path");
gulp.task("default", function(cb) {
    require("child_process").exec("node " + path.join(__dirname, "tools/Package.js"), (e, o, s) => console.log(o));
    cb();
});
gulp.task("watch", function() {
    return gulp.watch("./js/**/*.*", gulp.series("default"));
});