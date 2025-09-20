const module = new Module("Derp", true, true, ModuleCategory.MISC);
const speed = new SliderSetting("Speed", [0,0,50,1]);
let timer = LocalPlayer.getPitch();
let x = LocalPlayer.getYaw();
module.addSettings([speed]);
function onLevelTick() {
  if (!module.isActive("Derp")) {return;}
  timer += speed.getCurrentValue();
  if (timer >= 1) {
    LocalPlayer.setRot(timer, x);
  }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}