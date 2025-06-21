const module = new Module("LavaBreaker", true, true, ModuleCategory.PLAYER); 
const radiusSetting = new SliderSetting("Radius", [10, 1, 10, 1]); 
const timerSetting = new SliderSetting("Timer", [10, 1, 100, 10]); 

let timer = 0; 

function onLevelTick() { 
    timer++; 
    if (!module.isActive() || timer < timerSetting.getCurrentValue()) { return; } 
    timer = 0; 

    xpos = Math.floor(LocalPlayer.getPositionX()); 
    ypos = Math.floor(LocalPlayer.getPositionY()); 
    zpos = Math.floor(LocalPlayer.getPositionZ()); 
    for (let nukerxpos = xpos - radiusSetting.getCurrentValue(); nukerxpos < xpos + radiusSetting.getCurrentValue(); nukerxpos++) { 
        for (let nukerypos = ypos - radiusSetting.getCurrentValue() -1; nukerypos < ypos; nukerypos++) { 
            for (let nukerzpos = zpos - radiusSetting.getCurrentValue(); nukerzpos < zpos + radiusSetting.getCurrentValue(); nukerzpos++) { 
                if ([10, 11].includes(Block.getID(nukerxpos, nukerypos, nukerzpos))) { 
                    LocalPlayer.buildBlock(nukerxpos, nukerypos, nukerzpos, BlockSide.UP); 
                } 
    } } } 
} 

function onScriptEnabled() { 
    module.addSettings([radiusSetting, timerSetting]); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 