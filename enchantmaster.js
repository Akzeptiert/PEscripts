// EnchantMaster
// v2.11

var enchantModule = new Module("EnchantMaster", true, false, ModuleCategory.PLAYER);

var ThreadLocalRandom = java.util.concurrent.ThreadLocalRandom;

var enchantments = [
    { id: Enchantment.PROTECTION, name: "Защита", enName: "Protection" },
    { id: Enchantment.FIRE_PROTECTION, name: "Огнеупорность", enName: "Fire Protection" },
    { id: Enchantment.FEATHER_FALLING, name: "Легкость", enName: "Feather Falling" },
    { id: Enchantment.BLAST_PROTECTION, name: "Взрывоустойчивость", enName: "Blast Protection" },
    { id: Enchantment.PROJECTILE_PROTECTION, name: "Защита от снарядов", enName: "Projectile Protection" },
    { id: Enchantment.RESPIRATION, name: "Дыхание", enName: "Respiration" },
    { id: Enchantment.AQUA_AFFINITY, name: "Родство с водой", enName: "Aqua Affinity" },
    { id: Enchantment.THORNS, name: "Шипы", enName: "Thorns" },
    { id: Enchantment.DEPTH_STRIDER, name: "Странник глубин", enName: "Depth Strider" },
    { id: Enchantment.FROST_WALKER, name: "Морозная поступь", enName: "Frost Walker" },
    { id: Enchantment.SHARPNESS, name: "Острота", enName: "Sharpness" },
    { id: Enchantment.SMITE, name: "Небесная кара", enName: "Smite" },
    { id: Enchantment.BANE_OF_ARTHROPODS, name: "Бич членистоногих", enName: "Bane of Arthropods" },
    { id: Enchantment.KNOCKBACK, name: "Отбрасывание", enName: "Knockback" },
    { id: Enchantment.FIRE_ASPECT, name: "Облик огня", enName: "Fire Aspect" },
    { id: Enchantment.LOOTING, name: "Добыча", enName: "Looting" },
    { id: Enchantment.EFFICIENCY, name: "Эффективность", enName: "Efficiency" },
    { id: Enchantment.SILK_TOUCH, name: "Шелковое касание", enName: "Silk Touch" },
    { id: Enchantment.UNBREAKING, name: "Неразрушимость", enName: "Unbreaking" },
    { id: Enchantment.FORTUNE, name: "Удача", enName: "Fortune" },
    { id: Enchantment.POWER, name: "Сила", enName: "Power" },
    { id: Enchantment.PUNCH, name: "Отбрасывание(Лук)", enName: "Punch" },
    { id: Enchantment.FLAME, name: "Воспламенение", enName: "Flame" },
    { id: Enchantment.INFINITY, name: "Бесконечность", enName: "Infinity" },
    { id: Enchantment.LUCK_OF_THE_SEA, name: "Морская удача", enName: "Luck of the Sea" },
    { id: Enchantment.LURE, name: "Приманка", enName: "Lure" },
    { id: Enchantment.MENDING, name: "Починка", enName: "Mending" }
];

var templates = ["Без шаблона", "Шлем", "Нагрудник", "Поножи", "Ботинки", "Меч", "Кирка", "Топор", "Лопата", "Мотыга", "Лук", "Удочка", "Элитры", "Ножницы", "Огниво", "Книга"];
var itemIds = {
    "Шлем": [298, 302, 306, 310, 314, 429],
    "Нагрудник": [299, 303, 307, 311, 315],
    "Поножи": [300, 304, 308, 312, 316],
    "Ботинки": [301, 305, 309, 313, 317],
    "Меч": [267, 268, 272, 276, 283],
    "Кирка": [257, 270, 274, 278, 285],
    "Топор": [258, 271, 275, 279, 286],
    "Лопата": [256, 269, 273, 277, 284],
    "Мотыга": [290, 291, 292, 293, 294],
    "Лук": [261],
    "Удочка": [346],
    "Элитры": [444],
    "Ножницы": [359],
    "Огниво": [259],
    "Книга": [340]
};

