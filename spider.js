const module = new Module("Spider", true, true, ModuleCategory.MOVEMENT) 

function onLevelTick() { 
    if (!module.isActive()) { return } 
    LocalPlayer.setStatusFlag(18, !LocalPlayer.isFalling()) 
} 

function onScriptEnabled() { ModuleManager.addModule(module) } 
function onScriptDisabled() { ModuleManager.removeModule(module) } 