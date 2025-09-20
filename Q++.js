const module = new Module("Q++", true, true, ModuleCategory.MISC);

let timer = 0;

function onFastTick() { 
    if (!module.isActive("Q++")) { return; } 
    timer += 500; 
    if (timer >= 1) { 
        timer -= 1; 
        Inventory.dropSlot(0, false, false);
        Inventory.dropSlot(1, false, false);
        Inventory.dropSlot(2, false, false);
        Inventory.dropSlot(3, false, false);
        Inventory.dropSlot(4, false, false);
        Inventory.dropSlot(5, false, false);
        Inventory.dropSlot(6, false, false);
        Inventory.dropSlot(7, false, false);
        Inventory.dropSlot(8, false, false);
        Inventory.dropSlot(9, false, false);
        Inventory.dropSlot(10, false, false);
        Inventory.dropSlot(11, false, false);
        Inventory.dropSlot(12, false, false);
        Inventory.dropSlot(13, false, false);
        Inventory.dropSlot(14, false, false);
        Inventory.dropSlot(15, false, false);
        Inventory.dropSlot(16, false, false);
        Inventory.dropSlot(17, false, false);
        Inventory.dropSlot(18, false, false);
        Inventory.dropSlot(19, false, false);
        Inventory.dropSlot(20, false, false);
        Inventory.dropSlot(21, false, false);
        Inventory.dropSlot(22, false, false);
        Inventory.dropSlot(23, false, false);
        Inventory.dropSlot(24, false, false);
        Inventory.dropSlot(25, false, false);
        Inventory.dropSlot(26, false, false);
        Inventory.dropSlot(27, false, false);
        Inventory.dropSlot(28, false, false);
        Inventory.dropSlot(29, false, false);
        Inventory.dropSlot(30, false, false);
        Inventory.dropSlot(31, false, false);
        Inventory.dropSlot(32, false, false);
        Inventory.dropSlot(33, false, false);
        Inventory.dropSlot(34, false, false);
        Inventory.dropSlot(35, false, false);
        Inventory.dropSlot(36, false, false);
        Inventory.dropSlot(37, false, false);
        Inventory.dropSlot(38, false, false);
        Inventory.dropSlot(39, false, false);
        Inventory.dropSlot(40, false, false);
        Inventory.dropSlot(41, false, false);
        Inventory.dropSlot(42, false, false);
        Inventory.dropSlot(43, false, false);
        Inventory.dropSlot(44, false, false);
        Inventory.dropSlot(45, false, false);
    } 
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
}