//Made By ZDarkZ
var helper = new Module("ScaffoldHelper", true, true, ModuleCategory.MISC);
const fallspeed = new SliderSetting("FallSpeed", [0.3, 0, 1, 0.01]);
const rotation = new StateSetting("Rotation", true);
const stopsprint = new StateSetting("StopSprint", true);
const motioncamera = new StateSetting("MotionCamera", true);
helper.addSettings([fallspeed, rotation, stopsprint, motioncamera]);

let tick = 0
var Y = LocalPlayer.getPositionY();
var c = 0;

//Rotation
function onSendPacket(a, b){
    if (helper.isActive() && rotation.isActive() && Module.isActive("Scaffold") && a === PacketType.MOVE_PLAYER_PACKET) {
        c = Memory.getFloat(b, 44);
        Memory.setFloat(b, 36, 80);
        Memory.setFloat(b, 40, c - 180)
    }
}

function onLevelTick() {
    if (helper.isActive() && Module.isActive("Scaffold")){
        const x = LocalPlayer.getVelocityX();
        const z = LocalPlayer.getVelocityZ();
        const speed = Math.sqrt(x * x + z * z);
        //Auto Jump
        if (speed > 0.05 && LocalPlayer.isOnGround()){
        LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP))
        }
        if (LocalPlayer.isOnGround()){
        Y = LocalPlayer.getPositionY() + 1;
        tick = 0
        }
        //Keep Y
        if (tick == 1){
        LocalPlayer.setVelocityY(LocalPlayer.getVelocityY() - fallspeed.getCurrentValue())
        }
        if (stopsprint.isActive() && tick == 2){
        LocalPlayer.setSprinting(false);
        }
        if (!LocalPlayer.isOnGround()){
        tick++
        }
        //Motion Camera
        if (motioncamera.isActive() && tick < 10){
        LocalPlayer.setPositionY(Y);
        }
    }
    function onSendPacket(a, b){
    if (helper.isActive() && Module.isActive("Scaffold") && a === PacketType.MOVE_PLAYER_PACKET) {
        Memory.setFloat(b, 36, 120);}
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(helper);
}

function onScriptDisabled() {
    ModuleManager.removeModule(helper);
}