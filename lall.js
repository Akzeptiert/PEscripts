const module = new Module("AutoWalk", true, true, ModuleCategory.MOVEMENT);
let cachedBlocks = {};
let blocksToRender = [];
let radiusValue = 5;
let movingDirection = null; // Направление движения: 'left', 'right' или null
let isBackingUp = false; // Флаг для отслеживания, нужно ли отойти назад

// Сканирование и кэширование блоков вокруг игрока
function updateBlocks() {
    let playerX = Math.round(LocalPlayer.getPositionX());
    let playerY = Math.round(LocalPlayer.getPositionY());
    let playerZ = Math.round(LocalPlayer.getPositionZ());

    // Формирование ключа для кэша на основе текущей позиции игрока и радиуса
    let cacheKey = playerX + playerY + playerZ + radiusValue;

    if (cachedBlocks[cacheKey]) {
        blocksToRender = cachedBlocks[cacheKey];
    } else {
        blocksToRender = [];
        for (let x = -radiusValue; x <= radiusValue; x++) {
            for (let y = 0; y <= radiusValue; y++) { // Сканируем только на уровне игрока и выше
                for (let z = -radiusValue; z <= radiusValue; z++) {
                    let blockX = playerX + x;
                    let blockY = playerY + y; // Проверка только на уровне игрока и выше
                    let blockZ = playerZ + z;
                    let currentBlockId = Block.getID(blockX, blockY, blockZ);
                    
                    if (currentBlockId !== 0) { // Проверка всех блоков, кроме воздуха
                        blocksToRender.push({x: blockX, y: blockY, z: blockZ});
                    }
                }
            }
        }
        cachedBlocks[cacheKey] = blocksToRender;
    }
}

// Найти концы блоков
function findBlockEnds() {
    let playerX = Math.round(LocalPlayer.getPositionX());
    let playerY = Math.round(LocalPlayer.getPositionY());
    let playerZ = Math.round(LocalPlayer.getPositionZ());

    let blockEnds = {
        left: null,
        right: null
    };

    blocksToRender.forEach(block => {
        let relativeX = block.x - playerX;
        let relativeY = block.y - playerY;
        let relativeZ = block.z - playerZ;

        // Проверяем только те блоки, которые находятся прямо перед игроком
        if (relativeZ < 0 && relativeY >= 0) {
            if (relativeX < 0) {
                if (blockEnds.left === null || block.x > blockEnds.left.x) {
                    blockEnds.left = block;
                }
            } else if (relativeX > 0) {
                if (blockEnds.right === null || block.x < blockEnds.right.x) {
                    blockEnds.right = block;
                }
            }
        }
    });

    return blockEnds;
}

// Определение и обход препятствий
function checkAndAvoidObstacle() {
    let playerX = Math.round(LocalPlayer.getPositionX());
    let playerZ = Math.round(LocalPlayer.getPositionZ());

    let blockEnds = findBlockEnds();

    let leftDistance = blockEnds.left ? Math.abs(blockEnds.left.x - playerX) : Infinity;
    let rightDistance = blockEnds.right ? Math.abs(blockEnds.right.x - playerX) : Infinity;

    if (leftDistance < radiusValue || rightDistance < radiusValue) {
        if (leftDistance < rightDistance) {
            movingDirection = 'left';
        } else {
            movingDirection = 'right';
        }
    } else {
        movingDirection = null; // Остановить движение, если нет препятствий
    }

    // Управление движением
    if (movingDirection === 'left') {
        LocalPlayer.setMoveButtonStatus(MoveButton.LEFT, true);
        LocalPlayer.setMoveButtonStatus(MoveButton.RIGHT, false);
    } else if (movingDirection === 'right') {
        LocalPlayer.setMoveButtonStatus(MoveButton.RIGHT, true);
        LocalPlayer.setMoveButtonStatus(MoveButton.LEFT, false);
    } else {
        // Если расстояния одинаковы или все блоки закрыты, останавливаем движение
        LocalPlayer.setMoveButtonStatus(MoveButton.LEFT, false);
        LocalPlayer.setMoveButtonStatus(MoveButton.RIGHT, false);
    }
}

// Отход назад, если перед игроком есть препятствия
function moveBackAndDecide() {
    let playerX = Math.round(LocalPlayer.getPositionX());
    let playerY = Math.round(LocalPlayer.getPositionY());
    let playerZ = Math.round(LocalPlayer.getPositionZ());

    let isBlocked = blocksToRender.some(block => {
        let relativeX = block.x - playerX;
        let relativeZ = block.z - playerZ;
        return relativeZ >= 0 && Math.abs(relativeX) <= 1; // Проверка блоков перед игроком
    });

    if (isBlocked) {
        LocalPlayer.setMoveButtonStatus(MoveButton.BACK, true);
        LocalPlayer.setMoveButtonStatus(MoveButton.LEFT, false);
        LocalPlayer.setMoveButtonStatus(MoveButton.RIGHT, false);
        isBackingUp = true; // Устанавливаем флаг для отслеживания, что отходим назад
    } else {
        LocalPlayer.setMoveButtonStatus(MoveButton.BACK, false);
        isBackingUp = false; // Заканчиваем движение назад
    }
}

// Основной цикл
function onLevelTick() {
    if (module.isActive()) {
        updateBlocks();

        if (isBackingUp) {
            moveBackAndDecide();
        } else {
            checkAndAvoidObstacle();
        }
    }
}

function onScriptEnabled() {
    // Сброс состояния при включении скрипта
    isBackingUp = true; // Всегда отходим назад при включении
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    // Остановка скрипта и очистка состояния
    LocalPlayer.setMoveButtonStatus(MoveButton.BACK, false);
    LocalPlayer.setMoveButtonStatus(MoveButton.LEFT, false);
    LocalPlayer.setMoveButtonStatus(MoveButton.RIGHT, false);
    ModuleManager.removeModule(module);
}
