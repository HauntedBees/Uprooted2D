const fs = require("fs-extra");
const path = require("path");

const args = process.argv.slice(2);
if(!args.length) {
    console.log(`Arguments:
copy - Copy all built files to cordova/www
build - TODO
all - Run all of the above`);
    return;
}

const action = args[0].toLowerCase(), all = action === "all";

if(all || action === "copy") {
    const root = path.join(__dirname, "../");
    const croot = path.join(root, "cordova/www/");
    const copies = ["img", "imggb", "imghq4x", "imgs4x", "styles"];
    copies.forEach(f => fs.copySync(path.join(root, f), path.join(croot, f)));
    fs.copySync(path.join(root, "js/lib"), path.join(croot, "js"));
    fs.copySync(path.join(root, "out.js"), path.join(croot, "js/out.js"));
    fs.readFile(path.join(root, "indexcordova.html"), "utf-8", (err, data) => {
        if(err) { throw err; }
        const newval = data.replace("DOMContentLoaded", "deviceready");
        fs.writeFileSync(path.join(croot, "index.html"), newval, "utf-8");
    });
    console.log("Files copied to Cordova");
}