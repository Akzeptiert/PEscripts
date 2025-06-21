var module = new Module("AirHit", true, true, ModuleCategory.COMBAT);

function onLevelTick() {
    if (module.isActive() && Module.isActive("AntiBot")) {
        LocalPlayer.buildBlock(0, -90, 0, BlockSide.UP);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}