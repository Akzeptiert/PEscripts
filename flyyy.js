var module = new Module("Flyyy", true, true, ModuleCategory.MOVEMENT);
var m = new ModeSetting("Mode", ["Vanilla", "Breadix"]);
var d = new SliderSetting("GlideDelay", [2, 0, 10, 1]);
var st = new SliderSetting("StuckTick", [10.0, 0, 20.0, 1]);
var std = new SliderSetting("StuckDelay", [20, 0, 50.0, 1]);
var ty = new SliderSetting("TeleportY", [5.0, 0, 10.0, 1]);
var td = new SliderSetting("TeleportDelay", [10.0, 0, 50.0, 1]);
var sx = new SliderSetting("Horizontal", [0.4, 0, 10.0, 0.1]);
var sy = new SliderSetting("Vertical", [0.4, 0, 10.0, 0.1]);
module.addSettings([m, d, st, std, ty, td, sx, sy]);

let isVelocityZero = false;
let velocityZeroTicks = 0;

module.setOnToggleListener(function(view, active) {
    if (!active) {
        // 当模块被禁用时，设置玩家的velocityX和velocityZ为0
        LocalPlayer.setVelocityX(0);
        LocalPlayer.setVelocityZ(0);
    }
});

m.setOnModeSelectedListener((view, a) => {
	if (m.getCurrentMode() == "Vanilla") {
		sx.setVisibility(true);
		ty.setVisibility(false);
		td.setVisibility(false);
		st.setVisibility(false);
		std.setVisibility(false);
		sy.setVisibility(true);
		sy.setVisibility(true);
		d.setVisibility(false);
	}
	if (m.getCurrentMode() == "Breadix") {
		sy.setVisibility(false);
		st.setVisibility(true);
		std.setVisibility(true);
		ty.setVisibility(true);
		td.setVisibility(true);
		sx.setVisibility(false);
		sy.setVisibility(false);
		d.setVisibility(true);
	}
});

module.setOnToggleListener((view, a) => {
	i = 0
	t = 0
	s = 0
})

i = 0
t = 0
s = 0

function onLevelTick() {
	if (module.isActive()) {
		if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && LocalPlayer.isOnGround()) {
			LocalPlayer.setVelocityX(0);
			LocalPlayer.setVelocityZ(0);
		} else {
			if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isOnGround()) {
				LocalPlayer.setVelocityX(0);
				LocalPlayer.setVelocityZ(0);
			}
		}
		switch (m.getCurrentMode()) {
			case "Vanilla":
				LocalPlayer.setVelocityY(0);
				var yaw_strafe = LocalPlayer.getYaw();
				if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
					LocalPlayer.setVelocityX(-sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityZ(sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
					LocalPlayer.setVelocityX(sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityZ(-sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {
					LocalPlayer.setVelocityX(-sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityZ(sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
					LocalPlayer.setVelocityZ(sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityX(sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {
					LocalPlayer.setVelocityX(-sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityZ(sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
					LocalPlayer.setVelocityZ(-sx.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
					LocalPlayer.setVelocityX(-sx.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
					LocalPlayer.setVelocityY(sy.getCurrentValue())
				}
				if (LocalPlayer.isMoveButtonPressed(MoveButton.SHIFT)) {
					LocalPlayer.setVelocityY(-sy.getCurrentValue())
				}
				break;
			case "Breadix":
				LocalPlayer.addEffect(8, 3, 2, true);
				if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isOnGround()) {
					LocalPlayer.setVelocityY(0);
				}
				i += 1;
				if (i >= d.getCurrentValue()) {
					i = 0;
					if (LocalPlayer.isFalling()) {
						LocalPlayer.setVelocityY(-0.101)
						i = 0;
					}
				}
				t += 1;
				if (t >= 15) {
					t = 0;
					if (LocalPlayer.isFalling()) {
						var yaw_strafe = LocalPlayer.getYaw();
						if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
							LocalPlayer.setVelocityX(-0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityZ(0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
							LocalPlayer.setVelocityX(0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityZ(-0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {
							LocalPlayer.setVelocityX(-0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityZ(0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
							LocalPlayer.setVelocityZ(0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityX(0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {
							LocalPlayer.setVelocityX(-0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityZ(0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
							LocalPlayer.setVelocityZ(-0.3 * Math.sin(yaw_strafe / 180 * Math.PI));
							LocalPlayer.setVelocityX(-0.3 * Math.cos(yaw_strafe / 180 * Math.PI));
						}
						t = 0;
					}
				}
				s += 1;
				if (s == std.getCurrentValue()) {
					isVelocityZero = true;
					velocityZeroTicks = st.getCurrentValue();
				}

				if (isVelocityZero) {
					LocalPlayer.setStatusFlag(16, true);
					velocityZeroTicks--;
					if (velocityZeroTicks <= 0) {
						isVelocityZero = false;
						LocalPlayer.setStatusFlag(16, false);
					}
				}
				if (s >= td.getCurrentValue()) {
					s = 0;
					LocalPlayer.setPositionRelativeY(ty.getCurrentValue());
				}
				if (!module.isActive()) {
					s = 0;
				}
				break;
		}
	}
}

function onScriptEnabled() {
	ModuleManager.addModule(module);
}

function onScriptDisabled() {
	ModuleManager.removeModule(module);
}