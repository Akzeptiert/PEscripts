const module = new Module("Q+", true, true, ModuleCategory.MISC);

let timer = 0;

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    timer += 1000; 
    if (timer >= 1) { 
        timer -= 1; 
        Inventory.dropSlot(Inventory.getSelectedSlot(), false, false);
    } 
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
}