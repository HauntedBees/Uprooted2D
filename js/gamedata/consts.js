var me = {
    PLAYERMOVESPEED: 0.25,
    BASEMOVESPEED: 0.25,
    INFOBOXWIDTH: 6.5,
    TURNSINSEASON: 30,
};
var directions = { UP: 0, LEFT: 1, DOWN: 2, RIGHT: 3 };
var timers = { FULLANIM: 10, CHARANIM: 50 };

/*
Currently unconst'd:
    anything dealing with tile sizes
    worldmap.js: writeText
*/