var mapStates = {
    "northcity": { inside: false }
};
var stateBinders = {
    "northcity": function() {
        
    }
};
var mapRefreshes = {
    "northcity": function() {
        var inside = mapStates["northcity"].inside;
        for(var i = 0; i < worldmap.entities.length; i++) {
            var e = worldmap.entities[i];
            if(e.inside) { e.visible = inside; }
            else if(e.jumbo) { e.visible = !inside; }
        }
    }
};