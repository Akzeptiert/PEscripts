let disabledModules = [];
let onGroundSpoofed = false;
let lastYaw = 0;
let lastPitch = 0;
let lastPosition = null;
let ticksSinceLastPacket = 0;

const DisablerModule = new Module("Disabler", true, false, ModuleCategory.MISC);

DisablerModule.setOnToggleListener((view, active) => {
    if (active) {
        ModuleManager.getModuleNames().forEach(moduleName => {
            try {
                const category = Module.getCategory(moduleName);
                if ((category === ModuleCategory.MOVEMENT || category === ModuleCategory.COMBAT) && Module.isActive(moduleName) && moduleName !== "Disabler") {
                    Module.setActive(moduleName, false);
                    disabledModules.push(moduleName);
                }
            } catch (error) {}
        });

        onGroundSpoofed = true;
        LocalPlayer.setOnGround(true);
        lastYaw = LocalPlayer.getYaw();
        lastPitch = LocalPlayer.getPitch();
        LocalPlayer.setVelocity(0, 0, 0);
    } else {
        disabledModules.forEach(moduleName => {
            try {
                Module.setActive(moduleName, true);
            } catch (error) {}
        });
        disabledModules = [];
        onGroundSpoofed = false;
        LocalPlayer.setOnGround(false);
    }
});

function onLevelTick() {
    if (DisablerModule.isActive() && onGroundSpoofed) {
        let yawRandomness = (Math.random() - 0.5) * 2;
        let pitchRandomness = (Math.random() - 0.5) * 2;
        LocalPlayer.setRot(lastYaw + yawRandomness * 0.1, lastPitch + pitchRandomness * 0.05);
        lastYaw += yawRandomness * 0.01;
        lastPitch += pitchRandomness * 0.005;

        ticksSinceLastPacket++;

        if (ticksSinceLastPacket >= 1) {
            let currentPosition = [LocalPlayer.getPositionX(), LocalPlayer.getPositionY(), LocalPlayer.getPositionZ()];

            if (lastPosition === null || currentPosition[0] !== lastPosition[0] || currentPosition[1] !== lastPosition[1] || currentPosition[2] !== lastPosition[2]) {
                try {
                    let packet = new Packet(PacketType.PLAYER_POSITION_AND_LOOK, null);
                    packet.writeDouble(currentPosition[0]);
                    packet.writeDouble(currentPosition[1]);
                    packet.writeDouble(currentPosition[2]);
                    packet.writeFloat(LocalPlayer.getYaw());
                    packet.writeFloat(LocalPlayer.getPitch());
                    packet.writeBoolean(onGroundSpoofed);
                    Packet.sendPacket(packet);
                } catch (error) {
                    try {
                        let packet = new Packet(PacketType.MOVE_PLAYER_PACKET, null);
                        packet.writeDouble(currentPosition[0]);
                        packet.writeDouble(currentPosition[1]);
                        packet.writeDouble(currentPosition[2]);
                        packet.writeFloat(LocalPlayer.getYaw());
                        packet.writeFloat(LocalPlayer.getPitch());
                        packet.writeBoolean(onGroundSpoofed);
                        Packet.sendPacket(packet);
                    } catch (error) {
                        print("Ошибка отправки пакета: " + error);
                    }
                }

                lastPosition = currentPosition;
                ticksSinceLastPacket = 0;
            }
        }
    }
}

ModuleManager.addModule(DisablerModule);