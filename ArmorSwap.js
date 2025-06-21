const module = new Module("ArmorSwap", false, true , ModuleCategory.MISC);
const s = new ModeSetting("Slot", ["Шлем", "Нагрудник", "Поножи", "Ботинки"]);
module.addSetting(s);
module.setOnClickListener(function() {
    if (s.getCurrentMode() == "Шлем") {
        Inventory.setArmor(Inventory.getSelectedSlot(), 0, 1);
    }
    if (s.getCurrentMode() == "Нагрудник") {
        Inventory.setArmor(Inventory.getSelectedSlot(), 1, 1);
    }
    if (s.getCurrentMode() == "Поножи") {
        Inventory.setArmor(Inventory.getSelectedSlot(), 2, 1);
    }
    if (s.getCurrentMode() == "Ботинки") {
        Inventory.setArmor(Inventory.getSelectedSlot(), 3, 1);
    }
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}