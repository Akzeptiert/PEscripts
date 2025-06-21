const module = new Module("NoBadEffects", true, false, ModuleCategory.PLAYER);

function onLevelTick() {
    if (!module.isActive()) { return; }
    [4, 9, 15].forEach(function(elem) {
        LocalPlayer.removeEffect(elem); 
    });
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}