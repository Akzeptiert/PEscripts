var module = new Module("Auto-WTap", true, true, ModuleCategory.COMBAT);
const settings = {  // кому не нравится у того мать сдохла
    "aimbotRadius": new SliderSetting("Aimbot radius", [10, 7, 20, 1]),  
    "attackRadius": new SliderSetting("Attack radius", [6, 1, 7, 1]), 
    "cps": new SliderSetting("CPS", [10, 1, 20, 2]) 
}; 
let target = -1; 
let timer = 0; 

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    target = LocalPlayer.getNearestPlayer(settings.aimbotRadius.getCurrentValue()); 
    if (target === -1 || isFriend(target)) { return; } 
    
    LocalPlayer.lookAt(target); 
    LocalPlayer.setMoveButtonStatus(MoveButton.FORWARD, true); 
    
    if (LocalPlayer.getNearestPlayer(settings.attackRadius.getCurrentValue()) != target) { return; }
    timer += settings.cps.getCurrentValue() / 20; 
    if (timer >= 1) { 
        timer -= 1; 
        LocalPlayer.attack(target); 
    } 
} 

function onScriptEnabled() { 
    module.addSettings([settings.aimbotRadius, settings.attackRadius, settings.cps]); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 
