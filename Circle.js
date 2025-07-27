const tracers = new Module("Circle", true, true, ModuleCategory.MISC);
const radius = new SliderSetting("Radius", [0.8, 0.8, 10, 0.1]);
const segment = new ModeSetting("Segment", ["3", "4", "5", "6", "7", "8", "77"]);
const fadeSpeed = new SliderSetting("Fade Speed", [0.8, 0.8, 10, 0.1]);
const sirc = new SliderSetting("Circle Speed", [25, 1, 25, 1]);
const yy = new SliderSetting("Y", [2, 2, 10, 1]);
const witdh = new SliderSetting("Width", [100, 1, 100, 1]);
const animationSpeed = new SliderSetting("Animation Speed", [1, 1, 10, 1]);

const circleColorRed = new SliderSetting("Color Red", [148, 0, 255, 1]);
const circleColorGreen = new SliderSetting("Color Green", [0, 0, 255, 1]);
const circleColorBlue = new SliderSetting("Color Blue", [211, 0, 255, 1]);

const rainbowMode = new StateSetting("Rainbow Mode", false);
const rainbowSpeed = new SliderSetting("Rainbow Speed", [10, 1, 50, 1]);
const circleTransparency = new SliderSetting("Transparency", [100, 0, 100, 1]);

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

let circles = [];
let circleCreated = false;
let timer = 0;
let rainbowHue = 0;

let isGLSurfaceViewRendering = false;

tracers.setOnToggleListener((view, a) => {
    timer = 0;
    if (!tracers.isActive()) {
        circles = [];
        circleCreated = false;
        rainbowHue = 0;
        if (Render.glSurface) {
            ctx.runOnUiThread(() => {
                Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_WHEN_DIRTY);
            });
            isGLSurfaceViewRendering = false;
        }
    } else {
        if (Render.glSurface) {
            ctx.runOnUiThread(() => {
                Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_CONTINUOUSLY);
            });
            isGLSurfaceViewRendering = true;
        }
    }
});

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
                                if (rainbowMode.isActive()) {
                                    rainbowHue = (rainbowHue + rainbowSpeed.getCurrentValue() * 0.1) % 360;
                                }

                                circles.forEach(circle => {
                                    if (circle.radius < radius.getCurrentValue()) {
                                        circle.radius += animationSpeed.getCurrentValue() * 0.1;
                                    }
                                    Render.drawCircle(gl, circle.x, circle.y, circle.z, circle.radius, parseInt(segment.getCurrentMode()), circle.alpha);
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
                                            radius: 0,
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
            Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_WHEN_DIRTY);
            isGLSurfaceViewRendering = false;

            ctx.getWindow().getDecorView().addView(Render.glSurface);

            Render.initted = true;
        });
    },

    hslToRgb: function(h, s, l) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },

    drawCircle: function(gl, x, y, z, radius, segments, alpha) {
        let angleStep = 2 * Math.PI / segments;
        let vertices = [];

        vertices.push(x, y, z);

        for (let i = 0; i < segments; i++) {
            let angle = angleStep * i;
            let x1 = x + radius * Math.cos(angle);
            let z1 = z + radius * Math.sin(angle);
            vertices.push(x1, y, z1);
        }

        let vertexBuffer = Render.getFloatBuffer(vertices);

        let indices = [];
        for (let i = 1; i < segments; i++) {
            indices.push(0, i, i + 1);
        }
        indices.push(0, segments, 1);

        let indexBuffer = Render.getShortBuffer(indices);

        gl.glEnable(GL10.GL_BLEND);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        
        gl.glColor4f(0, 0, 0, alpha); 

        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawElements(GL10.GL_TRIANGLES, indices.length, GL10.GL_UNSIGNED_SHORT, indexBuffer);
        gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);

        let innerRadius = radius - 0.1;

        let finalRed, finalGreen, finalBlue;

        if (rainbowMode.isActive()) {
            let rgb = Render.hslToRgb(rainbowHue / 360, 1, 0.5);
            finalRed = rgb[0];
            finalGreen = rgb[1];
            finalBlue = rgb[2];
        } else {
            finalRed = circleColorRed.getCurrentValue();
            finalGreen = circleColorGreen.getCurrentValue();
            finalBlue = circleColorBlue.getCurrentValue();
        }

        let currentAlpha = alpha * (circleTransparency.getCurrentValue() / 100); 

        gl.glColor4f(finalRed / 255, finalGreen / 255, finalBlue / 255, currentAlpha);

        let innerVertices = [];
        innerVertices.push(x, y, z);

        for (let i = 0; i < segments; i++) {
            let angle = angleStep * i;
            let x1 = x + innerRadius * Math.cos(angle);
            let z1 = z + innerRadius * Math.sin(angle);
            innerVertices.push(x1, y, z1);
        }

        let innerVertexBuffer = Render.getFloatBuffer(innerVertices);

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
    if (tracers.isActive() && LocalPlayer.isInGame() && Render.initted) {
        if (!isGLSurfaceViewRendering) {
            ctx.runOnUiThread(() => {
                Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_CONTINUOUSLY);
            });
            isGLSurfaceViewRendering = true;
        }
    } else {
        if (isGLSurfaceViewRendering && Render.glSurface) {
            ctx.runOnUiThread(() => {
                Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_WHEN_DIRTY);
            });
            isGLSurfaceViewRendering = false;
        }
    }
}

function onScriptEnabled() {
    tracers.addSettings([radius, segment, fadeSpeed, sirc, yy, animationSpeed, witdh, circleColorRed, circleColorGreen, circleColorBlue, rainbowMode, rainbowSpeed, circleTransparency]);
    ModuleManager.addModule(tracers);
}

function onScriptDisabled() {
    ModuleManager.removeModule(tracers);
    circles = [];
    circleCreated = false;
    rainbowHue = 0;
    if (Render.glSurface) {
        ctx.runOnUiThread(() => {
            Render.glSurface.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_WHEN_DIRTY);
        });
        isGLSurfaceViewRendering = false;
    }
}
