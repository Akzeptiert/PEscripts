const ChunkBorderModule = new Module("Chunk Border", true, false, ModuleCategory.MISC);

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
                        let eyeY = LocalPlayer.getPositionY() + 1.62;
                        let eyeZ = LocalPlayer.getPositionZ();
                        let dCenterX = Math.sin(yaw / 180 * Math.PI);
                        let dCenterZ = Math.cos(yaw / 180 * Math.PI);
                        let dCenterY = Math.sqrt(dCenterX * dCenterX + dCenterZ * dCenterZ) * Math.tan((pitch - 180) / 180 * Math.PI);
                        let centerX = eyeX - dCenterX;
                        let centerZ = eyeZ + dCenterZ;
                        let centerY = eyeY - dCenterY;
                        GLU.gluLookAt(gl, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0, 1, 0);

                        if (ChunkBorderModule.isActive() && LocalPlayer.isInGame()) {
                            Render.drawChunkBorders(gl);
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

    drawChunkBorders: function(gl) {
        const playerPos = [
            Math.floor(LocalPlayer.getPositionX()),
            Math.floor(LocalPlayer.getPositionY()),
            Math.floor(LocalPlayer.getPositionZ())
        ];

        const chunkX = Math.floor(playerPos[0] / 16) * 16;
        const chunkZ = Math.floor(playerPos[2] / 16) * 16;

        let groundLevel = Math.floor(playerPos[1]);
        let vertices = [
            chunkX, groundLevel, chunkZ,
            chunkX + 16, groundLevel, chunkZ,
            chunkX + 16, groundLevel, chunkZ + 16,
            chunkX, groundLevel, chunkZ + 16,
            chunkX, groundLevel, chunkZ
        ];

        let vertexBuffer = Render.getFloatBuffer(vertices);

        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glLineWidth(2);
        gl.glColor4f(1.0, 0.0, 0.0, 0.8);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawArrays(GL10.GL_LINE_STRIP, 0, vertices.length / 3);
        gl.glDisable(GL10.GL_BLEND);
        gl.glDepthMask(true);
    }
}

ChunkBorderModule.setOnToggleListener(function() { 
    if (!LocalPlayer.isInGame()) { 
        print("You need to be in a game or on a server to use this!"); 
        return; 
    }
    if (!Render.initted) { Render.init(); }
});

function onFastTick() {
    if (ChunkBorderModule.isActive() && LocalPlayer.isInGame() && Render.initted) {
        Render.glSurface.requestRender();
    }
}

function onScriptEnabled() { 
    ModuleManager.addModule(ChunkBorderModule);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(ChunkBorderModule); 
}