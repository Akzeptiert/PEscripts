var slowHandModule = new Module("SlowHand", true, true, ModuleCategory.COMBAT);

var effectActive = false;

function onScriptEnabled() {
    ModuleManager.addModule(slowHandModule);
}

function applyMiningFatigueEffect() {
    if (LocalPlayer.isAlive()) {
        LocalPlayer.addEffect(4, 999999, 3);
        effectActive = true;
    }
}

function removeMiningFatigueEffect() {
    if (LocalPlayer.isAlive() && effectActive) {
        LocalPlayer.removeEffect(4);
        effectActive = false;
    }
}

function onLevelTick() {
    if (!slowHandModule.isActive()) {
        if (effectActive) {
            removeMiningFatigueEffect();
        }
        return;
    }
    
    if (!effectActive) {
        applyMiningFatigueEffect();
    }
}

slowHandModule.setOnToggleListener(function(view, active) {
    if (active) {
        applyMiningFatigueEffect();
    } else {
        removeMiningFatigueEffect();
    }
});