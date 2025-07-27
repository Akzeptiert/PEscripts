const module = new Module("DropBlock", true, true, ModuleCategory.MISC); 
const settings = { 
    "algorithm": new TextFieldSetting("Checks", "Item.getID(slot) == 0", "Item.getID(slot) == 0")
}; 

let itemCheck = function(slot) { return false }  // return true -> item drops 
let cooldown = 0; 

settings.algorithm.setOnTextChangedListener(function(text) { 
    itemCheck = function(slot) { 
        return eval(text);  // да, защита не предусмотрена, мне пох 
    } 
}); 

function onLevelTick() { 
    cooldown++; 
    if (!module.isActive() || cooldown < 10) { return; } 
    cooldown = 0; 
    for (let slot = 9; slot < 47; slot++) { 
         if (itemCheck(slot)) { Inventory.dropSlot(slot, true, false); } 
    } 
} 

function onScriptEnabled() { 
    module.addSetting(settings.algorithm); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { ModuleManager.removeModule(module); } 