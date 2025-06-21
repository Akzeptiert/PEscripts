const module = new Module("AutoClicker+", true, true, ModuleCategory.PLAYER); 
const cps = new SliderSetting("CPS", [1, 1, 120, 1]); 

let timer = 0; 

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    timer += cps.getCurrentValue() / 20; 
    if (timer >= 1) { 
        timer -= 1; 
        LocalPlayer.click();
    } 
} 

function onScriptEnabled() { 
    module.addSetting(cps); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
}