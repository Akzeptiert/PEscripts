var module = new Module("Aim", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("Distanse", [1, 0, 100, 1]);
module.addSettings([slider]);

function onLevelTick() {
    if (!module.isActive()) { return; } 
    target = LocalPlayer.getNearestPlayer(slider.getCurrentValue()); 
    if (target === -1 || isFriend(target)) { return; } 
    
    LocalPlayer.lookAt(target); 
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}