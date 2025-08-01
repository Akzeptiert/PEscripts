const Esp = new Module("X-ray", true, true, ModuleCategory.MISC);
var blockId = new TextFieldSetting("Block ID", "Enter block ID", "");
var radius = new TextFieldSetting("Radius", "Enter Radius", "");
var inspector = new StateSetting("xray top 1 mira", false);

Esp.addSettings([blockId, radius, inspector]);

function onUseItem(x, y, z, side, item, block) {
    if (!inspector.isActive()) { return; }
    Level.showTipMessage("Block: " + block);
}

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;
let threadRunning = false;
let radiusValue;
let blockIdValue;
let cacheKey;
let bedPositions = []; // Инициализация массива
let di = false;
let currentRadius;

var Render = {
    getFloatBuffer: function(fArray) {
        let bBuffer = java.nio.ByteBuffer.allocateDirect(fArray.length * 4);
        bBuffer.order(java.nio.ByteOrder.nativeOrder());
        let fBuffer = bBuffer.asFloatBuffer();
        fBuffer.put(fArray);
        fBuffer.position(0);
        return fBuffer;
    },

    getShortBuffer: function(sArray) {
        let bBuffer = java.nio.ByteBuffer.allocateDirect(sArray.length * 2);
        bBuffer.order(java.nio.ByteOrder.nativeOrder());
        let sBuffer = bBuffer.asShortBuffer();
        sBuffer.put(sArray);
        sBuffer.position(0);
        return sBuffer;
    },

    renderer: null,
    glSurface: null,
    fov: 110,
    initted: false,
    blocksToRender: [],
    cachedBlocks: {},  // Добавлено кеширование

    init: function() {
        this.renderer = new android.opengl.GLSurfaceView.Renderer({
            onSurfaceCreated: function(gl, config) {
                gl.glEnable(GL10.GL_TEXTURE_2D);
                gl.glShadeModel(GL10.GL_SMOOTH);
                gl.glClearColor(0, 0, 0, 0);
                gl.glClearDepthf(1);
                gl.glEnable(GL10.GL_DEPTH_TEST);
                gl.glDepthFunc(GL10.GL_LEQUAL);
                gl.glHint(GL10.GL_PERSPECTIVE_CORRECTION_HINT, GL10.GL_NICEST);
            },

            onSurfaceChanged: function(gl, width, height) {
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();
                GLU.gluPerspective(gl, Render.fov, ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 50);
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },

            onDrawFrame: function(gl) {
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();
                GLU.gluPerspective(gl, Render.fov, ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 50);
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
                gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
                gl.glLoadIdentity();
                gl.glDisable(GL10.GL_LIGHTING);
                if (getScreenName() === "hud_screen") {
                    try {
                        let yaw = LocalPlayer.getYaw() % 360;
                        let pitch = LocalPlayer.getPitch() % 360;
                        let eyeX = LocalPlayer.getPositionX();
                        let eyeY = LocalPlayer.getPositionY() + 1;
                        let eyeZ = LocalPlayer.getPositionZ();
                        let dCenterX = Math.sin(yaw / 180 * Math.PI);
                        let dCenterZ = Math.cos(yaw / 180 * Math.PI);
                        let dCenterY = Math.sqrt(dCenterX * dCenterX + dCenterZ * dCenterZ) * Math.tan((pitch - 180) / 180 * Math.PI);
                        let centerX = eyeX - dCenterX;
                        let centerZ = eyeZ + dCenterZ;
                        let centerY = eyeY - dCenterY;
                        GLU.gluLookAt(gl, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0, 1, 0);

                        if (Esp.isActive() && LocalPlayer.isInGame()) {
                            Render.blocksToRender.forEach(block => {
                                Render.drawBox(gl, block.x, block.y, block.z);
                            });
                        }
                    } catch (e) {
                        print("RenderProblem: " + e + " at line " + e.lineNumber);
                    }
                }
            }
        });

        ctx.runOnUiThread(() => {
            Render.glSurface = new android.opengl.GLSurfaceView(ctx);
            Render.glSurface.setZOrderOnTop(true);
            Render.glSurface.setEGLConfigChooser(8, 8, 8, 8, 16, 0);
            Render.glSurface.getHolder().setFormat(android.graphics.PixelFormat.TRANSLUCENT);
            Render.glSurface.setRenderer(Render.renderer);
            Render.glSurface.setRenderMode(0);
            ctx.getWindow().getDecorView().addView(Render.glSurface);
            Render.initted = true;
        });
    },

updateBlocksToRender: function() {
if (Esp.isActive()) {
    if (!threadRunning && di && Esp.isActive()) {
        threadRunning = true;
        searchThread = new java.lang.Thread(new java.lang.Runnable({
            run: function () {
            if (Esp.isActive()) {
                blockIdValue = parseInt(blockId.getText());
                maxRadiusValue = parseInt(radius.getText());
                if (isNaN(blockIdValue) || isNaN(maxRadiusValue)) {
                    threadRunning = false; // Остановить поток, если входные данные неверны
                    return;
                }

                cacheKey = blockIdValue + maxRadiusValue + Math.round(LocalPlayer.getPositionX()) + Math.round(LocalPlayer.getPositionY()) + Math.round(LocalPlayer.getPositionZ());
                if (Render.cachedBlocks[cacheKey]) {
                    Render.blocksToRender = Render.cachedBlocks[cacheKey];
                } else {
                    Render.blocksToRender = [];
                    bedPositions = []; // Очистить позиции перед поиском
                    currentRadius = 10; // Начальный радиус

                    while (threadRunning && currentRadius <= maxRadiusValue) {
                    if (Esp.isActive()) {
                        var playerX = LocalPlayer.getPositionX();
                        var playerY = LocalPlayer.getPositionY();
                        var playerZ = LocalPlayer.getPositionZ();

                        var minX = Math.floor(playerX - currentRadius);
                        var maxX = Math.floor(playerX + currentRadius);
                        var minY = Math.floor(playerY - currentRadius);
                        var maxY = Math.floor(playerY + currentRadius);
                        var minZ = Math.floor(playerZ - currentRadius);
                        var maxZ = Math.floor(playerZ + currentRadius);

                        for (var x = minX; x <= maxX; x++) {
                            for (var y = minY; y <= maxY; y++) {
                                for (var z = minZ; z <= maxZ; z++) {
                                    let currentBlockId = Block.getID(x, y, z);

                                    // Проверяем, соответствует ли блок указанному blockIdValue
                                    if (currentBlockId === blockIdValue) {
                                        let alreadyExists = bedPositions.some(pos => pos[0] === x && pos[1] === y && pos[2] === z);
                                        if (!alreadyExists) {
                                            Render.blocksToRender.push({x: x, y: y + 1, z: z});
                                            bedPositions.push([x, y, z]); // Сохранить позицию блока
                                        }
                                    }
                                }
                            }
                        }
if (Esp.isActive()) {
                        // Фильтруем bedPositions и удаляем позиции с блоками, которые не соответствуют blockIdValue
                        bedPositions = bedPositions.filter(pos => {
                            let blockId = Block.getID(pos[0], pos[1], pos[2]);
                            if (blockId === blockIdValue) {
                                return true; // Блок соответствует, оставляем в массиве
                            } else {
                                // Блок не соответствует, удаляем из массива
                                Level.displayClientMessage("Блок сломан: " + pos[0] + " " + pos[1] + " " + pos[2]);
                                return false;
                            }
                        });
}
if (Esp.isActive()) {
                        // Обновляем Render.blocksToRender на основе отфильтрованных bedPositions
                        Render.blocksToRender = bedPositions.map(pos => ({x: pos[0], y: pos[1] + 1, z: pos[2]}));

                        // Выводим информацию о текущих блоках
                        if (Render.blocksToRender.length > 0) {
                            let positionsText = Render.blocksToRender.map(pos => pos.x + " " + pos.y + " " + pos.z).join(" | ");
                            Level.displayClientMessage(positionsText);
                        }

                        // Увеличиваем радиус сканирования
                        currentRadius += 10;
                        
                        if (currentRadius > maxRadiusValue) {
                        currentRadius = 10;
                        }
                        }
                        java.lang.Thread.sleep(100); // Задержка, чтобы не перегружать процессор
                    }
                  }
                }
              }
            }
        }));
        searchThread.start();
        Render.cachedBlocks[cacheKey] = Render.blocksToRender;
    }
  }
},

    drawBox: function(gl, x, y, z) {
        let blockSize = 1.0;
        var time = Date.now() * 0.001;
        var red = Math.sin(time * 0.5) * 0.5 + 0.5;
        var green = Math.sin(time * 0.8 + Math.PI * 2 / 3) * 0.5 + 0.5;
        var blue = Math.sin(time * 1.3 + Math.PI * 4 / 3) * 0.5 + 0.5;

        let vertices = [
            x, y, z,
            x + blockSize, y, z,
            x + blockSize, y, z + blockSize,
            x, y, z + blockSize,
            x, y + blockSize, z,
            x + blockSize, y + blockSize, z,
            x + blockSize, y + blockSize, z + blockSize,
            x, y + blockSize, z + blockSize
        ];

        let vertexBuffer = Render.getFloatBuffer(vertices);

        let indices = [
            0, 1, 1, 2, 2, 3, 3, 0,
            4, 5, 5, 6, 6, 7, 7, 4,
            0, 4, 1, 5, 2, 6, 3, 7
        ];

        let indexBuffer = Render.getShortBuffer(indices);

        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glLineWidth(2);  // Увеличил толщину линии для лучшей видимости
        gl.glColor4f(red, green, blue, 0.8);  // Сделал линии немного прозрачнее
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawElements(GL10.GL_LINES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glDisable(GL10.GL_BLEND);
        gl.glDepthMask(true);
    }
}

Esp.setOnToggleListener(function() { 
    if (!LocalPlayer.isInGame()) { 
        print("You need to be in a game or on a server to use this!"); 
        return; 
    }
    if (!Render.initted) { Render.init(); }
});

function onFastTick() {
    if (Esp.isActive() && LocalPlayer.isInGame() && Render.initted) {
        Render.updateBlocksToRender();
        Render.glSurface.requestRender();
    }
}

function onLevelTick() {
    if (!Esp.isActive()) {
        if (threadRunning) {
            di = false;
        }
        currentRadius = 0 + 10;
        Render.cachedBlocks = {};
    } else { 
    di = true;
    }
}

function onScriptEnabled() { 
    ModuleManager.addModule(Esp);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(Esp); 
    Render.cachedBlocks = {};  // Очищаем кеш при отключении скрипта
}