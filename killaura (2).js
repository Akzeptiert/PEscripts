const module = new Module("KLJS", true, true, ModuleCategory.COMBAT); 
var distance = new SliderSetting("Distance",  [1, 1, 20, 0.5]); module.addSetting(distance); 

var target = -1;

function onLevelTick() { 
    if (!module.isActive()) { return; } 
   target = LocalPlayer.getNearestPlayer(distance.getCurrentValue());
    if (target == -1 || isFriend(target)) { return; }
    for (var counter = 0; counter < 26; counter++) {
        LocalPlayer.attack(target);
    }
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
}