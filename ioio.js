let rer;

function onLevelTick() {
rer = LocalPlayer.getNameTag();
}

function onSendPacket(t, a){
    if (t === PacketType.TEXT_PACKET && Memory.getString(a, 16) !== rer) {
        Memory.setString(a, 16, rer)
    }
}