Data.saveNumber("totalItemsEnchanted", Data.getNumber("totalItemsEnchanted", 0));
Data.saveString("enchantStats", Data.getString("enchantStats", "{}"));
Data.saveString("lastEnchantedSlot", "");
Data.saveNumber("totalItemsStacked", Data.getNumber("totalItemsStacked", 0));
Data.saveNumber("totalItemsRenamed", Data.getNumber("totalItemsRenamed", 0));
Data.saveNumber("totalItemsDeleted", Data.getNumber("totalItemsDeleted", 0));
Data.saveNumber("totalRandomEnchants", Data.getNumber("totalRandomEnchants", 0));
Data.saveNumber("totalEnchantLevels", Data.getNumber("totalEnchantLevels", 0));
Data.saveNumber("totalTemplatesUsed", Data.getNumber("totalTemplatesUsed", 0));

var isActionInProgress = false;

var modeSetting = new ModeSetting("Режим", ["—Выберите режим—", "Обычный", "Шаблон", "Переименование", "Удаление", "Предпросмотр", "Случайное зачарование", "Стакалка", "Бета-функции"], "—Выберите режим—");
var enchantmentSetting = new ModeSetting("Зачарование", enchantments.map(e => e.name), enchantments[0].name);
var templateSetting = new ModeSetting("Шаблон", templates, templates[0]);
var levelSetting = new TextFieldSetting("Уровень зачарования", "Введите уровень (от -32767 до 32767)", "4");
var applyButton = new ButtonSetting("Применить зачарование", applyEnchantment);
var nameSetting = new TextFieldSetting("Название предмета", "Введите новое название", "Новый предмет");
var renameButton = new ButtonSetting("Переименовать", renameItem);
var deleteButton = new ButtonSetting("Удалить", deleteItem);
var previewButton = new ButtonSetting("Предпросмотр", previewItem);
var showEnchants = new StateSetting("Показать зачарования", false);
var massRenameButton = new ButtonSetting("Переименовать все", massRenameItems);
var massDeleteButton = new ButtonSetting("Удалить все", massDeleteItems);
var randomEnchantButton = new ButtonSetting("Случайное зачарование", applyRandomEnchantment);

var betaModeSetting = new ModeSetting("Бета-функции", ["Отключено", "Язык", "Автошаблон", "Статистика", "Групповое зачарование", "Отладка"], "Отключено");
var languageSetting = new ModeSetting("Язык", ["Русский", "English"], "Русский");
var autoDetectTemplate = new StateSetting("Автоопределение шаблона", false);
var showStatsButton = new ButtonSetting("Показать статистику", showStats);
var resetStatsButton = new ButtonSetting("Сбросить статистику", resetStats);
var groupTemplateSetting = new ModeSetting("Групповые шаблоны", ["Броня", "Инструменты", "Шлем+Нагрудник", "Меч+Кирка", "Броня+Инструменты", "Оружие", "Все"], "Броня");
var groupLevelSetting = new TextFieldSetting("Уровень группы", "Введите уровень (от -32767 до 32767)", "4");
var skipEnchantedSetting = new StateSetting("Пропускать зачарованные", true);
var applyGroupButton = new ButtonSetting("Применить групповое", applyGroupEnchantment);
var debugMode = new StateSetting("Включить отладку", false);

var stackCountSetting = new TextFieldSetting("Количество", "Введите количество (макс. 255)", "1");
var stackButton = new ButtonSetting("Стакать", applyStackCount);

enchantModule.addSettings([
    modeSetting, enchantmentSetting, templateSetting, levelSetting, applyButton,
    nameSetting, renameButton, deleteButton, previewButton, showEnchants,
    massRenameButton, massDeleteButton, randomEnchantButton, betaModeSetting,
    languageSetting, autoDetectTemplate, showStatsButton, resetStatsButton,
    groupTemplateSetting, groupLevelSetting, skipEnchantedSetting, applyGroupButton,
    debugMode, stackCountSetting, stackButton
]);

