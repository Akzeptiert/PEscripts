let hh = false;

function onLevelTick() {
if (Module.isActive("FreeCam")) {
hh = true;
    } else {
hh = false;
    }
}

function onSendPacket(a, b) {
if (hh) {
        if (a == PacketType.MOVE_PLAYER_PACKET) {
        preventDefault();
        }
    }
}