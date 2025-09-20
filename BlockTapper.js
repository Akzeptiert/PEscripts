// Автор говна: t.me/NotZapret
var blockTapperModule = new Module("Block Tapper", true, true, ModuleCategory.MISC);
const tapsPerSecond = new SliderSetting("Тапы в секунду", [1.0, 0.5, 50.0, 0.5]);
const radius = new SliderSetting("Радиус (блоки)", [2.0, 1.0, 10.0, 1.0]);
let timer = 0;
function onLevelTick() {
  if (!blockTapperModule.isActive() || !LocalPlayer.isInGame()) {
    return;
  }
  const speed = tapsPerSecond.getCurrentValue();
  const tickInterval = 1 / speed;
  timer += 1 / 20;
  if (timer >= tickInterval) {
    timer = 0;
    const playerX = LocalPlayer.getPositionX(); 
    const playerY = LocalPlayer.getPositionY(); 
    const playerZ = LocalPlayer.getPositionZ(); 
    const rad = radius.getCurrentValue();
    const minX = Math.floor(playerX - rad);
    const maxX = Math.ceil(playerX + rad);
    const minY = Math.floor(playerY - rad);
    const maxY = Math.ceil(playerY + rad);
    const minZ = Math.floor(playerZ - rad);
    const maxZ = Math.ceil(playerZ + rad);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const randomSide = Math.floor(Math.random() * 6);
          const sides = [
            BlockSide.DOWN,
            BlockSide.UP,
            BlockSide.NORTH,
            BlockSide.SOUTH,
            BlockSide.WEST,
            BlockSide.EAST
          ];
          LocalPlayer.buildBlock(x, y, z, sides[randomSide]); // Автор: notzapret
        }
      }
    }
  }
}
function onScriptEnabled() {
  blockTapperModule.addSettings([tapsPerSecond, radius]);
  ModuleManager.addModule(blockTapperModule);
}
function onScriptDisabled() {
  ModuleManager.removeModule(blockTapperModule);
}