function getLocalizedMessage(message) {
    var translations = {
        "Русский": {
            "Ошибка: Слот пуст!": "Ошибка: Слот пуст!",
            "Ошибка: Нету предмета!": "Ошибка: Нету предмета!",
            "Ошибка: Нету предмета в руке!": "Ошибка: Нету предмета в руке!",
            "Ошибка: Уровень должен быть от -32767 до 32767!": "Ошибка: Уровень должен быть от -32767 до 32767!",
            "Ошибка: Действие в процессе!": "Ошибка: Действие в процессе!",
            "Зачаровано: ": "Зачаровано: ",
            " уровня ": " уровня ",
            "Зачаровано по шаблону: ": "Зачаровано по шаблону: ",
            " с уровнем ": " с уровнем ",
            "Применено случайное зачарование: ": "Применено случайное зачарование: ",
            "Переименовано в: ": "Переименовано в: ",
            "Удалено: предмет": "Удалено: предмет",
            "Ошибка: Введите название!": "Ошибка: Введите название!",
            "Успешно переименовано!": "Успешно переименовано!",
            "Успешно удалено!": "Успешно удалено!",
            "Прочность: ": "Прочность: ",
            "Название: ": "Название: ",
            "Слот: ": "Слот: ",
            "Количество: ": "Количество: ",
            "Прочность: Отсутствует": "Прочность: Отсутствует",
            "Зачаровано": "Зачаровано",
            "Не зачарован": "Не зачарован",
            "Предпросмотр шаблона: ": "Предпросмотр шаблона: ",
            "Автошаблон: Обнаружен ": "Автошаблон: Обнаружен ",
            "Автошаблон: Не найден, используется 'Без шаблона'!": "Автошаблон: Не найден, используется 'Без шаблона'!",
            "Статистика: Зачаровано предметов: ": "Статистика: Зачаровано предметов: ",
            "Переименовано предметов: ": "Переименовано предметов: ",
            "Удалено предметов: ": "Удалено предметов: ",
            "Случайных зачарований: ": "Случайных зачарований: ",
            "Застакано предметов: ": "Застакано предметов: ",
            "Использовано шаблонов: ": "Использовано шаблонов: ",
            "Средний уровень зачарований: ": "Средний уровень зачарований: ",
            "Топ зачарований: ": "Топ зачарований: ",
            "Нет данных": "Нет данных",
            "Статистика сброшена!": "Статистика сброшена!",
            " предметов": " предметов",
            "Установлено количество: ": "Установлено количество: ",
            "Ошибка: Введите положительное число!": "Ошибка: Введите положительное число!",
            "Ошибка: Количество не может превышать 255!": "Ошибка: Количество не может превышать 255!",
            "Ошибка: Шаблон не выбран!": "Ошибка: Шаблон не выбран!",
            "Ошибка: Предмет не соответствует шаблону ": "Ошибка: Предмет не соответствует шаблону "
        },
        "English": {
            "Ошибка: Слот пуст!": "Error: Slot is empty!",
            "Ошибка: Нету предмета!": "Error: No item!",
            "Ошибка: Нету предмета в руке!": "Error: No item in hand!",
            "Ошибка: Уровень должен быть от -32767 до 32767!": "Error: Level must be between -32767 and 32767!",
            "Ошибка: Действие в процессе!": "Error: Action in progress!",
            "Зачаровано: ": "Enchanted: ",
            " уровня ": " level ",
            "Зачаровано по шаблону: ": "Enchanted with template: ",
            " с уровнем ": " with level ",
            "Применено случайное зачарование: ": "Applied random enchantment: ",
            "Переименовано в: ": "Renamed to: ",
            "Удалено: предмет": "Deleted: item",
            "Ошибка: Введите название!": "Error: Enter name!",
            "Успешно переименовано!": "Successfully renamed!",
            "Успешно удалено!": "Successfully deleted!",
            "Прочность: ": "Durability: ",
            "Название: ": "Name: ",
            "Слот: ": "Slot: ",
            "Количество: ": "Count: ",
            "Прочность: Отсутствует": "Durability: None",
            "Зачаровано": "Enchanted",
            "Не зачарован": "Not enchanted",
            "Предпросмотр шаблона: ": "Template preview: ",
            "Автошаблон: Обнаружен ": "Auto-template: Detected ",
            "Автошаблон: Не найден, используется 'Без шаблона'!": "Auto-template: Not found, using 'No template'!",
            "Статистика: Зачаровано предметов: ": "Stats: Enchanted items: ",
            "Переименовано предметов: ": "Renamed items: ",
            "Удалено предметов: ": "Deleted items: ",
            "Случайных зачарований: ": "Random enchantments: ",
            "Застакано предметов: ": "Stacked items: ",
            "Использовано шаблонов: ": "Templates used: ",
            "Средний уровень зачарований: ": "Average enchantment level: ",
            "Топ зачарований: ": "Top enchantments: ",
            "Нет данных": "No data",
            "Статистика сброшена!": "Statistics reset!",
            " предметов": " items",
            "Установлено количество: ": "Set count: ",
            "Ошибка: Введите положительное число!": "Error: Enter a positive number!",
            "Ошибка: Количество не может превышать 255!": "Error: Count cannot exceed 255!",
            "Ошибка: Шаблон не выбран!": "Error: Template not selected!",
            "Ошибка: Предмет не соответствует шаблону ": "Error: Item does not match template "
        }
    };
    return translations[languageSetting.getCurrentMode()][message] || message;
}

