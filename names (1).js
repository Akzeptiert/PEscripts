var module = new Module("FakeName1", true, true, ModuleCategory.MISC);
var ids = new TextFieldSetting("NameTag", "Text", "");
module.addSettings([ids]);

function onLevelTick() {
    if (Module.isActive("FakeName1")) {
    target = LocalPlayer.getPointedPlayer(); 
       Player.setNameTag(target, ids.getText())
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}