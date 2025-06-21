function onSendPacket(a, b) {
if (Module.isActive("Scaffold") || Module.isActive("BedFucker")) {
        if (a == PacketType.USE_ITEM_PACKET) {
            let deltaX = Math.random() * (0.7 - 0.3) + 0.3;
            let deltaY = Math.random() * (0.7 - 0.3) + 0.3;

            deltaX = Math.max(0.3, Math.min(deltaX, 0.7));
            deltaY = Math.max(0.3, Math.min(deltaY, 0.7));

            Memory.setFloat(b, 40, deltaX);
            Memory.setFloat(b, 44, 1.0);
            Memory.setFloat(b, 48, deltaY);
            
        if (u === 0 || uuu === 0) {
            Memory.setFloat(b, 40, 0.49);
            Memory.setFloat(b, 44, 1.0);
            Memory.setFloat(b, 48, 0.35);
        }
            
        let u = Memory.getFloat(b + 40);
        let uu = Memory.getFloat(b + 44);
        let uuu = Memory.getFloat(b + 48);
        
        Level.displayClientMessage("ok");
        }
    }
}