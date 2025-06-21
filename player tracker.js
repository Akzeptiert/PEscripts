var playerTrackerModule = new Module("Player Tracker", true, true, ModuleCategory.PLAYER);

function onLevelTick() {
  if (!playerTrackerModule.isActive()) return;

  let nearestPlayer = LocalPlayer.getNearestPlayer(Number.MAX_VALUE);

  if (nearestPlayer !== null && !Player.isLocalPlayer(nearestPlayer) && Player.isAlive(nearestPlayer)) {
    const playerPos = [LocalPlayer.getPositionX(), LocalPlayer.getPositionY(), LocalPlayer.getPositionZ()];
    const targetPos = [Player.getPositionX(nearestPlayer), Player.getPositionY(nearestPlayer), Player.getPositionZ(nearestPlayer)];
    
    const distanceToPlayer = Math.sqrt(
      Math.pow(targetPos[0] - playerPos[0], 2) +
      Math.pow(targetPos[1] - playerPos[1], 2) +
      Math.pow(targetPos[2] - playerPos[2], 2)
    );

    Level.showTipMessage("Расстояние до ближайшего игрока: " + distanceToPlayer.toFixed(2) + " блоков");
  } else {
    Level.showTipMessage("");
  }
}

function onScriptEnabled() {
  ModuleManager.addModule(playerTrackerModule);
}

function onScriptDisabled() {
  ModuleManager.removeModule(playerTrackerModule);
  Level.showTipMessage("");
}