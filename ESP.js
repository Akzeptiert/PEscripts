const ESPModule = new Module("ESP", true, false, ModuleCategory.PLAYER);

const espModeSetting = new ModeSetting("Mode", ["Box", "2D", "Skeleton", "Tracers"]);
const espBoxStyleSetting = new ModeSetting("Box Style", ["Normal", "Corners", "Sides"]);
const espRedSetting = new SliderSetting("Red", [255, 0, 255, 1]);
const espGreenSetting = new SliderSetting("Green", [0, 0, 255, 1]); 
const espBlueSetting = new SliderSetting("Blue", [0, 0, 255, 1]);
const espAlphaSetting = new SliderSetting("Alpha", [180, 0, 255, 1]);
const espWidthSetting = new SliderSetting("ESP Width", [2.5, 1, 5, 0.5]);
const espRGBSetting = new StateSetting("RGB", false);
const espRGBSpeedSetting = new SliderSetting("RGB Speed", [2, 1, 10, 1]);

ESPModule.addSettings([
    espModeSetting,
    espBoxStyleSetting,
    espRedSetting, 
    espGreenSetting, 
    espBlueSetting, 
    espAlphaSetting,
    espWidthSetting,
    espRGBSetting,
    espRGBSpeedSetting
]);

const ctx = getContext();
const GL10 = javax.microedition.khronos.opengles.GL10;
const GLU = android.opengl.GLU;

var players = [];
var checkTimer = 0;
var hue = 0;

var animations = {
    alpha: 0,
    scale: 0,
    players: {},
    
    update: function() {
        this.alpha += (1 - this.alpha) * 0.1;
        this.scale += (1 - this.scale) * 0.1;
        
        for(let id in this.players) {
            if(!Player.isInWorld(parseInt(id))) {
                delete this.players[id];
                continue;
            }
            this.players[id].alpha += (1 - this.players[id].alpha) * 0.1;
            this.players[id].scale += (1 - this.players[id].scale) * 0.1;
        }
    },
    
    getPlayerAnimation: function(playerID) {
        if(!this.players[playerID]) {
            this.players[playerID] = {
                alpha: 0,
                scale: 0
            };
        }
        return this.players[playerID];
    }
};

