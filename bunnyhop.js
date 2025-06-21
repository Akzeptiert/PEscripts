const module = new Module("BunnyHop", true, true, ModuleCategory.OTHER);
// var sprintOnly = new StateSetting("Should sprint", true); module.addSetting(sprintOnly);

function onLevelTick() {
    if (!module.isActive()) { return; }
    if (LocalPlayer.isOnGround()) {
        //if (sprintOnly.isActive()) {
            // if (!LocalPlayer.isSprinting()) { return; }
            // Отложено до лучших времён (пока не сделают проверку)
        //}
        LocalPlayer.setVelocityY(0.45);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}