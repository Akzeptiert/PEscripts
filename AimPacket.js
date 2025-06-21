var module = new Module("AimPacket", true, true, ModuleCategory.COMBAT);

var targetPlayerID = -1;

function onSendPacket(a, b) {
    if (Module.isActive("AimPacket")) {
        let target = targetPlayerID;
        if (target == -1 || isFriend(target)) { return; }

        let enemyX = Player.getPositionX(target);
        let enemyY = Player.getPositionY(target);
        let enemyZ = Player.getPositionZ(target);

        let eyeX = LocalPlayer.getPositionX();
        let eyeY = LocalPlayer.getPositionY() + 1;
        let eyeZ = LocalPlayer.getPositionZ();

        let targetX = enemyX;
        let targetY = enemyY + 1.0;
        let targetZ = enemyZ;

        let deltaX = targetX - eyeX;
        let deltaY = targetY - eyeY;
        let deltaZ = targetZ - eyeZ;

        let horizontalDistance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

        let newYaw = Math.atan2(-deltaX, deltaZ) * (180 / Math.PI);
        let newPitch = -Math.atan2(deltaY, horizontalDistance) * (180 / Math.PI);

        if (Player.isAlive(target)) {
        
        if (a == PacketType.MOVE_PLAYER_PACKET) {
            Memory.setFloat(b, 40, newYaw);
            Memory.setFloat(b, 36, newPitch);
        }
      }
    }
}

function onAttack(player) {
    targetPlayerID = player;
}



function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}