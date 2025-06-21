const module = new Module("FastFall", true, true, ModuleCategory.MOVEMENT);
var speed = new SliderSetting("Fallspeed", [3.5, 2.5, 10.0, 0.5]); module.addSetting(speed);

function onLevelTick() {
    if (!module.isActive()) { return; }
    if (!LocalPlayer.isFalling()) { return; }
    LocalPlayer.setVelocityY(speed.getCurrentValue());
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}