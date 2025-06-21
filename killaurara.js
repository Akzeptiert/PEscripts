const module = new Module("Aura", true, true, ModuleCategory.COMBAT);
var r = new SliderSetting("Range", [4.0, 0, 8, 0.1]);
var cps = new SliderSetting("CPS", [10, 1, 20, 1]); // CPS 设置，每秒点击次数
var aa = new StateSetting("AimAssist", true);
var as = new SliderSetting("AimSpeed", [0.5, 0, 1, 0.01]);
module.addSettings([r, cps, aa, as]);
var target = 0;

var lastAttackTime = 0; // 上次攻击时间

function onLevelTick() {
	if (!module.isActive()) {
		return;
	}

	var currentTime = new Date().getTime(); // 获取当前时间

	if (currentTime - lastAttackTime < 1000 / cps.getCurrentValue()) {
		return; // 如果距离上次攻击时间小于计算出的攻击间隔，则不进行攻击
	}

	lastAttackTime = currentTime; // 更新上次攻击时间

	target = LocalPlayer.getNearestPlayer(r.getCurrentValue());
	if (aa.isActive()) {
		LocalPlayer.smoothLookAt(target, as.getCurrentValue());
	}
	if (target == 0 || isFriend(target)) {
		return;
	}

	LocalPlayer.attack(target);

	{
		var playerID = LocalPlayer.getNearestPlayer(7);
		var horizontalSize = 9;
		var verticalSize = 10;

		Player.setCollisionSize(playerID, 9, 10);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 0.6);
	}



	{
		var playerID = LocalPlayer.getNearestPlayer(7);
		var horizontalSize = 9;
		var verticalSize = 10;

		Player.setCollisionSize(playerID, 9, 10);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 0.6);
	}

	{
		var playerID = LocalPlayer.getNearestPlayer(5);
		var horizontalSize = 9;
		var verticalSize = 10;

		Player.setCollisionSize(playerID, 9, 10);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 0.6);
	}

	{
		var playerID = LocalPlayer.getNearestPlayer(2);
		var horizontalSize = 10;
		var verticalSize = 12;

		Player.setCollisionSize(playerID, 10, 12);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 1);
	}

	{
		var playerID = LocalPlayer.getNearestPlayer(8);
		var horizontalSize = 8;
		var verticalSize = 10;

		Player.setCollisionSize(playerID, 8, 10);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 0.6);
	}

	{
		var playerID = LocalPlayer.getNearestPlayer(1);
		var horizontalSize = 6;
		var verticalSize = 8;

		Player.setCollisionSize(playerID, 6, 8);

		LocalPlayer.getCollisionSize();

		Player.setShadowRadius(playerID, 0.6);
	}
}

if (!module.isActive()) {
	var playerID = LocalPlayer.getNearestPlayer(7);
	var horizontalSize = 0.6;
	var verticalSize = 1.8;

	Player.setCollisionSize(playerID, 0.6, 1.8);
}

function onScriptEnabled() {
	ModuleManager.addModule(module);
}

function onScriptDisabled() {
	ModuleManager.removeModule(module);
}