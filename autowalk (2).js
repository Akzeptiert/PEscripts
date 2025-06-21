let module = new Module("AutoWalk", true, true, ModuleCategory.PLAYER);

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}

function onLevelTick() {
    if (module.isActive()) {
        LocalPlayer.setMoveButtonStatus(MoveButton.FORWARD, true);
    }
}