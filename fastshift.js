var module = new Module("FastShift", true, true, ModuleCategory.PLAYER);
var shouldTick = true;

function onLevelTick() {
    if (!module.isActive() && !shouldTick) { return }
    shouldTick = !shouldTick;
    LocalPlayer.setMoveButtonStatus(MoveButton.SHIFT, !LocalPlayer.isMoveButtonPressed(MoveButton.SHIFT));
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}