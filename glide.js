var module = new Module("GlideJS", true, true, ModuleCategory.MOVEMENT); 

function onLevelTick() { 
    if (!module.isActive() || !LocalPlayer.isFalling()) { return; } 
    LocalPlayer.setVelocityY(-0.101); 
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 