function getEnchantName(enchantId) {
    var enchant = null;
    for (var i = 0; i < enchantments.length; i++) {
        if (enchantments[i].id === enchantId) {
            enchant = enchantments[i];
            break;
        }
    }
    return enchant ? (languageSetting.getCurrentMode() === "English" ? enchant.enName : enchant.name) : "Неизвестное зачарование";
}

function isItemValid(slot, template) {
    var itemId = Item.getID(slot);
    var validIds = itemIds[template];
    return validIds && validIds.indexOf(itemId) !== -1;
}

function updateStats(enchantId) {
    var stats = JSON.parse(Data.getString("enchantStats", "{}"));
    var enchantKey = enchantId.toString().split("Enchantment.")[1];
    stats[enchantKey] = (stats[enchantKey] || 0) + 1;
    Data.saveString("enchantStats", JSON.stringify(stats));
}

function incrementItemCounter(slot) {
    var lastSlot = Data.getString("lastEnchantedSlot");
    if (lastSlot !== slot.toString()) {
        var total = Data.getNumber("totalItemsEnchanted", 0);
        Data.saveNumber("totalItemsEnchanted", total + 1);
        Data.saveString("lastEnchantedSlot", slot.toString());
    }
}

function incrementStackCounter() {
    var total = Data.getNumber("totalItemsStacked", 0);
    Data.saveNumber("totalItemsStacked", total + 1);
}

function incrementRenameCounter() {
    var total = Data.getNumber("totalItemsRenamed", 0);
    Data.saveNumber("totalItemsRenamed", total + 1);
}

function incrementDeleteCounter() {
    var total = Data.getNumber("totalItemsDeleted", 0);
    Data.saveNumber("totalItemsDeleted", total + 1);
}

function incrementRandomEnchantCounter() {
    var total = Data.getNumber("totalRandomEnchants", 0);
    Data.saveNumber("totalRandomEnchants", total + 1);
}

function incrementEnchantLevel(level) {
    var total = Data.getNumber("totalEnchantLevels", 0);
    Data.saveNumber("totalEnchantLevels", total + level);
}

function incrementTemplateCounter() {
    var total = Data.getNumber("totalTemplatesUsed", 0);
    Data.saveNumber("totalTemplatesUsed", total + 1);
}

function getTemplateEnchantments(template) {
    var templateEnchants = {
        "Шлем": [Enchantment.PROTECTION, Enchantment.FIRE_PROTECTION, Enchantment.BLAST_PROTECTION, Enchantment.PROJECTILE_PROTECTION, Enchantment.RESPIRATION, Enchantment.AQUA_AFFINITY, Enchantment.THORNS, Enchantment.UNBREAKING],
        "Нагрудник": [Enchantment.PROTECTION, Enchantment.FIRE_PROTECTION, Enchantment.BLAST_PROTECTION, Enchantment.PROJECTILE_PROTECTION, Enchantment.THORNS, Enchantment.UNBREAKING],
        "Поножи": [Enchantment.PROTECTION, Enchantment.FIRE_PROTECTION, Enchantment.BLAST_PROTECTION, Enchantment.PROJECTILE_PROTECTION, Enchantment.THORNS, Enchantment.UNBREAKING],
        "Ботинки": [Enchantment.PROTECTION, Enchantment.FIRE_PROTECTION, Enchantment.BLAST_PROTECTION, Enchantment.PROJECTILE_PROTECTION, Enchantment.FEATHER_FALLING, Enchantment.DEPTH_STRIDER, Enchantment.FROST_WALKER, Enchantment.THORNS, Enchantment.UNBREAKING],
        "Меч": [Enchantment.SHARPNESS, Enchantment.SMITE, Enchantment.BANE_OF_ARTHROPODS, Enchantment.KNOCKBACK, Enchantment.FIRE_ASPECT, Enchantment.LOOTING, Enchantment.UNBREAKING],
        "Кирка": [Enchantment.EFFICIENCY, Enchantment.FORTUNE, Enchantment.UNBREAKING],
        "Топор": [Enchantment.EFFICIENCY, Enchantment.SHARPNESS, Enchantment.SMITE, Enchantment.BANE_OF_ARTHROPODS, Enchantment.FORTUNE, Enchantment.UNBREAKING],
        "Лопата": [Enchantment.EFFICIENCY, Enchantment.FORTUNE, Enchantment.UNBREAKING],
        "Мотыга": [Enchantment.EFFICIENCY, Enchantment.FORTUNE, Enchantment.UNBREAKING],
        "Лук": [Enchantment.POWER, Enchantment.PUNCH, Enchantment.FLAME, Enchantment.INFINITY, Enchantment.UNBREAKING],
        "Удочка": [Enchantment.LUCK_OF_THE_SEA, Enchantment.LURE, Enchantment.UNBREAKING],
        "Элитры": [Enchantment.UNBREAKING],
        "Ножницы": [Enchantment.UNBREAKING, Enchantment.EFFICIENCY],
        "Огниво": [Enchantment.UNBREAKING],
        "Книга": []
    };
    var result = templateEnchants[template] || [];
    if (template === "Книга") {
        for (var i = 0; i < enchantments.length; i++) {
            result.push(enchantments[i].id);
        }
    }
    return result;
}

