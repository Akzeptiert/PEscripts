module = new Module("Hp", true, true, ModuleCategory.OTHER);

function onLevelTick() {
    if (Module.isActive("Hp")) {

var blockCount = Math.floor(LocalPlayer.getHealth());

var message1 = "§l§m§cHP:§f " + blockCount;

Level.showTipMessage(message1, 0, 0);
}
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}