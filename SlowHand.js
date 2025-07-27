var module = new Module("SlowHand", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("Slow", [3, 1, 10, 1]);
module.addSettings([slider]);

// Функция onLevelTick, вызываемая при каждом обновлении уровня
function onLevelTick() {
    // Проверка активности модуля RegularJump и SuperJump
    if (module.isActive() && Module.isActive("SlowHand")) {
        // Добавляем эффект для регулярного прыжка с уровнем, заданным в настройках модуля
        LocalPlayer.addEffect(4, 3, slider.getCurrentValue(), false);
    } else {
        // Удаляем эффект при отключенном модуле или SuperJump
        LocalPlayer.removeEffect(4);
    }
}

// Функция для ограничения значения в заданном диапазоне
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// Функция для установки уровня прыжка
function setLevel(level) {
    slider.getCurrentValue() = clamp(level, 1, 3);
}

// Волшебная функция, вызываемая при включении скрипта
function onScriptEnabled() {
    // Добавляем в наш арсенал модуль RegularJump
    ModuleManager.addModule(module);
}

// Волшебная функция, вызываемая при выключении скрипта
function onScriptDisabled() {
    // Убираем из арсенала модуль RegularJump
    ModuleManager.removeModule(module);
}