function validateLevel(levelText) {
    var level = parseInt(levelText);
    if (isNaN(level) || level < -32767 || level > 32767) {
        throw new Error(getLocalizedMessage("Ошибка: Уровень должен быть от -32767 до 32767!"));
    }
    return level;
}

function applyEnchantments(slot, enchants, level, template) {
    var applied = 0;
    for (var i = 0; i < enchants.length; i++) {
        Item.enchant(slot, enchants[i], level);
        updateStats(enchants[i]);
        applied++;
    }
    incrementEnchantLevel(level);
    incrementTemplateCounter();
    Level.displayClientMessage(
        getLocalizedMessage("Зачаровано по шаблону: ") + template + 
        getLocalizedMessage(" с уровнем ") + level + 
        " (применено " + applied + " зачарований)"
    );
    incrementItemCounter(slot);
}

function detectTemplate(slot) {
    var itemId = Item.getID(slot);
    for (var template in itemIds) {
        if (itemIds.hasOwnProperty(template) && itemIds[template].indexOf(itemId) !== -1) {
            Level.displayClientMessage("§a" + getLocalizedMessage("Автошаблон: Обнаружен ") + template);
            return template;
        }
    }
    Level.displayClientMessage("§c" + getLocalizedMessage("Автошаблон: Не найден, используется 'Без шаблона'!"));
    return "Без шаблона";
}

