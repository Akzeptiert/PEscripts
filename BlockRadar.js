var BlockFinder = new Module("BlockRadar", true, false, ModuleCategory.MISC);

var blockIdSetting = new TextFieldSetting("ID блока", "56-дюны, 14-золото", "56");
var checkDistance = new SliderSetting("Дистанция", [15, 5, 30, 1]);
BlockFinder.addSettings([blockIdSetting, checkDistance]);

var cache = {
    lastX: 0,
    lastZ: 0,
    blockFound: false,
    distance: 0,
    cooldown: 0
};

function isBlockValid(x, y, z) {
    try {
        var targetId = parseInt(blockIdSetting.getText());
        if (isNaN(targetId)) return false;
        return Block.getID(x, y, z) === targetId;
    } catch(e) {
        return false;
    }
}

function quickCheck() {
    if (cache.cooldown > 0) {
        cache.cooldown--;
        return;
    }
    
    cache.cooldown = 10;
    var px = Math.floor(LocalPlayer.getPositionX());
    var pz = Math.floor(LocalPlayer.getPositionZ());
    
    if (Math.abs(px - cache.lastX) < 3 && Math.abs(pz - cache.lastZ) < 3 && cache.blockFound) {
        return;
    }
    
    cache.lastX = px;
    cache.lastZ = pz;
    cache.blockFound = false;
    cache.distance = checkDistance.getCurrentValue() + 1;
    
    var radius = Math.min(30, checkDistance.getCurrentValue());
    var py = Math.floor(LocalPlayer.getPositionY());
    
    for (var d = 0; d <= radius; d++) {
        for (var x = -d; x <= d; x++) {
            for (var z = -d; z <= d; z++) {
                if (Math.abs(x) !== d && Math.abs(z) !== d) continue;
                
                for (var y = -2; y <= 2; y++) {
                    if (isBlockValid(px+x, py+y, pz+z)) {
                        var dist = Math.max(Math.abs(x), Math.abs(z));
                        if (dist < cache.distance) {
                            cache.distance = dist;
                            cache.blockFound = true;
                        }
                    }
                }
            }
        }
        if (cache.blockFound) break;
    }
}

function onLevelTick() {
    if (!BlockFinder.isActive()) return;
    
    quickCheck();
    
    if (cache.blockFound) {
        Level.displayClientMessage("§l§aБлок: §f" + cache.distance + "м");
    } else {
        Level.displayClientMessage("§7Ищем...");
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(BlockFinder);
    cache.cooldown = 0;
}

function onScriptDisabled() {
    Level.displayClientMessage("");
}