function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return [r, g, b];
}var Render = {
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
                GLU.gluPerspective(gl, Render.fov, width / height, .1, 100);
                gl.glMatrixMode(GL10.GL_MODELVIEW);
                gl.glLoadIdentity();
            },

            onDrawFrame: function(gl) {
                gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
                
                if (getScreenName() === "hud_screen" && ESPModule.isActive() && LocalPlayer.isInGame()) {
                    try {
                        let yaw = LocalPlayer.getYaw() % 360;
                        let pitch = LocalPlayer.getPitch() % 360;
                        let eyeX = LocalPlayer.getPositionX();
                        let eyeY = LocalPlayer.getPositionY() + 1.62;
                        let eyeZ = LocalPlayer.getPositionZ();
                        
                        let radYaw = yaw / 180 * Math.PI;
                        let radPitch = pitch / 180 * Math.PI;
                        
                        let lookX = Math.sin(-radYaw) * Math.cos(radPitch);
                        let lookY = Math.sin(-radPitch);
                        let lookZ = Math.cos(-radYaw) * Math.cos(radPitch);
                        
                        gl.glMatrixMode(GL10.GL_PROJECTION);
                        gl.glLoadIdentity();
                        GLU.gluPerspective(gl, Render.fov, ctx.getResources().getDisplayMetrics().widthPixels / ctx.getResources().getDisplayMetrics().heightPixels, .1, 100);
                        
                        gl.glMatrixMode(GL10.GL_MODELVIEW);
                        gl.glLoadIdentity();
                        GLU.gluLookAt(gl, eyeX, eyeY, eyeZ, eyeX + lookX, eyeY + lookY, eyeZ + lookZ, 0, 1, 0);

                        if (players.length > 0) {
                            for(let i = 0; i < players.length; i++) {
                                if(Player.isInWorld(players[i]) && !Player.isLocalPlayer(players[i])) {
                                    switch(espModeSetting.getCurrentMode()) {
                                        case "Box":
                                            Render.drawPlayerBox(gl, players[i]);
                                            break;
                                        case "2D":
                                            Render.draw2DESP(gl, players[i]);
                                            break;
                                        case "Skeleton":
                                            Render.drawSkeleton(gl, players[i]);
                                            break;
                                        case "Tracers":
                                            Render.drawTracers(gl, players[i]);
                                            break;
                                    }
                                }
                            }
                        }
                    } catch(e) {
                        print("RenderProblem: " + e);
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
    },drawPlayerBox: function(gl, playerID) {
        const hitbox = Player.getCollisionSize(playerID);
        const width = hitbox[0] / 2;
        const height = hitbox[1];
        
        const posX = Player.getPositionX(playerID);
        const posY = Player.getPositionY(playerID);
        const posZ = Player.getPositionZ(playerID);
        
        let vertices = [];
        
        switch(espBoxStyleSetting.getCurrentMode()) {
            case "Normal":
                vertices = [
                    posX - width, posY, posZ - width,
                    posX + width, posY, posZ - width,
                    posX + width, posY, posZ - width,
                    posX + width, posY, posZ + width,
                    posX + width, posY, posZ + width,
                    posX - width, posY, posZ + width,
                    posX - width, posY, posZ + width,
                    posX - width, posY, posZ - width,
                    
                    posX - width, posY + height, posZ - width,
                    posX + width, posY + height, posZ - width,
                    posX + width, posY + height, posZ - width,
                    posX + width, posY + height, posZ + width,
                    posX + width, posY + height, posZ + width,
                    posX - width, posY + height, posZ + width,
                    posX - width, posY + height, posZ + width,
                    posX - width, posY + height, posZ - width,
                    
                    posX - width, posY, posZ - width,
                    posX - width, posY + height, posZ - width,
                    posX + width, posY, posZ - width,
                    posX + width, posY + height, posZ - width,
                    posX + width, posY, posZ + width,
                    posX + width, posY + height, posZ + width,
                    posX - width, posY, posZ + width,
                    posX - width, posY + height, posZ + width
                ];
                break;
                
            case "Corners":
                const cornerSize = width * 0.5;
                vertices = [
                    posX - width, posY, posZ - width,
                    posX - width + cornerSize, posY, posZ - width,
                    posX + width - cornerSize, posY, posZ - width,
                    posX + width, posY, posZ - width,
                    
                    posX - width, posY, posZ + width,
                    posX - width + cornerSize, posY, posZ + width,
                    posX + width - cornerSize, posY, posZ + width,
                    posX + width, posY, posZ + width,
                    
                    posX - width, posY + height, posZ - width,
                    posX - width + cornerSize, posY + height, posZ - width,
                    posX + width - cornerSize, posY + height, posZ - width,
                    posX + width, posY + height, posZ - width,
                    
                    posX - width, posY + height, posZ + width,
                    posX - width + cornerSize, posY + height, posZ + width,
                    posX + width - cornerSize, posY + height, posZ + width,
                    posX + width, posY + height, posZ + width,
                    
                    posX - width, posY, posZ - width,
                    posX - width, posY + cornerSize, posZ - width,
                    posX - width, posY + height - cornerSize, posZ - width,
                    posX - width, posY + height, posZ - width,
                    
                    posX + width, posY, posZ - width,
                    posX + width, posY + cornerSize, posZ - width,
                    posX + width, posY + height - cornerSize, posZ - width,
                    posX + width, posY + height, posZ - width,
                    
                    posX - width, posY, posZ + width,
                    posX - width, posY + cornerSize, posZ + width,
                    posX - width, posY + height - cornerSize, posZ + width,
                    posX - width, posY + height, posZ + width,
                    
                    posX + width, posY, posZ + width,
                    posX + width, posY + cornerSize, posZ + width,
                    posX + width, posY + height - cornerSize, posZ + width,
                    posX + width, posY + height, posZ + width
                ];
                break;case "Sides":
                vertices = [
                    posX - width, posY, posZ - width,
                    posX - width, posY + height, posZ - width,
                    posX + width, posY, posZ - width,
                    posX + width, posY + height, posZ - width,
                    posX + width, posY, posZ + width,
                    posX + width, posY + height, posZ + width,
                    posX - width, posY, posZ + width,
                    posX - width, posY + height, posZ + width
                ];
                break;
        }

        let vertexBuffer = Render.getFloatBuffer(vertices);
        let color = espRGBSetting.isActive() ? 
            hsvToRgb(hue, 1, 1) : 
            [espRedSetting.getCurrentValue() / 255, espGreenSetting.getCurrentValue() / 255, espBlueSetting.getCurrentValue() / 255];

        gl.glEnable(GL10.GL_BLEND);
        gl.glDisable(GL10.GL_TEXTURE_2D);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glLineWidth(espWidthSetting.getCurrentValue());
        
        gl.glColor4f(
            color[0],
            color[1],
            color[2],
            espAlphaSetting.getCurrentValue() / 255
        );
        
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawArrays(GL10.GL_LINES, 0, vertices.length / 3);
        gl.glDisable(GL10.GL_BLEND);
        gl.glEnable(GL10.GL_TEXTURE_2D);
        gl.glDepthMask(true);
    },

    drawTracers: function(gl, playerID) {
        const eyeX = LocalPlayer.getPositionX();
        const eyeY = LocalPlayer.getPositionY() + 1.62;
        const eyeZ = LocalPlayer.getPositionZ();
        
        const targetX = Player.getPositionX(playerID);
        const targetY = Player.getPositionY(playerID) + Player.getCollisionSize(playerID)[1] / 2;
        const targetZ = Player.getPositionZ(playerID);
        
        let vertices = [
            eyeX, eyeY, eyeZ,
            targetX, targetY, targetZ
        ];

        let vertexBuffer = Render.getFloatBuffer(vertices);
        let color = espRGBSetting.isActive() ? 
            hsvToRgb(hue, 1, 1) : 
            [espRedSetting.getCurrentValue() / 255, espGreenSetting.getCurrentValue() / 255, espBlueSetting.getCurrentValue() / 255];

        gl.glEnable(GL10.GL_BLEND);
        gl.glDisable(GL10.GL_TEXTURE_2D);
        gl.glDepthMask(false);
        gl.glBlendFunc(GL10.GL_SRC_ALPHA, GL10.GL_ONE_MINUS_SRC_ALPHA);
        gl.glLineWidth(espWidthSetting.getCurrentValue());
        
        gl.glColor4f(
            color[0],
            color[1],
            color[2],
            espAlphaSetting.getCurrentValue() / 255
        );
        
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
        gl.glDrawArrays(GL10.GL_LINES, 0, 2);
        gl.glDisable(GL10.GL_BLEND);
        gl.glEnable(GL10.GL_TEXTURE_2D);
        gl.glDepthMask(true);
    }
};

function onLevelTick() {
    if(!ESPModule.isActive()) return;
    
    if(checkTimer > 0) {
        checkTimer--;
        return;
    }
    checkTimer = 10;
    
    players = Level.getAllPlayers();
}

function onFastTick() {
    if(ESPModule.isActive() && LocalPlayer.isInGame() && Render.initted) {
        if(espRGBSetting.isActive()) {
            hue = (hue + 0.001 * espRGBSpeedSetting.getCurrentValue()) % 1;
        }
        Render.glSurface.requestRender();
    }
}

ESPModule.setOnToggleListener(function() { 
    if(!LocalPlayer.isInGame() || getScreenName() !== "hud_screen") { 
        print("You need to be in game with HUD visible!"); 
        return; 
    }
    if(!Render.initted) { 
        Render.init(); 
    }
});

function onServerConnect() {
    players = [];
    checkTimer = 0;
    hue = 0;
}

function onServerDisconnect() {
    players = [];
    checkTimer = 0;
    hue = 0;
    if(ESPModule.isActive()) {
        ESPModule.setOnToggleListener()(null, false);
    }
}

function onScriptEnabled() { 
    ModuleManager.addModule(ESPModule);
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(ESPModule);
}