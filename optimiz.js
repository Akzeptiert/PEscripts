const module = new Module("Flyy", true, true, ModuleCategory.MISC);
const speed = new SliderSetting("Speed", [20, 0, 500, 10]);
var flag = new StateSetting("Flag detect", false);
module.addSettings([speed, flag]);

let kak = false;
let time = 0;
let am = false;

function onLevelTick() {
    if (Module.isActive("Flyy")) {
    kak = true;
    if (LocalPlayer.isOnGround()) {
    LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
		LocalPlayer.addEffect(8, 3, 3, true);
		LocalPlayer.setVelocityY(0);
	
	if (kak) {
	time++;
	
if (time < speed.getCurrentValue()) { return; } 
	am = true;
LocalPlayer.setPositionRelativeY(2);
    time = 0;
    am = false;
   }
  }
  if (!module.isActive()) {
 kak = false;
 }
}

/*function onTeleport(player, x, y, z) {
    if (Module.isActive("Fly") && flag.isActive) {
    
    kak = false;
    
    am = false;
    
if (player == LocalPlayer.getUniqueID())

    Level.displayClientMessage("§l§6Var§fiable > §rFly > disabled due to flag.");
    
    LocalPlayer.setOnGround(false);

}
}
*/

function onSendPacket(add, pac) {
if (module.isActive()) {
if (am) {
preventDeafult()
}
}
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}