function applyEnchantment() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var slot = Inventory.getSelectedSlot();
        var itemId = Item.getID(slot);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Item ID в слоте " + slot + ": " + itemId);
        }
        
        if (itemId === -1 || itemId === null || itemId === undefined) {
            Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));
            return;
        }

        var mode = modeSetting.getCurrentMode();
        var level = validateLevel(levelSetting.getText());

        if (mode === "Обычный") {
            var enchant = null;
            var selectedEnchant = enchantmentSetting.getCurrentMode();
            for (var i = 0; i < enchantments.length; i++) {
                if (enchantments[i].name === selectedEnchant) {
                    enchant = enchantments[i];
                    break;
                }
            }
            if (!enchant) {
                Level.displayClientMessage("§c[Debug] Зачарование не найдено!");
                if (debugMode.isActive()) {
                    Level.displayClientMessage("§7[Debug] Не удалось найти зачарование: " + selectedEnchant);
                }
                return;
            }
            Item.enchant(slot, enchant.id, level);
            updateStats(enchant.id);
            incrementEnchantLevel(level);
            incrementItemCounter(slot);
            Level.displayClientMessage(
                getLocalizedMessage("Зачаровано: ") + getEnchantName(enchant.id) + 
                getLocalizedMessage(" уровня ") + level
            );
        } else if (mode === "Шаблон") {
            var template = autoDetectTemplate.isActive() && templateSetting.getCurrentMode() === "Без шаблона" ? detectTemplate(slot) : templateSetting.getCurrentMode();
            if (template === "Без шаблона") return Level.displayClientMessage(getLocalizedMessage("Ошибка: Шаблон не выбран!"));
            if (!isItemValid(slot, template)) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Предмет не соответствует шаблону ") + template);
            applyEnchantments(slot, getTemplateEnchantments(template), level, template);
        }
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в applyEnchantment: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function applyRandomEnchantment() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var slot = Inventory.getSelectedSlot();
        var itemId = Item.getID(slot);
        if (itemId === -1 || itemId === null || itemId === undefined) {
            Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));
            return;
        }

        var enchant = enchantments[ThreadLocalRandom.current().nextInt(0, enchantments.length)];
        var level = ThreadLocalRandom.current().nextInt(-32767, 32768);

        Item.enchant(slot, enchant.id, level);
        updateStats(enchant.id);
        incrementEnchantLevel(level);
        incrementRandomEnchantCounter();
        incrementItemCounter(slot);
        Level.displayClientMessage(
            getLocalizedMessage("Применено случайное зачарование: ") + getEnchantName(enchant.id) + 
            getLocalizedMessage(" уровня ") + level
        );
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в applyRandomEnchantment: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function renameItem() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var slot = Inventory.getSelectedSlot();
        var itemId = Item.getID(slot);
        if (itemId === -1 || itemId === null || itemId === undefined) {
            Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));
            return;
        }

        var name = nameSetting.getText().trim();
        if (!name) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Введите название!"));

        Item.setName(slot, name);
        incrementRenameCounter();
        Level.displayClientMessage(
            getLocalizedMessage("Переименовано в: ") + name
        );
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в renameItem: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function deleteItem() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var slot = Inventory.getSelectedSlot();
        var itemId = Item.getID(slot);
        if (itemId === -1 || itemId === null || itemId === undefined) {
            Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));
            return;
        }

        Inventory.dropSlot(slot, true, true);
        incrementDeleteCounter();
        Level.displayClientMessage(getLocalizedMessage("Успешно удалено!"));
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в deleteItem: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function massRenameItems() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var name = nameSetting.getText().trim();
        if (!name) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Введите название!"));

        var hasItems = false;
        for (var slot = 0; slot <= 8; slot++) {
            var itemId = Item.getID(slot);
            if (itemId !== -1 && itemId !== null && itemId !== undefined) {
                hasItems = true;
                Item.setName(slot, name);
            }
        }
        if (!hasItems) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));

        incrementRenameCounter();
        Level.displayClientMessage(getLocalizedMessage("Успешно переименовано!"));
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в massRenameItems: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function massDeleteItems() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var hasItems = false;
        for (var slot = 0; slot <= 8; slot++) {
            var itemId = Item.getID(slot);
            if (itemId !== -1 && itemId !== null && itemId !== undefined) {
                hasItems = true;
                Inventory.dropSlot(slot, true, true);
            }
        }
        if (!hasItems) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));

        incrementDeleteCounter();
        Level.displayClientMessage(getLocalizedMessage("Успешно удалено!"));
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в massDeleteItems: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

var lastPreviewMessage = "";
function previewItem() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));

    var slot = Inventory.getSelectedSlot();
    var itemId = Item.getID(slot);
    
    var name = Item.getName(slot);
    var maxDamage = Item.getMaxDamage(slot);
    var damage = Item.getDamage(slot);
    var durability = maxDamage - damage;
    var data = Item.getData(slot);
    var fullId = data > 0 ? (Item.getID(slot) + ":" + data) : Item.getID(slot);
    var isEnchanted = Item.isEnchanted(slot);
    var count = Item.getCount(slot);

    var message = maxDamage > 0 ? "§a[Предпросмотр] §" + (durability / maxDamage * 100 < 10 ? "c" : durability / maxDamage * 100 < 50 ? "e" : "a") + getLocalizedMessage("Прочность: ") + durability + "/" + maxDamage + "\n" : "§c[Предпросмотр] " + getLocalizedMessage("Прочность: Отсутствует") + "\n";
    message += "§7" + getLocalizedMessage("Название: ") + name + "\n";
    message += "§7ID: " + fullId + "\n";
    message += "§7" + getLocalizedMessage("Слот: ") + (slot + 1) + "\n";
    message += "§7" + getLocalizedMessage("Количество: ") + count;

    if (showEnchants.isActive()) {
        message += "\n§b" + (isEnchanted ? getLocalizedMessage("Зачаровано") : getLocalizedMessage("Не зачарован"));
    }

    if (modeSetting.getCurrentMode() === "Шаблон" && templateSetting.getCurrentMode() !== "Без шаблона") {
        var template = templateSetting.getCurrentMode();
        message += "\n§6" + getLocalizedMessage("Предпросмотр шаблона: ") + template;
        var enchants = getTemplateEnchantments(template);
        for (var i = 0; i < enchants.length; i++) {
            message += "\n - " + getEnchantName(enchants[i]) + " " + levelSetting.getText();
        }
    }

    if (message !== lastPreviewMessage) {
        Level.displayClientMessage(message);
        lastPreviewMessage = message;
    }
}

