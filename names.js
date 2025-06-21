var module = new Module("FakeName", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("Radius", [1, 0, 10, 1]);
var ids = new TextFieldSetting("Block IDs", "1,2,3", "");
module.addSettings([ids, slider]);

function onLevelTick() {
    if (Module.isActive("FakeName")) {
    target = LocalPlayer.getNearestPlayer(slider.getCurrentValue()); 

        Player.setNameTag(target, ids.getText());
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
