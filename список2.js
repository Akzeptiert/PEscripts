var module = new Module("ListNames", true, true, ModuleCategory.MISC);
var radius = new SliderSetting("Radius", [1, 0, 200, 1]);
var names = [];

module.addSettings([radius]);

function updateNames() {
  names = [];
  var ids = Level.getAllPlayers();
  for (var i = 0; i < ids.length; i++) {
    if (LocalPlayer.getDistanceTo(ids[i]) < radius.getCurrentValue()) {
      if (!Player.isLocalPlayer(ids[i])) {
        names.push(Player.getNameTag(ids[i]) + " (" + Math.round(LocalPlayer.getDistanceTo(ids[i])) + " блоков)");
      }
    }
  }

  var text = "Nearby: " + names.join(", ");

  Level.showTipMessage("§l" + text, 0, 0);
}

onLevelTick = () => { 
  updateNames();
}

updateNames();

function onScriptEnabled() {
  ModuleManager.addModule(module); 
}

function onScriptDisabled() {
  ModuleManager.removeModule(module);
}