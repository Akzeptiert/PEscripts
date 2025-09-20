/* 
    author : Squate Dev 
    version : 0.1
*/


const Esp = new Module("HeadCircle", true, true, ModuleCategory.COMBAT);
const circumference = new SliderSetting("Circumference", [0.7, 0.2, 1.3, 0.1]);
const radiuss = new SliderSetting("Radius", [7, 1, 30, 1]);
const indent = new SliderSetting("Indent", [0.4, 0.1, 0.8, 0.1]);
const speed = new SliderSetting("Speed", [1.2, 1, 7, 1.0]);
const Ys = new SliderSetting("Indent-Y", [1.2, 0.7, 2.5, 0.1]);
const squaty = new SliderSetting("squat-Y", [1.2, 0.7, 2.5, 0.1]);


Esp.addSettings([circumference, radiuss, indent, speed, Ys, squaty]);

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
                gl.glClearColor(0, 0, 0, 0);
                gl.glEnable(GL10.GL_DEPTH_TEST);
            },

            onSurfaceChanged: function(gl, width, height) {
                gl.glMatrixMode(GL10.GL_PROJECTION);
                gl.glLoadIdentity();
                GLU.gluPerspective(gl, Render.fov, width / height, .1, 50);
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },

            onDrawFrame: function(gl) {
                gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
                gl.glLoadIdentity();
                
                if (Esp.isActive() && LocalPlayer.isInGame()) {
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
            
                    var payhs = LocalPlayer.getNearestPlayer(radiuss.getCurrentValue());
                    var check = Player.isSneaking(payhs);
                    if (payhs) { // Проверяем на null
                        var ne_x = Player.getPositionX(payhs);
                        var ne_y = Player.getPositionY(payhs);
                        var ne_z = Player.getPositionZ(payhs);
                         
                        GLU.gluLookAt(gl, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0, 1, 0);
                        var speeds = speed.getCurrentValue() / 1000;
                        var times = Date.now() * speeds;
                        if (check == false) {
                            Render.drawCircle(gl, ne_x, ne_y + Ys.getCurrentValue(), ne_z, times);
                        } else {
                            Render.drawCircle(gl, ne_x, ne_y + squaty.getCurrentValue(), ne_z, times);
                        }
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

    drawCircle: function(gl, x, y, z, time) {
        let radius = circumference.getCurrentValue(); // Радиус круга
        let height = 0; // Высота цилиндра
        let numSegments = 10; // Количество сегментов для круга
        let vertices = [];
        let colors = [];

        // Добавляем вершину центра
        vertices.push(x, y + indent.getCurrentValue(), z); // Центр будет немного выше
        colors.push(1, 1, 1, 1); // Центр будет белым

        // Вершины круга и цвета
        for (let i = 0; i <= numSegments; i++) {
            let angle = (i / numSegments) * 2.0 * Math.PI;
            let xOffset = Math.cos(angle) * radius;
            let zOffset = Math.sin(angle) * radius;

            // Плавное изменение цвета
            let r = (Math.sin(angle + time) * 0.5 + 0.5).toFixed(2);
            let g = (Math.sin(angle + (2 * Math.PI / 3) + time) * 0.5 + 0.5).toFixed(2);
            let b = (Math.sin(angle + (4 * Math.PI / 3) + time) * 0.5 + 0.5).toFixed(2);

            // Добавляем вершины для низа цилиндра
            vertices.push(x + xOffset, y, z + zOffset);
            colors.push(parseFloat(r), parseFloat(g), parseFloat(b), 1);

            // Добавляем вершины для верха цилиндра
            vertices.push(x + xOffset, y + height, z + zOffset);
            colors.push(parseFloat(r), parseFloat(g), parseFloat(b), 1);
        }

        // Оставшаяся часть кода остается без изменений

        let vertexBuffer = Render.getFloatBuffer(vertices);
        let colorBuffer = Render.getFloatBuffer(colors);

        // Индексы для отрисовки цилиндра
        let indices = [];
        for (let i = 1; i <= numSegments; i++) {
            indices.push(0, i * 2, (i * 2) % (numSegments * 2) + 2); // Нижняя часть
            indices.push(i * 2 - 1, (i * 2 - 1) % (numSegments * 2) + 1, (i * 2) % (numSegments * 2) + 1); // Верхняя часть
        }

        let indexBuffer = Render.getShortBuffer(indices);

        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);

        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        
        gl.glEnableClientState(GL10.GL_COLOR_ARRAY); // Включаем массив цветов
        gl.glColorPointer(4, GL10.GL_FLOAT, 0, colorBuffer); // Указываем массив цветов

        gl.glDrawElements(GL10.GL_TRIANGLES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        
        gl.glDisableClientState(GL10.GL_COLOR_ARRAY); // Отключаем массив цветов
        gl.glDisable(GL10.GL_BLEND);
        gl.glDepthMask(true);
    }
};

Esp.setOnToggleListener(function() { 
    if (!LocalPlayer.isInGame()) { 
        print("You need to be in a game or on a server to use this!"); 
        return; 
    }
    if (!Render.initted) { Render.init(); }
});

function onFastTick() {
    if (Esp.isActive() && LocalPlayer.isInGame() && Render.initted) {
        Render.glSurface.requestRender();
    }
}

function onScriptEnabled() { 
    ModuleManager.addModule(Esp);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(Esp); 
}