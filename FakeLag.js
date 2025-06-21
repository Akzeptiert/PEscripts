var fakeLagModule = new Module("FakeLag", true, true, ModuleCategory.MOVEMENT);

var packets = [];
var enabled = false;

function onScriptEnabled() {
    ModuleManager.addModule(fakeLagModule);
}

function onSendPacket(name, address) {
    if (fakeLagModule.isActive() && !fakeLagModule.isBindActive()) {
        if (name === PacketType.MOVE_PLAYER_PACKET) {
            packets.push([name, address]);
            preventDefault();
        }
    }
}

fakeLagModule.setOnToggleListener(function (view, active) {
    enabled = active;
    if (!active && packets.length > 0) {
        for (var i = 0; i < packets.length; i++) {

        }
        packets = [];
    }
});
