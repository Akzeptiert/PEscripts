const module = new Module("TouchClick", true, true, ModuleCategory.MISC); 

// такое решение обосновано сломанным хуком onUseItem()
function onSendPacket(type) { 
    if (type != PacketType.USE_ITEM_PACKET) { return; } 
    LocalPlayer.longClick(); 
} 

function onScriptEnabled() { ModuleManager.addModule(module); } 
function onScriptDisabled() { ModuleManager.removeModule(module); } 
