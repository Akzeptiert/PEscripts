const ArmorSwap = new Module(">AS", "Свап армора", false, ModuleCategory.PLAYER, {
    onClick() {
        const armorSlot = {
            "Шлем": 0,
            "Нагрудник": 1,
            "Поножи": 2,
            "Ботинки": 3
        }[this.getSetting("Slot").getSelectedEntry().getName()];
        
        const selectedSlot = Inventory.getSelectedSlot();
        if (selectedSlot >= 0 && selectedSlot < 9) {
            Inventory.setArmor(selectedSlot, armorSlot, 1);
            Game.notification("Броня заменена!");
        }
    }
});

const slotEntries = [
    new EnumEntry("Шлем", 0),
    new EnumEntry("Нагрудник", 1),
    new EnumEntry("Поножи", 2),
    new EnumEntry("Ботинки", 3)
];
ArmorSwap.addSetting(new EnumSetting("Slot", 0, slotEntries));

function onScriptEnable() {
    ModuleManager.addModule(ArmorSwap);
}

function onScriptDisable() {
    ModuleManager.removeModule(ArmorSwap);
}