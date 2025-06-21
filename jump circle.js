const jumpCircleModule = new Module("Jump Circle", true, true, ModuleCategory.MISC);

const circleRadius = new SliderSetting("Circle Radius", [1, 0.5, 5, 0.1]);
const particleCount = new SliderSetting("Particle Count", [30, 10, 100, 5]);
const enableRGB = new StateSetting("Enable RGB", false);
const redSetting = new SliderSetting("Red", [255, 0, 255, 1]);
const greenSetting = new SliderSetting("Green", [255, 0, 255, 1]);
const blueSetting = new SliderSetting("Blue", [255, 0, 255, 1]);

jumpCircleModule.addSettings([circleRadius, particleCount, enableRGB, redSetting, greenSetting, blueSetting]);

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

let wasJumping = false;

const Render = {
    renderer: null,
    glSurface: null,
    initted: false,

    init: function() {
        this.renderer = new android.opengl.GLSurfaceView.Renderer({
            onSurfaceCreated: function(gl, config) {
                gl.glEnable(GL10.GL_BLEND);
                gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
                gl.glShadeModel(GL10.GL_FLAT);
                gl.glClearColor(0, 0, 0, 0);
                gl.glEnable(GL10.GL_DEPTH_TEST);
                gl.glDepthFunc(GL10.GL_LEQUAL);
            },

            onSurfaceChanged: function(gl, width, height) {
                gl.glViewport(0, 0, width, height);
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();
                GLU.gluPerspective(gl, 110, width / height, 0.1, 50);
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },

            onDrawFrame: function(gl) {
                gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
                gl.glLoadIdentity();
                if (jumpCircleModule.isActive() && LocalPlayer.isInGame()) {
                    const playerPos = [LocalPlayer.getPositionX(), LocalPlayer.getPositionY(), LocalPlayer.getPositionZ()];
                    if (wasJumping) {
                        Render.drawCircle(gl, playerPos[0], playerPos[1], playerPos[2]);
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
            Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_WHEN_DIRTY);
            ctx.getWindow().getDecorView().addView(Render.glSurface);
            Render.initted = true;
        });
    },

    drawCircle: function(gl, centerX, centerY, centerZ) {
        const radius = circleRadius.getCurrentValue();
        const count = particleCount.getCurrentValue();
        const angleStep = (2 * Math.PI) / count;

        gl.glBegin(GL10.GL_LINE_LOOP);
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * radius;
            const z = centerZ + Math.sin(angle) * radius;

            let red = enableRGB.isActive() ? Math.random() : redSetting.getCurrentValue() / 255.0;
            let green = enableRGB.isActive() ? Math.random() : greenSetting.getCurrentValue() / 255.0;
            let blue = enableRGB.isActive() ? Math.random() : blueSetting.getCurrentValue() / 255.0;

            gl.glColor4f(red, green, blue, 1);
            gl.glVertex3f(x, centerY, z);
        }
        gl.glEnd();
    }
}

function onLevelTick() {
    if (LocalPlayer.isOnGround()) {
        wasJumping = false;
    } else {
        wasJumping = true;
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(jumpCircleModule);
    Render.init();
}

function onScriptDisabled() {
    ModuleManager.removeModule(jumpCircleModule);
}