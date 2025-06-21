var behindModule = new Module("Behind", true, true, ModuleCategory.PLAYER);
var rangeSetting = new SliderSetting("Range", [6.0, 1.0, 10.0, 0.5]);
var delaySetting = new SliderSetting("Delay", [10, 1, 20, 1]);
var bypassSetting = new StateSetting("Bypass", false);

behindModule.addSettings([rangeSetting, delaySetting, bypassSetting]);

var targetID = null;
var teleportTimer = 0;

function onScriptEnabled() {
    ModuleManager.addModule(behindModule);
}

function findTarget() {
    var players = Level.getAllPlayers();
    var closestDist = rangeSetting.getCurrentValue();
    var target = null;

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (Player.isLocalPlayer(player)) continue;
        if (!Player.isAlive(player)) continue;
        if (!Player.isInWorld(player)) continue;

        var dist = LocalPlayer.getDistanceTo(player);
        if (dist < closestDist) {
            closestDist = dist;
            target = player;
        }
    }
    return target;
}

function teleportBehind(playerID) {
    var targetX = Player.getPositionX(playerID);
    var targetY = Player.getPositionY(playerID);
    var targetZ = Player.getPositionZ(playerID);
    
    if(bypassSetting.isActive()) {
        LocalPlayer.setOnGround(true);
        LocalPlayer.setPositionRelative(0, 0.42, 0);
    }
    
    LocalPlayer.setPosition(targetX, targetY, targetZ);
    LocalPlayer.setRot(Player.getYaw(playerID), 0);
    LocalPlayer.setPositionRelative(0, 0, 1);
}

function onLevelTick() {
    if (!behindModule.isActive()) return;
    
    teleportTimer--;
    
    if (teleportTimer <= 0) {
        targetID = findTarget();
        
        if (targetID != null) {
            teleportBehind(targetID);
            teleportTimer = delaySetting.getCurrentValue();
        }
    }
}

function onServerConnect() {
    targetID = null;
    teleportTimer = 0;
}