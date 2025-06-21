const module = new Module("LOGPACKET", true, true, ModuleCategory.OTHER);
const mode = new ModeSetting("Mode", ["all"]);
var slider = new SliderSetting("Speed", [1000, 0, 10000, 1]);
var lastPrint = 0;
module.addSettings([slider, mode]);

function onSendPacket(name, address) {
  if (Module.isActive("LOGPACKET")) {
  let int = Memory.getInt(address, 4);
  let float = Memory.getFloat(address, 4);
  let boleah = Memory.getBoolean(address, 4);
        switch (mode.getCurrentMode()) {
            case "all":
              var o = "\n";

  var currentTime = new Date().getTime();

  if(currentTime >= lastPrint + slider.getCurrentValue()) {

    lastPrint = currentTime;
    
   if(name == "InteractPacket") {
    return true;
  }
     if(name == "MovePlayerPacket") {
    return true;
  }
  if (name == "PlayerActionPacket") {
  preventDefault();
  }
  if (name == "MobEquipmentPacket") {
  preventDefault();
  }
  
  if (name == "ContainerSetSlotPacket") {
  preventDefault();
  }
  
  Level.displayClientMessage(name + " " + address);
  }
     break;
  }
}
}

function onScriptEnabled() {
  ModuleManager.addModule(module);
}

function onScriptDisabled() {
  ModuleManager.removeModule(module);
}