module = new Module("BlockFinder", true, true, ModuleCategory.MISC);
var blockId = new TextFieldSetting("Block ID", "Enter block ID", "");
var radius = new SliderSetting("Search radius", [2, 1, 10, 1]);
var interval = new SliderSetting("Search interval", [100, 10, 1000, 10]);
var inspector = new StateSetting("Inspector", false);

module.addSettings([blockId, radius, interval, inspector]);

var foundChests = {};  

function findChests() {

  var x = LocalPlayer.getPositionX();
  var y = LocalPlayer.getPositionY();
  var z = LocalPlayer.getPositionZ();

  var id = parseInt(blockId.getText());
   
  for(var i = -radius.getCurrentValue(); i <= radius.getCurrentValue(); i++) {
    for(var j = -radius.getCurrentValue(); j <= radius.getCurrentValue(); j++) {
      for(var k = -radius.getCurrentValue(); k <= radius.getCurrentValue(); k++) {
        var _x = x + i;
        var _y = y + j;
        var _z = z + k;
         
        var key = _x + ":" + _y + ":" + _z;
        if(Block.getID(_x, _y, _z) == id && !foundChests[key]) {
          foundChests[key] = true;
          Level.displayClientMessage("§eБлок обнаружен! §ax: §2" + _x + " §ay: §2" + _y + " §az: §2" + _z);  
        }
      }
    }
  }

}

var timer = 0;

function onLevelTick() {
  if(!module.isActive()) return;
  
  timer++;
  if(timer >= interval.getCurrentValue()) {
    findChests();
    timer = 0;
  } 
}

function onUseItem(x, y, z, side, item, block) {
    if (!inspector.isActive()) { return; }
    Level.showTipMessage("Block: " + block);
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}