/* 
  author : SquateDev
  tg : https://t.me/SquateDev
  version : 0.0.1
*/

const behind = new Module("Behind", true, true, ModuleCategory.COMBAT);
const gap = new SliderSetting("Gap", [0.5, 0.2, 2.5, 0.1]);
const radius = new SliderSetting("Radius", [5, 1, 14, 1]);

behind.addSettings([gap, radius]);

var yaw, pitch, ids, x, y, z;

function onScriptEnabled() { 
ModuleManager.addModule(behind);
} 

function onScriptDisabled() { 
ModuleManager.removeModule(behind); 
}

function onFastTick() {
  if (behind.isActive()) {
    const ids = LocalPlayer.getNearestPlayer(radius.getCurrentValue());
    const yaw = Player.getYaw(ids) % 360 * Math.PI / 180;
    const pitch = Player.getPitch(ids) % 180 * Math.PI / 90;
    const x = Player.getPositionX(ids);
    const y = Player.getPositionY(ids);
    const z = Player.getPositionZ(ids);   
      LocalPlayer.setPosition((x + Math.sin(yaw) * gap.getCurrentValue()), y + Math.sin(pitch) * gap.getCurrentValue(), (z - Math.cos(yaw) * gap.getCurrentValue()));
    LocalPlayer.setVelocityY(0);
  }
}

