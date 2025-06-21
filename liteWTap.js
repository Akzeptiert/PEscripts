var module = new Module("Auto-WTapLite", true, true, ModuleCategory.COMBAT);
const aimbotRadius = new SliderSetting("Aimbot radius", [10, 0, 20, 1]);
const attackRadius = new SliderSetting("Attack radius", [6, 0, 7, 1]);
const cps = new SliderSetting("CPS", [10, 1, 20, 2]);
const fodba = new StateSetting("AutoFodba", false)

let target = -1; 
let timer = 0; 

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    target = LocalPlayer.getNearestPlayer(aimbotRadius.getCurrentValue()); 
    if (target === -1 || isFriend(target)) { return; } 
    
    LocalPlayer.lookAt(target); 

    target1 = LocalPlayer.getNearestPlayer(attackRadius.getCurrentValue());
    timer += cps.getCurrentValue() / 20; 
    if (timer >= 1) { 
        timer -= 1; 
        LocalPlayer.attack(target1); 
    }
}

function onScriptEnabled() { 
    module.addSettings([aimbotRadius, attackRadius, cps, fodba]); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 
