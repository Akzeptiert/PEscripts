var isActive = false;
var module = new Module("InvManager", true, true, ModuleCategory.PLAYER);

// Настройка для выбрасывания слабых инструментов
var dropToolsSetting = new StateSetting("Drop tools", true);
module.addSetting(dropToolsSetting);

module.setOnClickListener(function() {
    isActive = !isActive;
});

function moveItemToFreeSlot(fromSlot) {
    for (let slot = 0; slot < 36; slot++) { // Проверяем все слоты, включая хотбар
        if (Item.getID(slot) === 0) { // Если слот пустой
            Inventory.swapSlots(fromSlot, slot);
            return slot;
        }
    }
    return -1; // Нет свободных слотов
}

function equipBestArmor() {
    const diamondArmor = [310, 311, 312, 313]; // Алмазная броня
    const ironArmor = [306, 307, 308, 309];    // Железная броня
    const armorSlots = [0, 1, 2, 3];           // Слоты для брони

    for (let i = 0; i < 4; i++) {
        let currentArmorSlot = armorSlots[i];
        let currentArmorID = Inventory.getArmor(currentArmorSlot);

        let bestSlot = -1;
        let bestArmorID = -1;

        // Ищем алмазную броню
        for (let slot = 0; slot < 46; slot++) { // Проверяем все слоты инвентаря
            let itemID = Item.getID(slot);
            if (itemID === diamondArmor[i]) {
                bestSlot = slot;
                bestArmorID = itemID;
                break;
            }
        }

        // Если алмазной брони нет, ищем железную броню
        if (bestSlot === -1 && !diamondArmor.includes(currentArmorID)) {
            for (let slot = 0; slot < 46; slot++) { // Проверяем все слоты инвентаря
                let itemID = Item.getID(slot);
                if (itemID === ironArmor[i]) {
                    bestSlot = slot;
                    bestArmorID = itemID;
                    break;
                }
            }
        }

        // Надеваем лучшую броню, если она найдена и отличается от текущей
        if (bestSlot !== -1 && currentArmorID !== bestArmorID) {
            let oldArmorSlot = moveItemToFreeSlot(currentArmorSlot + 100);
            if (oldArmorSlot !== -1) {
                Inventory.setArmor(bestSlot, currentArmorSlot, oldArmorSlot);
                Inventory.dropSlot(oldArmorSlot, true, false); // Выбрасываем старую броню
            } else {
                Inventory.dropSlot(currentArmorSlot + 100, true, false);
                Inventory.setArmor(bestSlot, currentArmorSlot, currentArmorSlot + 100);
            }
        }
    }
}

function dropWeakerTools() {
    const diamondTools = [276, 278, 279]; // Алмазный меч, кирка, топор
    const ironTools = [267, 257, 258];    // Железный меч, кирка, топор

    for (let slot = 0; slot < 46; slot++) { // Проверяем все слоты инвентаря
        let itemID = Item.getID(slot);

        // Если находим железный инструмент, проверяем, есть ли в инвентаре алмазный аналог
        if (ironTools.includes(itemID)) {
            let correspondingDiamondTool = diamondTools[ironTools.indexOf(itemID)];
            let hasDiamondTool = false;

            for (let checkSlot = 0; checkSlot < 46; checkSlot++) { // Проверяем все слоты инвентаря
                if (Item.getID(checkSlot) === correspondingDiamondTool) {
                    hasDiamondTool = true;
                    break;
                }
            }

            // Если алмазный аналог найден, выбрасываем железный инструмент
            if (hasDiamondTool) {
                Inventory.dropSlot(slot, true, false);
            }
        }
    }
}

function onLevelTick() {
    if (isActive) {
        equipBestArmor();

        // Если настройка включена, выбрасываем слабые инструменты
        if (dropToolsSetting.isActive()) {
            dropWeakerTools();
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}