function showStats() {
    var totalEnchanted = Data.getNumber("totalItemsEnchanted", 0);
    var totalStacked = Data.getNumber("totalItemsStacked", 0);
    var totalRenamed = Data.getNumber("totalItemsRenamed", 0);
    var totalDeleted = Data.getNumber("totalItemsDeleted", 0);
    var totalRandom = Data.getNumber("totalRandomEnchants", 0);
    var totalTemplates = Data.getNumber("totalTemplatesUsed", 0);
    var totalLevels = Data.getNumber("totalEnchantLevels", 0);
    var avgLevel = totalEnchanted > 0 ? Math.round(totalLevels / totalEnchanted) : 0;
    var stats = JSON.parse(Data.getString("enchantStats", "{}"));
    var top = [];
    for (var key in stats) {
        if (stats.hasOwnProperty(key)) {
            var enchant = null;
            for (var i = 0; i < enchantments.length; i++) {
                if (enchantments[i].id.toString().split("Enchantment.")[1] === key) {
                    enchant = enchantments[i];
                    break;
                }
            }
            if (enchant) top.push({ name: enchant.name, count: stats[key] });
        }
    }
    for (var i = 0; i < top.length - 1; i++) {
        for (var j = 0; j < top.length - i - 1; j++) {
            if (top[j].count < top[j + 1].count) {
                var temp = top[j];
                top[j] = top[j + 1];
                top[j + 1] = temp;
            }
        }
    }
    if (top.length > 3) top.length = 3;

    var topText = top.length ? "" : getLocalizedMessage("Нет данных");
    for (var i = 0; i < top.length; i++) {
        topText += (i > 0 ? ", " : "") + top[i].name + " (" + top[i].count + ")";
    }

    var message = "§eСтатистика:\n";
    message += getLocalizedMessage("Зачаровано предметов: ") + totalEnchanted + getLocalizedMessage(" предметов") + "\n";
    message += getLocalizedMessage("Переименовано предметов: ") + totalRenamed + getLocalizedMessage(" предметов") + "\n";
    message += getLocalizedMessage("Удалено предметов: ") + totalDeleted + getLocalizedMessage(" предметов") + "\n";
    message += getLocalizedMessage("Случайных зачарований: ") + totalRandom + "\n";
    message += getLocalizedMessage("Застакано предметов: ") + totalStacked + getLocalizedMessage(" предметов") + "\n";
    message += getLocalizedMessage("Использовано шаблонов: ") + totalTemplates + "\n";
    message += getLocalizedMessage("Средний уровень зачарований: ") + avgLevel + "\n";
    message += getLocalizedMessage("Топ зачарований: ") + topText;

    Level.displayClientMessage(message);
}

function resetStats() {
    Data.saveNumber("totalItemsEnchanted", 0);
    Data.saveString("enchantStats", "{}");
    Data.saveString("lastEnchantedSlot", "");
    Data.saveNumber("totalItemsStacked", 0);
    Data.saveNumber("totalItemsRenamed", 0);
    Data.saveNumber("totalItemsDeleted", 0);
    Data.saveNumber("totalRandomEnchants", 0);
    Data.saveNumber("totalTemplatesUsed", 0);
    Data.saveNumber("totalEnchantLevels", 0);
    Level.displayClientMessage(getLocalizedMessage("Статистика сброшена!"));
}

