const module = new Module("NoBadEffects", true, true, ModuleCategory.PLAYER) 

function onLevelTick() { 
    if (!module.isActive()) { return } 
    // slowness, mining fatigue, nausea, blindness 
    LocalPlayer.removeEffect(2) 
    LocalPlayer.removeEffect(4) 
    LocalPlayer.removeEffect(9) 
    LocalPlayer.removeEffect(15) 
} 

function onScriptEnabled() { ModuleManager.addModule(module) } 
function onScriptDisabled() { ModuleManager.removeModule(module) } 