const durabilityModule = new Module("Checker", false, true, ModuleCategory.PLAYER);

const showEnchants = new StateSetting("Show Enchants", false);
durabilityModule.addSetting(showEnchants);
ModuleManager.addModule(durabilityModule);

let lastMessage = "";

durabilityModule.setOnClickListener(function(view) {
    const selectedSlot = Inventory.getSelectedSlot();
    const maxDurability = Item.getMaxDamage(selectedSlot);
    const currentDamage = Item.getDamage(selectedSlot);
    const currentDurability = maxDurability - currentDamage;
    const itemId = Item.getID(selectedSlot);
    const itemData = Item.getData(selectedSlot);
    const fullId = itemData > 0 ? itemId + ":" + itemData : itemId;
    let message = "";

    if (maxDurability > 0) {
        message = "§a[Checker] Прочность: " + currentDurability + "/" + maxDurability + "\n" +
                  "§7ID: " + fullId;
        if (showEnchants.isActive()) {
            message += "\n" + (Item.isEnchanted(selectedSlot) ? "§bЗачарован" : "§eНе зачарован");
        }
    } else {
        message = "§c[Checker] Прочность: Отсутствует" + "\n" +
                  "§7ID: " + fullId;
        if (showEnchants.isActive()) {
            message += "\n" + (Item.isEnchanted(selectedSlot) ? "§bЗачарован" : "§eНе зачарован");
        }
    }

    if (message !== lastMessage) {
        Level.displayClientMessage(message);
        lastMessage = message;
    }
});