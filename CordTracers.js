const tracers = new Module("CordTracers", true, true, ModuleCategory.MISC);
const width = new SliderSetting("Width", [5, 0, 10, 0.1]);
const colorR = new SliderSetting("Color red", [255, 0, 255, 5]);
const colorG = new SliderSetting("Color green", [150, 0, 255, 5]);
const colorB = new SliderSetting("Color blue", [0, 0, 255, 5]);

var targetXCoord = 0;
var targetYCoord = 64;
var targetZCoord = 0;

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

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

                GLU.gluPerspective(gl, Render.fov * Math.sqrt(Memory.getFloat(Memory.getLevelRenderer(), 0x1440)), ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 100);
                
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },
            onDrawFrame: function(gl) {
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();

                GLU.gluPerspective(gl, Render.fov * Math.sqrt(Memory.getFloat(Memory.getLevelRenderer(), 0x1440)), ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 100);
                
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
                            if (tracers.isActive() && LocalPlayer.isInGame()) {
                                Render.drawLine(gl, LocalPlayer.getPositionX(), LocalPlayer.getPositionY(), LocalPlayer.getPositionZ(), 
                                    targetXCoord + 0.5, targetYCoord + 1 + 0.5, targetZCoord + 0.5);
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

    drawLine: function(gl, x, y, z, x2, y2, z2) {
        let vertices = [0, 0, 0, x2 - x, y2 - y, z2 - z];
        let vertexBuffer = Render.getFloatBuffer(vertices);
        let indices = [0, 1];
        let indexBuffer = Render.getShortBuffer(indices);

        gl.glTranslatef(x, y, z);
        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glLineWidth(width.getCurrentValue());
        gl.glColor4f(colorR.getCurrentValue() / 255, colorG.getCurrentValue() / 255, colorB.getCurrentValue() / 255, 1);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawElements(GL10.GL_LINES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glTranslatef(-x, -y, -z);
        gl.glDisable(GL10.GL_LINE_SMOOTH);
    }
}

tracers.setOnToggleListener(function() { 
    if (!LocalPlayer.isInGame()) { print("Join world first!"); return; }
    if (!Render.initted) { Render.init(); }
});

function onChat(text) {
    let parts = text.split(" ");
    if (parts[0] === ".cord") {
        if (parts.length === 4) {
            let x = parseFloat(parts[1]);
            let y = parseFloat(parts[2]);
            let z = parseFloat(parts[3]);

            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                targetXCoord = x;
                targetYCoord = y;
                targetZCoord = z;
                Level.displayClientMessage("§l§aКоординаты трассера установлены на: X=" + targetXCoord + ", Y=" + targetYCoord + ", Z=" + targetZCoord + " (центр блока)");
                preventDefault();
            } else {
                Level.displayClientMessage("§l§cНеверные значения координат. Используйте числа.");
                preventDefault();
            }
        } else {
            Level.displayClientMessage("§l§cИспользование: .cord <X> <Y> <Z>");
            preventDefault();
        }
    } else if (text === ".help") {
        Level.displayClientMessage("§l§fДля трассеров:");
        Level.displayClientMessage("§f.cord <X> <Y> <Z> §l§e- установить координаты трассера на центр блока.");
        Level.displayClientMessage("§fВключите модуль CordTracers для отображения.");
        preventDefault();
    }
}

function onFastTick() {
    if (tracers != null && tracers.isActive() && LocalPlayer.isInGame() && Render.initted) {
        Render.glSurface.requestRender();
    }
}

function onScriptEnabled() { 
    tracers.addSettings([width, colorR, colorG, colorB]);
    ModuleManager.addModule(tracers);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(tracers); 
}
