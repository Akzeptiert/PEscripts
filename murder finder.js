function onScriptEnabled() {
    var murderFinder = new Module("Murder Finder", true, true, ModuleCategory.PLAYER);
    var showDistance = new StateSetting("Show Distance", true);
    var rangeSlider = new SliderSetting("Range", [30, 5, 100, 5]);

    murderFinder.addSettings([showDistance, rangeSlider]);
    
    ModuleManager.addModule(murderFinder);
}

var murderer = null;
var checkTimer = 0;

function checkInventory() {
    for(var i = 0; i < 9; i++) {
        var itemId = Item.getID(i);
        if(itemId === 267) {
            return "murderer";
        }
    }
    return "none";
}

function onLevelTick() {
    if(!Module.isActive("Murder Finder")) return;
    
    if(checkTimer > 0) {
        checkTimer--;
        return;
    }
    checkTimer = 20;
    
    var players = Level.getAllPlayers();
    for(var i = 0; i < players.length; i++) {
        var name = Player.getNameTag(players[i]);
        var role = checkInventory();
        
        if(role === "murderer") {
            murderer = players[i];
            var distance = LocalPlayer.getDistanceTo(murderer);
            var range = Setting.getCurrentValue("Murder Finder", "Range");
            
            if(Setting.isActive("Murder Finder", "Show Distance") && distance <= range) {
                Level.setTitle("§c§l[!] §fУбийца в §c" + Math.floor(distance) + " §fблоках от вас §c§l[!]");
            }
            break;
        }
    }
}

function onServerConnect() {
    murderer = null;
    checkTimer = 0;
}

function onServerDisconnect() {
    murderer = null;
    checkTimer = 0;
}