function applyGroupEnchantment() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var level = validateLevel(groupLevelSetting.getText());
        var group = groupTemplateSetting.getCurrentMode();
        var groups = {
            "Броня": ["Шлем", "Нагрудник", "Поножи", "Ботинки"],
            "Инструменты": ["Кирка", "Топор", "Лопата", "Мотыга"],
            "Шлем+Нагрудник": ["Шлем", "Нагрудник"],
            "Меч+Кирка": ["Меч", "Кирка"],
            "Броня+Инструменты": ["Шлем", "Нагрудник", "Поножи", "Ботинки", "Кирка", "Топор", "Лопата", "Мотыга"],
            "Оружие": ["Меч", "Лук", "Удочка"],
            "Все": []
        };

        var templates = groups[group] || [];
        if (group === "Все") {
            templates = Object.keys(itemIds); // Получаем все шаблоны
        }

        var count = 0, items = {};
        for (var slot = 0; slot <= 35; slot++) {
            var itemId = Item.getID(slot);
            if (itemId === -1 || itemId === null || itemId === undefined || (skipEnchantedSetting.isActive() && Item.isEnchanted(slot))) continue;
            var template = null;
            for (var i = 0; i < templates.length; i++) {
                if (isItemValid(slot, templates[i])) {
                    template = templates[i];
                    break;
                }
            }
            if (template) {
                applyEnchantments(slot, getTemplateEnchantments(template), level, template);
                count++;
                items[template] = (items[template] || 0) + 1;
            }
        }

        var message = getLocalizedMessage("Зачаровано: ") + count + getLocalizedMessage(" предметов");
        if (count > 0) {
            var itemDetails = [];
            for (var t in items) {
                if (items.hasOwnProperty(t)) {
                    itemDetails.push(t + ": " + items[t]);
                }
            }
            message += " (" + itemDetails.join(", ") + ")";
        }
        Level.displayClientMessage(message);
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в applyGroupEnchantment: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function applyStackCount() {
    if (isActionInProgress) return Level.displayClientMessage(getLocalizedMessage("Ошибка: Действие в процессе!"));
    isActionInProgress = true;

    try {
        var slot = Inventory.getSelectedSlot();
        var itemId = Item.getID(slot);
        if (itemId === -1 || itemId === null || itemId === undefined) {
            Level.displayClientMessage(getLocalizedMessage("Ошибка: Нету предмета в руке!"));
            return;
        }

        var countText = stackCountSetting.getText().trim();
        var count = parseInt(countText);
        if (isNaN(count) || count < 0) {
            Level.displayClientMessage("§c" + getLocalizedMessage("Ошибка: Введите положительное число!"));
            return;
        }

        if (count > 255) {
            Level.displayClientMessage("§c" + getLocalizedMessage("Ошибка: Количество не может превышать 255!"));
            return;
        }

        Item.setCount(slot, count);
        incrementStackCounter();
        Level.displayClientMessage(
            getLocalizedMessage("Установлено количество: ") + count
        );
    } catch (e) {
        Level.displayClientMessage("§cОшибка: " + e);
        if (debugMode.isActive()) {
            Level.displayClientMessage("§7[Debug] Исключение в applyStackCount: " + e);
        }
    } finally {
        isActionInProgress = false;
    }
}

function updateSettingsVisibility() {
    var mode = modeSetting.getCurrentMode();
    var betaMode = betaModeSetting.getCurrentMode();

    enchantmentSetting.setVisibility(mode === "Обычный");
    templateSetting.setVisibility(mode === "Шаблон");
    levelSetting.setVisibility(mode === "Обычный" || mode === "Шаблон");
    applyButton.setVisibility(mode === "Обычный" || mode === "Шаблон");
    nameSetting.setVisibility(mode === "Переименование");
    renameButton.setVisibility(mode === "Переименование");
    deleteButton.setVisibility(mode === "Удаление");
    previewButton.setVisibility(mode === "Предпросмотр");
    showEnchants.setVisibility(mode === "Предпросмотр");
    massRenameButton.setVisibility(mode === "Переименование");
    massDeleteButton.setVisibility(mode === "Удаление");
    randomEnchantButton.setVisibility(mode === "Случайное зачарование");
    betaModeSetting.setVisibility(mode === "Бета-функции");

    languageSetting.setVisibility(mode === "Бета-функции" && betaMode === "Язык");
    autoDetectTemplate.setVisibility(mode === "Бета-функции" && betaMode === "Автошаблон");
    showStatsButton.setVisibility(mode === "Бета-функции" && betaMode === "Статистика");
    resetStatsButton.setVisibility(mode === "Бета-функции" && betaMode === "Статистика");
    groupTemplateSetting.setVisibility(mode === "Бета-функции" && betaMode === "Групповое зачарование");
    groupLevelSetting.setVisibility(mode === "Бета-функции" && betaMode === "Групповое зачарование");
    skipEnchantedSetting.setVisibility(mode === "Бета-функции" && betaMode === "Групповое зачарование");
    applyGroupButton.setVisibility(mode === "Бета-функции" && betaMode === "Групповое зачарование");
    debugMode.setVisibility(mode === "Бета-функции" && betaMode === "Отладка");

    stackCountSetting.setVisibility(mode === "Стакалка");
    stackButton.setVisibility(mode === "Стакалка");
}

modeSetting.setOnModeSelectedListener(updateSettingsVisibility);
betaModeSetting.setOnModeSelectedListener(updateSettingsVisibility);
enchantModule.setOnToggleListener(function(view, active) {
    if (active) updateSettingsVisibility();
});

ModuleManager.addModule(enchantModule);

function onScriptEnabled() {
    updateSettingsVisibility();
}