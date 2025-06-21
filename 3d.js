var module = new Module("STEREOSound", true, true, ModuleCategory.MISC);
var mediaPlayer = null;
var isPlaying = false;
var tickCounter = 0;
var updateFrequency = 20;  // Обновляем каждые 20 тиков (примерно каждую секунду)

function playSound(path) {
    if (mediaPlayer == null) {
        mediaPlayer = new android.media.MediaPlayer();
        mediaPlayer.setDataSource(path);
        mediaPlayer.prepare();
        mediaPlayer.setLooping(true);  // Включаем зацикливание музыки
        mediaPlayer.start();
        isPlaying = true;
    }
}

function adjustVolume(volume) {
    if (mediaPlayer != null && isPlaying) {
        mediaPlayer.setVolume(volume, volume);  // Устанавливаем громкость
    }
}

function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function onLevelTick() {
    if (module.isActive()) {
        tickCounter++;
        if (tickCounter >= updateFrequency) {
            tickCounter = 0;  // Сбрасываем счетчик

            const playerX = Math.round(LocalPlayer.getPositionX());
            const playerY = Math.round(LocalPlayer.getPositionY());
            const playerZ = Math.round(LocalPlayer.getPositionZ());
            const musicPath = "/storage/emulated/0/Download/fonk3.mp3";
            
            // Запускаем музыку, если она еще не воспроизводится
            if (!isPlaying) {
                playSound(musicPath);
            }
            
            const radius = 24;
            const step = 4;
            const blockPositions = [];
            
            for (let xOffset = -radius; xOffset <= radius; xOffset += step) {
                for (let yOffset = 0; yOffset <= radius; yOffset += step) {
                    for (let zOffset = -radius; zOffset <= radius; zOffset += step) {
                        blockPositions.push([playerX + xOffset, playerY + yOffset, playerZ + zOffset]);
                    }
                }
            }

            let closestDistance = radius;
            blockPositions.forEach(function(blockPos) {
                let distance = getDistance(playerX, playerY, playerZ, blockPos[0], blockPos[1], blockPos[2]);
                if (distance < closestDistance) {
                    closestDistance = distance;
                }
            });

            let volume = Math.max(0.1, (1 - closestDistance / radius));
            adjustVolume(volume);
        }
    } else {
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
            isPlaying = false;
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
