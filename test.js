const { spawn } = require("child_process");

const path = "E:/GitHub/CropRPG/img/maps/";
//const name = process.argv.slice(2)[0];

const pass = function(name) {
    spawn("magick", ["compare", `${path}${name}.png`, `${path}${name}1.png`, "-compose", "src", `${path}__${name}.png`]);
}

pass("belowvillage");
pass("bridge");
pass("fakefarm");
pass("farm");
pass("firstvillage");
pass("forest");
pass("gameover");
pass("hq_1");
pass("hq_1_IG");
pass("hq_1_NB");
pass("hq_NB_side");
pass("hq_2");
pass("hq_3");
pass("hq_4");
pass("hq_5");
pass("hq_6");
pass("molehome");
pass("northcity");
pass("producestand");
pass("researchfacility");
pass("southcity");
pass("underwater");