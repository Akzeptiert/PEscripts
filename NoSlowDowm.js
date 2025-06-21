// Глобальная переменная для хранения экземпляра модуля.
var noSlowModule = null;

// onScriptEnabled() вызывается после включения скрипта.
function onScriptEnabled() {
    // Создаем новый модуль "NoSlow".
    noSlowModule = new Module("NoSlow", true, true, ModuleCategory.MOVEMENT);

    // --- Настройки модуля ---

    // Множитель скорости: определяет, насколько сильно будет восстанавливаться скорость.
    // 0.0 = без восстановления (полное замедление)
    // 1.0 = полное восстановление (движение с обычной скоростью, несмотря на замедление)
    var speedFactorSetting = new SliderSetting("Множитель скорости NoSlow", [1.0, 0.0, 1.0, 0.05]);

    noSlowModule.addSetting(speedFactorSetting);

    // Добавляем модуль в менеджер модулей лаунчера.
    ModuleManager.addModule(noSlowModule);
    print("Модуль NoSlow активирован!");
}

// onScriptDisabled() вызывается перед выключением скрипта.
function onScriptDisabled() {
    if (noSlowModule) {
        ModuleManager.removeModule(noSlowModule);
        // Важно: при деактивации модуля сбрасываем состояние спринта.
        LocalPlayer.setSprinting(false);
        print("Модуль NoSlow деактивирован!");
        noSlowModule = null;
    }
}

// onLevelTick() вызывается 20 раз в секунду (каждый игровой тик).
// Это основное место для логики NoSlow и Спринта.
function onLevelTick() {
    // Проверяем, существует ли модуль и активен ли он.
    if (noSlowModule && noSlowModule.isActive()) {
        // Получаем текущий множитель скорости из настроек модуля.
        var speedFactor = noSlowModule.getSetting("Множитель скорости NoSlow").getCurrentValue();

        // Проверяем, пытается ли игрок двигаться (нажимает ли кнопки движения).
        var isPlayerMoving = LocalPlayer.isMovingForward() ||
                             LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) ||
                             LocalPlayer.isMoveButtonPressed(MoveButton.BACK) ||
                             LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) ||
                             LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT);

        // --- Логика Спринта ---
        if (isPlayerMoving) {
            // Если игрок движется, принудительно включаем спринт.
            LocalPlayer.setSprinting(true);
        } else {
            // Если игрок не движется, выключаем спринт.
            LocalPlayer.setSprinting(false);
        }

        // --- Логика NoSlow ---
        // Применяем NoSlow, если игрок движется ИЛИ находится в воде/лаве.
        if (isPlayerMoving || LocalPlayer.isInWater() || LocalPlayer.isInLava()) {
            var velX = LocalPlayer.getVelocityX();
            var velY = LocalPlayer.getVelocityY();
            var velZ = LocalPlayer.getVelocityZ();

            var currentHorizontalSpeed = Math.sqrt(velX * velX + velZ * velZ);

            // Определяем базовую "нормальную" скорость спринта игрока.
            const NORMAL_WALK_SPEED = 0.1; // Примерно 0.1 блока в тик
            const NORMAL_SPRINT_SPEED = NORMAL_WALK_SPEED * 1.3; // Спринт примерно в 1.3 раза быстрее ходьбы

            // Базовая скорость, которую мы хотим поддерживать, будет скоростью спринта.
            var baseSpeed = NORMAL_SPRINT_SPEED;

            // Если текущая горизонтальная скорость значительно ниже, чем должна быть
            // при спринте с учетом множителя скорости.
            if (currentHorizontalSpeed < baseSpeed * speedFactor * 0.95) {
                var desiredSpeed = baseSpeed * speedFactor;

                if (currentHorizontalSpeed > 0.001) { // Избегаем деления на ноль.
                    // Нормализуем текущий вектор скорости и масштабируем его до желаемой скорости.
                    LocalPlayer.setVelocityX(velX / currentHorizontalSpeed * desiredSpeed);
                    LocalPlayer.setVelocityZ(velZ / currentHorizontalSpeed * desiredSpeed);
                } else if (isPlayerMoving) { // Применяем скорость только если игрок пытается двигаться
                    // Если игрок почти не движется (но пытается), применяем скорость
                    // в направлении, куда он смотрит (предполагаем движение вперед).
                    var yaw = LocalPlayer.getYaw();
                    var radYaw = (yaw + 90) * Math.PI / 180;

                    LocalPlayer.setVelocityX(Math.cos(radYaw) * desiredSpeed);
                    LocalPlayer.setVelocityZ(Math.sin(radYaw) * desiredSpeed);
                }
            }

            // Дополнительная коррекция для вертикальной скорости в воде/лаве, если нужно.
            // В воде игрок замедляется и по вертикали.
            if (LocalPlayer.isInWater() || LocalPlayer.isInLava()) {
                // Если игрок пытается подняться или опуститься,
                // можно увеличить его вертикальную скорость.
                // Это упрощение, так как API не предоставляет прямого контроля над "плаванием".
                // Можно попробовать увеличить velY, если игрок нажимает прыжок.
                if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                    LocalPlayer.setVelocityY(0.2 * speedFactor); // Увеличиваем скорость подъема
                } else if (velY < 0 && LocalPlayer.isOnGround()) { // Если падает, но не на земле
                    LocalPlayer.setVelocityY(velY * (1 - speedFactor)); // Снижаем замедление падения
                }
            }
        }
    } else {
        // Если модуль неактивен, убеждаемся, что спринт выключен.
        LocalPlayer.setSprinting(false);
    }
}

