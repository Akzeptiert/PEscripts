const module = new Module("HeadDetect", true, true, ModuleCategory.MISC);

var threadRunning = false;
var searchThread;
let a;
let b;
let c;

function onLevelTick() {
    if (module.isActive()) {
        if (!threadRunning) {
            threadRunning = true;
            searchThread = new java.lang.Thread(new java.lang.Runnable({
                run: function () {
                    let radius = 7;
                    
                    while (threadRunning) {
                        var playerX = LocalPlayer.getPositionX();
                        var playerY = LocalPlayer.getPositionY();
                        var playerZ = LocalPlayer.getPositionZ();

                        var minX = Math.floor(playerX - radius);
                        var maxX = Math.floor(playerX + radius);
                        var minY = Math.floor(playerY - radius);
                        var maxY = Math.floor(playerY + radius);
                        var minZ = Math.floor(playerZ - radius);
                        var maxZ = Math.floor(playerZ + radius);

                        var headX, headY, headZ;

                        // Поиск кровати
                        for (var x = minX; x <= maxX; x++) {
                            for (var y = minY; y <= maxY; y++) {
                                for (var z = minZ; z <= maxZ; z++) {
                                    blockId = Block.getID(x, y, z);

                                    if (blockId === 56) { // голова
                                        headX = x;
                                        headY = y;
                                        headZ = z;
                                        a = headX;
                                        b = headY;
                                        c = headZ;
                                        LocalPlayer.buildBlock(headX, headY, headZ);
                                        break;
                                    }
                                }
                            }
                        }
                        java.lang.Thread.sleep(100);
                    }
                }
            }));
            searchThread.start();
        }
    } else {
        if (threadRunning) {
            threadRunning = false;
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}