const module = new Module("KillAura", true, true, ModuleCategory.COMBAT);

var attackRadius = new SliderSetting("Радиус атаки", [1.0, 0, 10, 0.01]);
module.addSetting(attackRadius);

var cps = new SliderSetting("CPS", [10, 1, 20, 2]);
module.addSetting(cps);

var mode = new ModeSetting("Режим", ["Target", "Switch", "Multi"]);
module.addSetting(mode);

var targets = [];
var targetIndex = 0;
var timer = 0;

function onLevelTick() {
    if (!module.isActive()) { return; }

    switch (mode.getCurrentMode()) {
        case "Target":
            targets = [getNearestPlayer()];
            break;

        case "Switch":
            targets = getAllPlayers();
            break;

        case "Multi":
            targets = getAllPlayers();
            break;
    }

    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];

        if (target === -1 || isFriend(target)) { continue; }

        timer += cps.getCurrentValue() / 20;

        if (timer >= 1) {
            timer -= 1;

            if (Player.isInWall(target) || Player.isInvisible(target) || LocalPlayer.isInvisible(target) || LocalPlayer.isInWall(target) || LocalPlayer.isInWall(target) || Player.isInCreativeMode(target) || LocalPlayer.isInCreativeMode(target) || LocalPlayer.canFly(target) || Player.canFly(target) || LocalPlayer.isImmobile(target) || Player.isImmobile(target)) {
                continue;
            }

            LocalPlayer.attack(target);

            if (mode.getCurrentMode() === "Switch") {
                // В режиме Switch, после каждой атаки переключаемся на следующего игрока
                targetIndex = (targetIndex + 1) % targets.length;
            }
        }
    }
}

function getAllPlayers() {
    return Level.getAllPlayers();
}

function getNearestPlayer() {
    var players = Level.getAllPlayers();
    var closestPlayer = null;
    var closestDistance = Number.MAX_VALUE;

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var distance = LocalPlayer.getDistanceTo(player);

        if (distance < closestDistance) {
            closestPlayer = player;
            closestDistance = distance;
        }
    }

    return closestPlayer;
}

function isFriend(entity) {
    // Добавьте свою логику проверки на друга на основе объекта entity
    return false;
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}