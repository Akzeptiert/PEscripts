const module = new Module("AimBlock", true, true, ModuleCategory.MISC); 
const settings = { 
    "blockPos": new TextFieldSetting("Block position", "123 456 789", ""), 
    "autoJump": new StateSetting("Auto jump", true), 
    "autoWalk": new StateSetting("Auto walk", true)
}; 

let blockPos = []; 
let jumpCooldown = 2; 

settings.blockPos.setOnTextChangedListener(function(text) { 
    blockPos = []; 
try{
    (text.split(" ").length == 3 && text.split(" ").forEach(function(elem) { blockPos.push(parseInt(elem)); }))
}catch(e){print(e);}
}); 

function onLevelTick() { 
    if (!module.isActive() || blockPos.length != 3) { return; } 
    jumpCooldown--; 
    if (settings.autoJump.isActive() && jumpCooldown < 0) { LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, true); if (jumpCooldown < -2) { LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, false); jumpCooldown = 2 }}  
    if (settings.autoWalk.isActive()) { LocalPlayer.setMoveButtonStatus(MoveButton.FORWARD, true); } 
    var x = blockPos[0] - LocalPlayer.getPositionX();
    var y = blockPos[1]+0.5 - LocalPlayer.getPositionY();
    var z = blockPos[2] - LocalPlayer.getPositionZ();
    var l = Math.sqrt(x * x + y * y + z * z);
    y = y / l;
    var pitch = -(Math.asin(y) * 180 / Math.PI);
    var yaw = -Math.atan2(blockPos[0] + .5 - (LocalPlayer.getPositionX() + 0), blockPos[2] + .5 - (LocalPlayer.getPositionZ() + 0)) * (180 / Math.PI);
    if (pitch < 89 && pitch > -89) {
        LocalPlayer.setRot(yaw, pitch);
    }
} 

function onScriptEnabled() { 
    module.addSettings([settings.blockPos, settings.autoJump, settings.autoWalk]); 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { ModuleManager.removeModule(module); } 