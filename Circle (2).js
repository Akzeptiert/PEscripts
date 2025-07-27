const tracers = new Module("Circle", true, true, ModuleCategory.MISC);
const radius = new SliderSetting("Radius", [0.8, 0.1, 10, 0.1]);
const segments = new SliderSetting("Segments", [40, 1, 100, 1]);
const fadeSpeed = new SliderSetting("Fade Speed", [0.8, 0.1, 10, 0.1]);
const sirc = new SliderSetting("Circle Speed", [20, 1, 50, 1]);
const yy = new SliderSetting("Y", [1.5, 0.1, 2, 0.1]);
const witdh = new SliderSetting("Width", [100, 1, 100, 1]);
const animationSpeed = new SliderSetting("Animation Speed", [1, 1, 10, 0.1]);

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

let circles = [];
let circleCreated = false;
let timer = 0;

tracers.setOnToggleListener((view, a) => { timer = 0; });

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
                                circles.forEach(circle => {
                                    if (circle.radius < radius.getCurrentValue()) {
                                        circle.radius += animationSpeed.getCurrentValue() * 0.1;
                                    }
                                    Render.drawCircle(gl, circle.x, circle.y, circle.z, circle.radius, segments.getCurrentValue(), circle.alpha);
                                    circle.alpha -= fadeSpeed.getCurrentValue() * 0.01;
                                });

                                if (Module.isActive("Circle") || LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                                    if (!circleCreated) {
                                        let x = LocalPlayer.getPositionX();
                                        let y = LocalPlayer.getPositionY() - yy.getCurrentValue();
                                        let z = LocalPlayer.getPositionZ();

                                        let circle = {
                                            x: x,
                                            y: y,
                                            z: z,
                                            radius: 0,  // Начальный радиус
                                            alpha: 1,
                                        };

                                        timer++;
                                        if (timer < sirc.getCurrentValue()) { return; }
                                        circles.push(circle);
                                        timer = 0;
                                        circleCreated = true;
                                    }
                                }
                                if (!LocalPlayer.isOnGround()) {
                                    // Сброс флага при приземлении
                                    circleCreated = false;
                                }
                                circles = circles.filter(circle => circle.alpha > 0);
                            }
                        } catch (e) {
                            print(e + e.lineNumber);
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

    drawCircle: function(gl, x, y, z, radius, segments, alpha) {
        let angleStep = 2 * Math.PI / segments;
        let vertices = [];

        // Центр круга
        vertices.push(x, y, z);

        // Создаем вершины по окружности
        for (let i = 0; i < segments; i++) {
            let angle = angleStep * i;
            let x1 = x + radius * Math.cos(angle);
            let z1 = z + radius * Math.sin(angle);
            vertices.push(x1, y, z1);
        }

        // Преобразуем массив вершин в формат FloatBuffer
        let vertexBuffer = Render.getFloatBuffer(vertices);

        // Индексы для рисования треугольников
        let indices = [];
        for (let i = 1; i < segments; i++) {
            indices.push(0, i, i + 1);
        }
        // Закрытие круга
        indices.push(0, segments, 1);

        // Преобразуем индексы в ShortBuffer
        let indexBuffer = Render.getShortBuffer(indices);

        // Цвет контура (черный)
        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glColor4f(0, 0, 0, alpha); // Черный цвет для контура

        // Рисуем контур круга
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawElements(GL10.GL_TRIANGLES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);

        // Уменьшаем радиус для основного круга (чтобы контур не перекрывал круг)
        let innerRadius = radius - 0.1;  // Меньший радиус для круга

        // Рисуем основной круг с градиентом
        let startColor = [1, 0.08, 0.58, alpha]; // Цвет начала градиента (розовый)
        let endColor = [1, 0.89, 0.88, alpha];   // Цвет конца градиента (светло-розовый)

        let currentColor = [
            startColor[0] + (endColor[0] - startColor[0]) * 0.5, // Плавное изменение между цветами
            startColor[1] + (endColor[1] - startColor[1]) * 0.5,
            startColor[2] + (endColor[2] - startColor[2]) * 0.5,
            alpha
        ];

        gl.glColor4f(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

        // Рисуем круг как треугольники с уменьшенным радиусом
        let innerVertices = [];
        innerVertices.push(x, y, z);

        // Создаем вершины для уменьшенного круга
        for (let i = 0; i < segments; i++) {
            let angle = angleStep * i;
            let x1 = x + innerRadius * Math.cos(angle);
            let z1 = z + innerRadius * Math.sin(angle);
            innerVertices.push(x1, y, z1);
        }

        // Преобразуем массив вершин для внутреннего круга
        let innerVertexBuffer = Render.getFloatBuffer(innerVertices);

        // Рисуем основной круг с уменьшенным радиусом
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, innerVertexBuffer);
        gl.glDrawElements(GL10.GL_TRIANGLES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);

        gl.glDepthMask(true);
        gl.glDisable(GL10.GL_BLEND);
    }
}

tracers.setOnToggleListener(function() {
    if (!LocalPlayer.isInGame()) { print("Join world first!"); return; }
    if (!Render.initted) { Render.init(); }
});

function onFastTick() {
    if (tracers != null && tracers.isActive() && LocalPlayer.isInGame() && Render.initted) {
        Render.glSurface.requestRender();
    }
}

function onScriptEnabled() {
    tracers.addSettings([radius, segments, fadeSpeed, sirc, yy, animationSpeed, witdh]);
    ModuleManager.addModule(tracers);
}

function onScriptDisabled() {
    ModuleManager.removeModule(tracers);
}