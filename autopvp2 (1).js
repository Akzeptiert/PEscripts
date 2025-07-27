const module = new Module("AutoPVP", true, true, ModuleCategory.COMBAT); 
const settings = {  // кому не нравится у того мать сдохла
    "aimbotRadius": new SliderSetting("Aimbot radius", [10, 7, 20, 1]),  
    "attackRadius": new SliderSetting("Attack radius", [6, 1, 7, 1]), 
    "cps": new SliderSetting("CPS", [10, 1, 20, 2]) 
}; 

// original script by izigamer :), refactored by darkue8w
let target = -1; 
let timer = 0; 

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    target = LocalPlayer.getNearestPlayer(settings.aimbotRadius.getCurrentValue()); 
    if (target === -1 || isFriend(target)) { return; } 
    
    LocalPlayer.lookAt(target); 
    LocalPlayer.setMoveButtonStatus(MoveButton.FORWARD, true); 
    
    if (LocalPlayer.getNearestPlayer(settings.attackRadius.getCurrentValue()) != target) { return; }  // да это сложно прочитать но если вам не нравится вы лох а я бог сигма тун тун тун-дун-дун тун
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