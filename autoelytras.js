const module = new Module("AutoElytras", true, true, ModuleCategory.MOVEMENT) 

function onLevelTick() { 
    if (!module.isActive() || LocalPlayer.getFallDistance() < 3 || Inventory.getArmor(1) === 444) { return } 
    let elytraSlot = -1 
    for (let slot = 9; slot < 47; slot++) { 
         if (Item.getID(slot) === 444 && Item.getMaxDamage(slot) - Item.getDamage(slot) > 2) { 
             elytraSlot = slot; break
    }    } 
    Inventory.setArmor(elytraSlot, 1, elytraSlot) 
} 

function onScriptEnabled() { ModuleManager.addModule(module) } 
function onScriptDisabled() { ModuleManager.removeModule(module) } 