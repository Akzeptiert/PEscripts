var module = new Module("AttackCoordinate_Name", true, true, ModuleCategory.MISC);

// Глобальные переменные для хранения координат игрока
var playerCoordinates = null;

function showCoordinates(playerID) {
    // Получаем координаты игрока и округляем до одного знака после запятой
    var x = parseFloat(Player.getPositionX(playerID)).toFixed(1);
    var y = parseFloat(Player.getPositionY(playerID)).toFixed(1);
    var z = parseFloat(Player.getPositionZ(playerID)).toFixed(1);
    playerCoordinates = "Player coordinates: X: " + x + ", Y: " + y + ", Z: " + z;

    // Показываем координаты над инвентарем
    Level.showTipMessage(playerCoordinates);
}

function onAttack(playerID) {
    if (module.isActive()) {
        // Показываем координаты при атаке игрока
        showCoordinates(playerID);
    }
}

function onLevelTick() {
    if (module.isActive() && playerCoordinates !== null) {
        // Периодически обновляем координаты на экране при каждом тике игры
        Level.showTipMessage(playerCoordinates);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    // Не удаляем модуль и не очищаем координаты при выключении
    // Так координаты будут оставаться на экране до перезагрузки игры или явного отключения модуля
}