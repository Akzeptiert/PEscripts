const Esp = new Module("Esp", true, true, ModuleCategory.MISC);

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

function normalizeAngle(angle) {
    return (angle % 360 + 360) % 360;
}

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
    renderThread: null,  // Поток для рендеринга
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

                GLU.gluPerspective(gl, Render.fov * Math.sqrt(Memory.getFloat(Memory.getLevelRenderer(), 0x1440)), ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 50);
                
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },
            onDrawFrame: function(gl) {
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();

                GLU.gluPerspective(gl, Render.fov * Math.sqrt(Memory.getFloat(Memory.getLevelRenderer(), 0x1440)), ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 50);
                
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();

                gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
                gl.glLoadIdentity();
                gl.glDisable(GL10.GL_LIGHTING);

                if (getScreenName().equals("hud_screen")) {
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

                        try {
                            if (Esp.isActive() && LocalPlayer.isInGame()) {
                                Level.getAllPlayers().forEach(function(id) {
                                    if (id != LocalPlayer.getUniqueID() && Render.isPlayerInView(gl, id)) {
                                    if (id !== null) {
                                        Render.drawESP(gl, parseFloat(Number(Player.getPositionX(id)).toFixed(1)), Math.round(Player.getPositionY(id) - 0.1), parseFloat(Number(Player.getPositionZ(id)).toFixed(1)));
                                        }
                                    }
                                });
                            }
                        } catch (e) {
                            print(e + e.lineNumber)
                        }
                    } catch (e) {
                        print("RenderProblem: " + e + e.lineNumber);
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

    drawESP: function(gl, x, y, z) {
        let playerWidth = 0.8;
        let playerHeight = 1.6;
        var time = Date.now() * 0.001;
        var red = Math.sin(time * 0.5) * 0.5 + 0.5;
        var green = Math.sin(time * 0.8 + Math.PI * 2 / 3) * 0.5 + 0.5;
        var blue = Math.sin(time * 1.3 + Math.PI * 4 / 3) * 0.5 + 0.5;

        let yOffset = -0.4;

        let vertices = [
            x - playerWidth / 2, y + yOffset, z - playerWidth / 2,
            x + playerWidth / 2, y + yOffset, z - playerWidth / 2,
            x + playerWidth / 2, y + yOffset, z + playerWidth / 2,
            x - playerWidth / 2, y + yOffset, z + playerWidth / 2,
            x - playerWidth / 2, y + playerHeight + yOffset, z - playerWidth / 2,
            x + playerWidth / 2, y + playerHeight + yOffset, z - playerWidth / 2,
            x + playerWidth / 2, y + playerHeight + yOffset, z + playerWidth / 2,
            x - playerWidth / 2, y + playerHeight + yOffset, z + playerWidth / 2
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
        gl.glLineWidth(2);
        gl.glColor4f(red, green, blue, 1.0);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawElements(GL10.GL_LINES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glDisable(GL10.GL_BLEND);
        gl.glDepthMask(true);
    },

    isPlayerInView: function(gl, id) {
        let playerX = Player.getPositionX(id);
        let playerY = Player.getPositionY(id) + 1;  // центр головы игрока
        let playerZ = Player.getPositionZ(id);

        let eyeX = LocalPlayer.getPositionX();
        let eyeY = LocalPlayer.getPositionY() + 1;  // центр головы игрока
        let eyeZ = LocalPlayer.getPositionZ();

        // Получаем текущие yaw и pitch
        let yaw = LocalPlayer.getYaw() % 360;
        let pitch = LocalPlayer.getPitch() % 360;

        // Получаем позиции врага
        let enemyX = Player.getPositionX(id); 
        let enemyY = Player.getPositionY(id);
        let enemyZ = Player.getPositionZ(id);

        // Рассчитываем относительные координаты цели от позиции игрока
        let deltaX = enemyX - LocalPlayer.getPositionX();
        let deltaY = (enemyY + 1.0) - (LocalPlayer.getPositionY() + 1); 
        let deltaZ = enemyZ - LocalPlayer.getPositionZ();

        let horizontalDistance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

        // Вычисляем необходимые yaw и pitch для прицеливания на врага
        let targetYaw = Math.atan2(-deltaX, deltaZ) * (180 / Math.PI);
        let targetPitch = -Math.atan2(deltaY, horizontalDistance) * (180 / Math.PI);

        // Нормализуем текущие и целевые углы
        let normalizedCurrentYaw = normalizeAngle(yaw);
        let normalizedCurrentPitch = normalizeAngle(pitch);
        let normalizedTargetYaw = normalizeAngle(targetYaw);
        let normalizedTargetPitch = normalizeAngle(targetPitch);

        // Проверяем разницу углов yaw и pitch
        let yawDifference = Math.abs(normalizedTargetYaw - normalizedCurrentYaw);
        let pitchDifference = Math.abs(normalizedTargetPitch - normalizedCurrentPitch);

        // Учитываем возможность перехода через 0 градусов для yaw
        if (yawDifference > 180) {
            yawDifference = 360 - yawDifference;
        }

        // Учитываем возможность перехода через 0 градусов для pitch
        if (pitchDifference > 180) {
            pitchDifference = 360 - pitchDifference;
        }

        // Проверка, попадает ли игрок в диапазон углов +/- 180 градусов по yaw и +/- 90 по pitch
        if (yawDifference <= 110 && pitchDifference <= 110) {
        return id;
        }
    },

    startRendering: function() {
        if (Render.renderThread == null) {
            Render.renderThread = new java.lang.Thread(new java.lang.Runnable({
                run: function() {
                    while (Esp.isActive()) {
                        try {
                            if (LocalPlayer.isInGame() && Render.initted) {
                                Render.glSurface.requestRender();
                            }
                        } catch (e) {
                            print("Render thread error: " + e);
                        }
                        java.lang.Thread.sleep(16); // Ожидание ~60 FPS
                    }
                    Render.stopRendering(); // Остановка рендеринга при отключении модуля
                }
            }));
            Render.renderThread.start();
        }
    },

    stopRendering: function() {
        if (Render.renderThread != null) {
            Render.renderThread.interrupt();
            Render.renderThread = null;

            // Удалим GLSurfaceView с экрана, чтобы ESP исчез
            ctx.runOnUiThread(() => {
                if (Render.glSurface != null) {
                    ctx.getWindow().getDecorView().removeView(Render.glSurface);
                    Render.glSurface = null;
                    Render.initted = false;
                }
            });
        }
    }
};

// Вызов функции проверки видимости и отключения ESP при выключении модуля
function onLevelTick() {
    if (!Esp.isActive() && LocalPlayer.isInGame()) {
        Render.stopRendering(); // Остановка рендеринга при выключении модуля
    }
    
    if (Render.intted && Esp.isActive() && !LocalPlayer.isInGame()) {
    pop()
    }
}

function pop() {
if (Render.initted) {
                    try {
               if (Render.renderThread != null) {
            Render.renderThread.interrupt();
            Render.renderThread = null;

            // Удалим GLSurfaceView с экрана, чтобы ESP исчез
            ctx.runOnUiThread(() => {
                if (Render.glSurface != null) {
                    ctx.getWindow().getDecorView().removeView(Render.glSurface);
                    Render.glSurface = null;
                    Render.initted = false;
                }
            });
        }
    } catch (e) {
    print("RenderProblem: " + e + e.lineNumber);
    }
  }
}

function onFastTick() {
    if (Esp != null && Esp.isActive() && LocalPlayer.isInGame() && Render.initted) {
                    if (getScreenName().equals("hud_screen")) {
        Render.glSurface.requestRender();
        }
    }
}

// Запуск рендеринга при активации модуля
Esp.setOnToggleListener(function() {
    if (!LocalPlayer.isInGame()) { print("Join world first!"); return; }
    if (!Render.initted) { Render.init(); }
});

function onScriptEnabled() { 
    ModuleManager.addModule(Esp);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(Esp); 
}
