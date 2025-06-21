var killauraByZeld = new Module("Killaura By Zeld", true, true, ModuleCategory.COMBAT);
var rangeSetting = new SliderSetting("Range", [4.2, 1.0, 6.0, 0.1]);
var focusSetting = new StateSetting("Focus Target", false);
var cpsSetting = new SliderSetting("CPS", [10, 1, 20, 1]);
var throughWallsSetting = new StateSetting("Through Walls", false);
var autoDisableSetting = new StateSetting("Auto Disable", false);

killauraByZeld.addSetting(rangeSetting);
killauraByZeld.addSetting(focusSetting);
killauraByZeld.addSetting(cpsSetting);
killauraByZeld.addSetting(throughWallsSetting);
killauraByZeld.addSetting(autoDisableSetting);

var focusedTarget = null;
var attackTimer = 0;

function onScriptEnabled() {
    ModuleManager.addModule(killauraByZeld);
}

function onLevelTick() {
    if (killauraByZeld.isActive()) {
        attackTimer -= 1;

        var target = null;
        if (focusSetting.isActive() && focusedTarget != null && (!autoDisableSetting.isActive() || Player.isAlive(focusedTarget)) && (throughWallsSetting.isActive() || !Player.isInWall(focusedTarget)) && LocalPlayer.getDistanceTo(focusedTarget) <= rangeSetting.getCurrentValue()) {
            target = focusedTarget;
        } else {
            focusedTarget = null;
            var players = Level.getAllPlayers();
            var minDist = rangeSetting.getCurrentValue();

            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (Player.isLocalPlayer(player) || !Player.isAlive(player) || (!throughWallsSetting.isActive() && Player.isInWall(player))) continue;
                var dist = LocalPlayer.getDistanceTo(player);

                if (dist < minDist) {
                    minDist = dist;
                    target = player;
                    if (focusSetting.isActive()) {
                        focusedTarget = target;
                    }
                }
            }
        }

        if (target != null && attackTimer <= 0) {
            LocalPlayer.attack(target);
            var cps = cpsSetting.getCurrentValue();
            var delay = (20 / cps) + (Math.random() - 0.5) * 4;
            attackTimer = delay;
        }
    }
}

function onAttacked(attacker, victim) {
    if (killauraByZeld.isActive() && victim === Player.getLocalPlayer()) {
        killauraByZeld.deactivate();
        setTimeout(function() {
            killauraByZeld.activate();
        }, 500);
    }
}

function gaussianRandom() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function onAttack(playerID) {
}