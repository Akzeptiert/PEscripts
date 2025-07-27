let speedModule;
let speedTypeSetting;
let doshikBoostIntervalSetting;
let doshikBoostStrengthSetting;
let bhopJumpHeightSetting;
let bhopHorizontalBoostSetting;
let vanillaSpeedMultiplierSetting;
let webJumpStrengthSetting;
let webJumpHeightSetting;
let iceStrafeSpeedSetting;
let iceStrafeFrictionReductionSetting;
let jetpackStrengthSetting;
let jetpackTimerMultiplierSetting;
let reverseYPortFallDistanceSetting;
let reverseYPortJumpHeightSetting;
let cyclicHopIntervalSetting;
let cyclicHopGroundSpeedSetting;
let cyclicHopAirSpeedSetting;
let nullMotionSpeedSetting;
let motionEasingFactorSetting;
let staggerStepIntervalSetting;
let staggerStepBoostSetting;
let desyncBurstIntervalSetting;
let desyncBurstDistanceSetting;
let smoothYAmplitudeSetting;
let smoothYFrequencySetting;
let shadowSyncRadiusSetting;
let shadowSyncStrengthSetting;
let collisionJumpHeightSetting;
let collisionSpeedBoostSetting;

let currentDoshikIntervalTick = 0;
let currentCyclicHopTick = 0;
let currentSmoothYTick = 0;

function getDistance(x1, y1, z1, x2, y2, z2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function initSpeedModule() {
    speedModule = new Module("Speed", true, true, ModuleCategory.MOVEMENT);

    speedTypeSetting = new ModeSetting("Тип", [
        "DoshikAC (boost)",
        "Bhop",
        "Vanilla",
        "WebJump",
        "IceStrafe",
        "Jetpack",
        "ReverseYPort",
        "CyclicHop",
        "NullMotion",
        "MotionEasing",
        "StaggerStep",
        "DesyncBurst",
        "SmoothY",
        "ShadowSync",
        "PlayerCollision"
    ]);
    speedModule.addSetting(speedTypeSetting);

    doshikBoostIntervalSetting = new SliderSetting("Интервал буста (тики)", [40, 20, 100, 1]);
    doshikBoostStrengthSetting = new SliderSetting("Сила буста (множитель)", [5.0, 1.0, 100.0, 0.5]);
    speedModule.addSettings([doshikBoostIntervalSetting, doshikBoostStrengthSetting]);

    bhopJumpHeightSetting = new SliderSetting("Высота прыжка Bhop", [0.2, 0.1, 0.5, 0.01]);
    bhopHorizontalBoostSetting = new SliderSetting("Горизонтальный буст Bhop", [0.1, 0.05, 0.3, 0.01]);
    speedModule.addSettings([bhopJumpHeightSetting, bhopHorizontalBoostSetting]);

    vanillaSpeedMultiplierSetting = new SliderSetting("Скорость (множитель)", [1.5, 1.0, 5.0, 0.05]);
    speedModule.addSetting(vanillaSpeedMultiplierSetting);

    webJumpStrengthSetting = new SliderSetting("Сила прыжка WebJump", [1.2, 1.0, 5.0, 0.1]);
    webJumpHeightSetting = new SliderSetting("Высота прыжка WebJump", [0.5, 0.1, 1.0, 0.05]);
    speedModule.addSettings([webJumpStrengthSetting, webJumpHeightSetting]);

    iceStrafeSpeedSetting = new SliderSetting("Скорость IceStrafe", [0.3, 0.1, 1.0, 0.01]);
    iceStrafeFrictionReductionSetting = new SliderSetting("Снижение трения IceStrafe", [0.9, 0.5, 1.0, 0.01]);
    speedModule.addSettings([iceStrafeSpeedSetting, iceStrafeFrictionReductionSetting]);

    jetpackStrengthSetting = new SliderSetting("Сила Jetpack", [0.1, 0.01, 0.5, 0.01]);
    jetpackTimerMultiplierSetting = new SliderSetting("Множитель таймера Jetpack", [1.0, 0.1, 2.0, 0.05]);
    speedModule.addSettings([jetpackStrengthSetting, jetpackTimerMultiplierSetting]);

    reverseYPortFallDistanceSetting = new SliderSetting("Дистанция падения ReverseYPort", [0.1, 0.05, 0.5, 0.01]);
    reverseYPortJumpHeightSetting = new SliderSetting("Высота прыжка ReverseYPort", [0.42, 0.1, 0.8, 0.01]);
    speedModule.addSettings([reverseYPortFallDistanceSetting, reverseYPortJumpHeightSetting]);

    cyclicHopIntervalSetting = new SliderSetting("Интервал CyclicHop (тики)", [10, 5, 30, 1]);
    cyclicHopGroundSpeedSetting = new SliderSetting("Скорость на земле CyclicHop", [0.2, 0.1, 0.5, 0.01]);
    cyclicHopAirSpeedSetting = new SliderSetting("Скорость в воздухе CyclicHop", [0.3, 0.1, 0.6, 0.01]);
    speedModule.addSettings([cyclicHopIntervalSetting, cyclicHopGroundSpeedSetting, cyclicHopAirSpeedSetting]);

    nullMotionSpeedSetting = new SliderSetting("Скорость NullMotion", [0.25, 0.1, 0.5, 0.01]);
    speedModule.addSetting(nullMotionSpeedSetting);

    motionEasingFactorSetting = new SliderSetting("Фактор сглаживания MotionEasing", [0.1, 0.01, 0.5, 0.01]);
    speedModule.addSetting(motionEasingFactorSetting);

    staggerStepIntervalSetting = new SliderSetting("Интервал StaggerStep (тики)", [2, 1, 5, 1]);
    staggerStepBoostSetting = new SliderSetting("Буст StaggerStep", [0.15, 0.05, 0.5, 0.01]);
    speedModule.addSettings([staggerStepIntervalSetting, staggerStepBoostSetting]);

    desyncBurstIntervalSetting = new SliderSetting("Интервал DesyncBurst (тики)", [60, 20, 200, 1]);
    desyncBurstDistanceSetting = new SliderSetting("Дистанция DesyncBurst", [1.0, 0.5, 5.0, 0.1]);
    speedModule.addSettings([desyncBurstIntervalSetting, desyncBurstDistanceSetting]);

    smoothYAmplitudeSetting = new SliderSetting("Амплитуда SmoothY", [0.05, 0.01, 0.2, 0.01]);
    smoothYFrequencySetting = new SliderSetting("Частота SmoothY", [0.5, 0.1, 2.0, 0.05]);
    speedModule.addSettings([smoothYAmplitudeSetting, smoothYFrequencySetting]);

    shadowSyncRadiusSetting = new SliderSetting("Радиус ShadowSync", [5.0, 1.0, 20.0, 0.5]);
    shadowSyncStrengthSetting = new SliderSetting("Сила ShadowSync", [0.5, 0.1, 1.0, 0.05]);
    speedModule.addSettings([shadowSyncRadiusSetting, shadowSyncStrengthSetting]);

    collisionJumpHeightSetting = new SliderSetting("Высота прыжка при столкновении", [0.42, 0.1, 1.0, 0.01]);
    collisionSpeedBoostSetting = new SliderSetting("Сила толчка при столкновении", [0.5, 0.01, 5.0, 0.01]);
    speedModule.addSettings([collisionJumpHeightSetting, collisionSpeedBoostSetting]);

    function updateSpeedSettingsVisibility(mode) {
        doshikBoostIntervalSetting.setVisibility(false);
        doshikBoostStrengthSetting.setVisibility(false);
        bhopJumpHeightSetting.setVisibility(false);
        bhopHorizontalBoostSetting.setVisibility(false);
        vanillaSpeedMultiplierSetting.setVisibility(false);
        webJumpStrengthSetting.setVisibility(false);
        webJumpHeightSetting.setVisibility(false);
        iceStrafeSpeedSetting.setVisibility(false);
        iceStrafeFrictionReductionSetting.setVisibility(false);
        jetpackStrengthSetting.setVisibility(false);
        jetpackTimerMultiplierSetting.setVisibility(false);
        reverseYPortFallDistanceSetting.setVisibility(false);
        reverseYPortJumpHeightSetting.setVisibility(false);
        cyclicHopIntervalSetting.setVisibility(false);
        cyclicHopGroundSpeedSetting.setVisibility(false);
        cyclicHopAirSpeedSetting.setVisibility(false);
        nullMotionSpeedSetting.setVisibility(false);
        motionEasingFactorSetting.setVisibility(false);
        staggerStepIntervalSetting.setVisibility(false);
        staggerStepBoostSetting.setVisibility(false);
        desyncBurstIntervalSetting.setVisibility(false);
        desyncBurstDistanceSetting.setVisibility(false);
        smoothYAmplitudeSetting.setVisibility(false);
        smoothYFrequencySetting.setVisibility(false);
        shadowSyncRadiusSetting.setVisibility(false);
        shadowSyncStrengthSetting.setVisibility(false);
        collisionJumpHeightSetting.setVisibility(false);
        collisionSpeedBoostSetting.setVisibility(false);

        if (mode === "DoshikAC (boost)") {
            doshikBoostIntervalSetting.setVisibility(true);
            doshikBoostStrengthSetting.setVisibility(true);
        } else if (mode === "Bhop") {
            bhopJumpHeightSetting.setVisibility(true);
            bhopHorizontalBoostSetting.setVisibility(true);
        } else if (mode === "Vanilla") {
            vanillaSpeedMultiplierSetting.setVisibility(true);
        } else if (mode === "WebJump") {
            webJumpStrengthSetting.setVisibility(true);
            webJumpHeightSetting.setVisibility(true);
        } else if (mode === "IceStrafe") {
            iceStrafeSpeedSetting.setVisibility(true);
            iceStrafeFrictionReductionSetting.setVisibility(true);
        } else if (mode === "Jetpack") {
            jetpackStrengthSetting.setVisibility(true);
            jetpackTimerMultiplierSetting.setVisibility(true);
        } else if (mode === "ReverseYPort") {
            reverseYPortFallDistanceSetting.setVisibility(true);
            reverseYPortJumpHeightSetting.setVisibility(true);
        } else if (mode === "CyclicHop") {
            cyclicHopIntervalSetting.setVisibility(true);
            cyclicHopGroundSpeedSetting.setVisibility(true);
            cyclicHopAirSpeedSetting.setVisibility(true);
        } else if (mode === "NullMotion") {
            nullMotionSpeedSetting.setVisibility(true);
        } else if (mode === "MotionEasing") {
            motionEasingFactorSetting.setVisibility(true);
        } else if (mode === "StaggerStep") {
            staggerStepIntervalSetting.setVisibility(true);
            staggerStepBoostSetting.setVisibility(true);
        } else if (mode === "DesyncBurst") {
            desyncBurstIntervalSetting.setVisibility(true);
            desyncBurstDistanceSetting.setVisibility(true);
        } else if (mode === "SmoothY") {
            smoothYAmplitudeSetting.setVisibility(true);
            smoothYFrequencySetting.setVisibility(true);
        } else if (mode === "ShadowSync") {
            shadowSyncRadiusSetting.setVisibility(true);
            shadowSyncStrengthSetting.setVisibility(true);
        } else if (mode === "PlayerCollision") {
            collisionJumpHeightSetting.setVisibility(true);
            collisionSpeedBoostSetting.setVisibility(true);
        }
    }

    speedTypeSetting.setOnModeSelectedListener(function(mode) {
        updateSpeedSettingsVisibility(mode);
    });

    speedModule.setOnToggleListener(function(view, active) {
        if (active) {
            currentDoshikIntervalTick = 0;
            currentCyclicHopTick = 0;
            currentSmoothYTick = 0;
            if (speedTypeSetting.getCurrentMode() === "DoshikAC (boost)") {
                const currentYaw = LocalPlayer.getYaw();
                const radians = currentYaw * (Math.PI / 180);
                const baseMovementSpeed = 0.2;
                let strength = doshikBoostStrengthSetting.getCurrentValue();

                let impulseX = -Math.sin(radians) * baseMovementSpeed * strength;
                let impulseZ = Math.cos(radians) * baseMovementSpeed * strength;

                LocalPlayer.setVelocity(
                    LocalPlayer.getVelocityX() + impulseX,
                    LocalPlayer.getVelocityY(),
                    LocalPlayer.getVelocityZ() + impulseZ
                );
            }
            updateSpeedSettingsVisibility(speedTypeSetting.getCurrentMode());
        } else {
            currentDoshikIntervalTick = 0;
            currentCyclicHopTick = 0;
            currentSmoothYTick = 0;
            LocalPlayer.setVelocity(0, LocalPlayer.getVelocityY(), 0);
            LocalPlayer.setOnGround(false);
        }
    });

    ModuleManager.addModule(speedModule);
    updateSpeedSettingsVisibility(speedTypeSetting.getCurrentMode());
}

function onSpeedTick() {
    if (speedModule.isActive()) {
        const currentMode = speedTypeSetting.getCurrentMode();
        const currentYaw = LocalPlayer.getYaw();
        const radians = currentYaw * (Math.PI / 180);
        const baseMovementSpeed = 0.2;

        if (currentMode === "DoshikAC (boost)") {
            let interval = doshikBoostIntervalSetting.getCurrentValue();
            let strength = doshikBoostStrengthSetting.getCurrentValue();

            currentDoshikIntervalTick++;

            if (currentDoshikIntervalTick >= interval) {
                let impulseX = -Math.sin(radians) * baseMovementSpeed * strength;
                let impulseZ = Math.cos(radians) * baseMovementSpeed * strength;

                LocalPlayer.setVelocity(
                    LocalPlayer.getVelocityX() + impulseX,
                    LocalPlayer.getVelocityY(),
                    LocalPlayer.getVelocityZ() + impulseZ
                );
                currentDoshikIntervalTick = 0;
            }
        } else if (currentMode === "Bhop") {
            let jumpHeight = bhopJumpHeightSetting.getCurrentValue();
            let horizontalBoost = bhopHorizontalBoostSetting.getCurrentValue();

            if (LocalPlayer.isOnGround()) {
                if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) ||
                    LocalPlayer.isMoveButtonPressed(MoveButton.BACK) ||
                    LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) ||
                    LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {

                    LocalPlayer.setVelocityY(jumpHeight);

                    let motionX = 0;
                    let motionZ = 0;

                    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                        motionX -= Math.sin(radians) * horizontalBoost;
                        motionZ += Math.cos(radians) * horizontalBoost;
                    }
                    if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                        motionX += Math.sin(radians) * horizontalBoost;
                        motionZ -= Math.cos(radians) * horizontalBoost;
                    }
                    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                        motionX -= Math.cos(radians) * horizontalBoost;
                        motionZ -= Math.sin(radians) * horizontalBoost;
                    }
                    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                        motionX += Math.cos(radians) * horizontalBoost;
                        motionZ += Math.sin(radians) * horizontalBoost;
                    }
                    LocalPlayer.setVelocity(
                        LocalPlayer.getVelocityX() + motionX,
                        LocalPlayer.getVelocityY(),
                        LocalPlayer.getVelocityZ() + motionZ
                    );
                }
            }
        } else if (currentMode === "Vanilla") {
            let multiplier = vanillaSpeedMultiplierSetting.getCurrentValue();
            let targetSpeed = baseMovementSpeed * multiplier;

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * targetSpeed;
                motionZ += Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * targetSpeed;
                motionZ -= Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * targetSpeed;
                motionZ -= Math.sin(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * targetSpeed;
                motionZ += Math.sin(radians) * targetSpeed;
            }

            LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
        } else if (currentMode === "WebJump") {
            let webJumpStrength = webJumpStrengthSetting.getCurrentValue();
            let webJumpHeight = webJumpHeightSetting.getCurrentValue();

            if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                LocalPlayer.setVelocityY(webJumpHeight);
                let currentVelX = LocalPlayer.getVelocityX();
                let currentVelZ = LocalPlayer.getVelocityZ();
                LocalPlayer.setVelocity(currentVelX * webJumpStrength, LocalPlayer.getVelocityY(), currentVelZ * webJumpStrength);
            }
        } else if (currentMode === "IceStrafe") {
            let iceStrafeSpeed = iceStrafeSpeedSetting.getCurrentValue();
            let iceStrafeFrictionReduction = iceStrafeFrictionReductionSetting.getCurrentValue();

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * iceStrafeSpeed;
                motionZ += Math.cos(radians) * iceStrafeSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * iceStrafeSpeed;
                motionZ -= Math.cos(radians) * iceStrafeSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * iceStrafeSpeed;
                motionZ -= Math.sin(radians) * iceStrafeSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * iceStrafeSpeed;
                motionZ += Math.sin(radians) * iceStrafeSpeed;
            }
            LocalPlayer.setVelocity(LocalPlayer.getVelocityX() * iceStrafeFrictionReduction + motionX, LocalPlayer.getVelocityY(), LocalPlayer.getVelocityZ() * iceStrafeFrictionReduction + motionZ);

        } else if (currentMode === "Jetpack") {
            let jetpackStrength = jetpackStrengthSetting.getCurrentValue();
            let jetpackTimerMultiplier = jetpackTimerMultiplierSetting.getCurrentValue();

            if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                LocalPlayer.setVelocityY(LocalPlayer.getVelocityY() + jetpackStrength * jetpackTimerMultiplier);
            }
        } else if (currentMode === "ReverseYPort") {
            let reverseYPortFallDistance = reverseYPortFallDistanceSetting.getCurrentValue();
            let reverseYPortJumpHeight = reverseYPortJumpHeightSetting.getCurrentValue();

            if (LocalPlayer.isOnGround()) {
                LocalPlayer.setVelocityY(-reverseYPortFallDistance);
            } else if (LocalPlayer.getVelocityY() < 0 && LocalPlayer.getFallDistance() >= reverseYPortFallDistance * 0.5) {
                LocalPlayer.setVelocityY(reverseYPortJumpHeight);
            }
        } else if (currentMode === "CyclicHop") {
            let cyclicHopInterval = cyclicHopIntervalSetting.getCurrentValue();
            let cyclicHopGroundSpeed = cyclicHopGroundSpeedSetting.getCurrentValue();
            let cyclicHopAirSpeed = cyclicHopAirSpeedSetting.getCurrentValue();

            currentCyclicHopTick++;

            let currentSpeed = 0;
            if (currentCyclicHopTick % (cyclicHopInterval * 2) < cyclicHopInterval) {
                currentSpeed = cyclicHopGroundSpeed;
                if (!LocalPlayer.isOnGround()) {
                    LocalPlayer.setOnGround(true);
                }
            } else {
                currentSpeed = cyclicHopAirSpeed;
                if (LocalPlayer.isOnGround()) {
                    LocalPlayer.setVelocityY(0.42);
                }
            }

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * currentSpeed;
                motionZ += Math.cos(radians) * currentSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * currentSpeed;
                motionZ -= Math.cos(radians) * currentSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * currentSpeed;
                motionZ -= Math.sin(radians) * currentSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * currentSpeed;
                motionZ += Math.sin(radians) * currentSpeed;
            }
            LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);

        } else if (currentMode === "NullMotion") {
            let nullMotionSpeed = nullMotionSpeedSetting.getCurrentValue();
            LocalPlayer.setVelocityY(0);

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * nullMotionSpeed;
                motionZ += Math.cos(radians) * nullMotionSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * nullMotionSpeed;
                motionZ -= Math.cos(radians) * nullMotionSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * nullMotionSpeed;
                motionZ -= Math.sin(radians) * nullMotionSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * nullMotionSpeed;
                motionZ += Math.sin(radians) * nullMotionSpeed;
            }
            LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
        } else if (currentMode === "MotionEasing") {
            let easingFactor = motionEasingFactorSetting.getCurrentValue();
            let targetSpeed = baseMovementSpeed;

            let currentVelX = LocalPlayer.getVelocityX();
            let currentVelZ = LocalPlayer.getVelocityZ();

            let targetMotionX = 0;
            let targetMotionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                targetMotionX -= Math.sin(radians) * targetSpeed;
                targetMotionZ += Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                targetMotionX += Math.sin(radians) * targetSpeed;
                targetMotionZ -= Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                targetMotionX -= Math.cos(radians) * targetSpeed;
                targetMotionZ -= Math.sin(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                targetMotionX += Math.cos(radians) * targetSpeed;
                targetMotionZ += Math.sin(radians) * targetSpeed;
            }

            let newVelX = currentVelX + (targetMotionX - currentVelX) * easingFactor;
            let newVelZ = currentVelZ + (targetMotionZ - currentVelZ) * easingFactor;

            LocalPlayer.setVelocity(newVelX, LocalPlayer.getVelocityY(), newVelZ);
        } else if (currentMode === "StaggerStep") {
            let staggerInterval = staggerStepIntervalSetting.getCurrentValue();
            let staggerBoost = staggerStepBoostSetting.getCurrentValue();

            currentCyclicHopTick++;

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * baseMovementSpeed;
                motionZ += Math.cos(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * baseMovementSpeed;
                motionZ -= Math.cos(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * baseMovementSpeed;
                motionZ -= Math.sin(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * baseMovementSpeed;
                motionZ += Math.sin(radians) * baseMovementSpeed;
            }

            if (currentCyclicHopTick % (staggerInterval * 2) < staggerInterval) {
                LocalPlayer.setOnGround(true);
                LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
            } else {
                LocalPlayer.setOnGround(false);
                LocalPlayer.setVelocity(
                    LocalPlayer.getVelocityX() + motionX * staggerBoost,
                    LocalPlayer.getVelocityY(),
                    LocalPlayer.getVelocityZ() + motionZ * staggerBoost
                );
            }
        } else if (currentMode === "DesyncBurst") {
            let desyncInterval = desyncBurstIntervalSetting.getCurrentValue();
            let desyncDistance = desyncBurstDistanceSetting.getCurrentValue();

            currentDoshikIntervalTick++;

            let motionX = 0;
            let motionZ = 0;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * baseMovementSpeed;
                motionZ += Math.cos(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * baseMovementSpeed;
                motionZ -= Math.cos(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * baseMovementSpeed;
                motionZ -= Math.sin(radians) * baseMovementSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * baseMovementSpeed;
                motionZ += Math.sin(radians) * baseMovementSpeed;
            }
            LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);

            if (currentDoshikIntervalTick >= desyncInterval) {
                let burstX = -Math.sin(radians) * desyncDistance;
                let burstZ = Math.cos(radians) * desyncDistance;
                LocalPlayer.setPositionRelative(burstX, 0, burstZ);
                currentDoshikIntervalTick = 0;
            }
        } else if (currentMode === "SmoothY") {
            let smoothYAmplitude = smoothYAmplitudeSetting.getCurrentValue();
            let smoothYFrequency = smoothYFrequencySetting.getCurrentValue();

            currentSmoothYTick++;
            let sineValue = Math.sin(currentSmoothYTick * smoothYFrequency) * smoothYAmplitude;
            LocalPlayer.setVelocityY(sineValue);

            let motionX = 0;
            let motionZ = 0;
            let targetSpeed = baseMovementSpeed;

            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                motionX -= Math.sin(radians) * targetSpeed;
                motionZ += Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                motionX += Math.sin(radians) * targetSpeed;
                motionZ -= Math.cos(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                motionX -= Math.cos(radians) * targetSpeed;
                motionZ -= Math.sin(radians) * targetSpeed;
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                motionX += Math.cos(radians) * targetSpeed;
                motionZ += Math.sin(radians) * targetSpeed;
            }
            LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
        } else if (currentMode === "ShadowSync") {
            let shadowSyncRadius = shadowSyncRadiusSetting.getCurrentValue();
            let shadowSyncStrength = shadowSyncStrengthSetting.getCurrentValue();

            let nearestPlayer = -1;
            let minDistance = Infinity;
            let players = Level.getAllPlayers();

            let localPlayerX = LocalPlayer.getPositionX();
            let localPlayerY = LocalPlayer.getPositionY();
            let localPlayerZ = LocalPlayer.getPositionZ();

            for (let i = 0; i < players.length; i++) {
                let playerID = players[i];
                if (playerID === LocalPlayer.getUniqueID() || !Player.isAlive(playerID)) {
                    continue;
                }

                let playerX = Player.getPositionX(playerID);
                let playerY = Player.getPositionY(playerID);
                let playerZ = Player.getPositionZ(playerID);
                let dist = getDistance(localPlayerX, localPlayerY, localPlayerZ, playerX, playerY, playerZ);

                if (dist <= shadowSyncRadius && dist < minDistance) {
                    minDistance = dist;
                    nearestPlayer = playerID;
                }
            }

            if (nearestPlayer !== -1) {
                let targetVelX = Player.getVelocityX(nearestPlayer);
                let targetVelY = Player.getVelocityY(nearestPlayer);
                let targetVelZ = Player.getVelocityZ(nearestPlayer);

                let currentVelX = LocalPlayer.getVelocityX();
                let currentVelY = LocalPlayer.getVelocityY();
                let currentVelZ = LocalPlayer.getVelocityZ();

                let newVelX = currentVelX + (targetVelX - currentVelX) * shadowSyncStrength;
                let newVelY = currentVelY + (targetVelY - currentVelY) * shadowSyncStrength;
                let newVelZ = currentVelZ + (targetVelZ - currentVelZ) * shadowSyncStrength;

                LocalPlayer.setVelocity(newVelX, newVelY, newVelZ);
            } else {
                let motionX = 0;
                let motionZ = 0;
                let targetSpeed = baseMovementSpeed;

                if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                    motionX -= Math.sin(radians) * targetSpeed;
                    motionZ += Math.cos(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                    motionX += Math.sin(radians) * targetSpeed;
                    motionZ -= Math.cos(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                    motionX -= Math.cos(radians) * targetSpeed;
                    motionZ -= Math.sin(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                    motionX += Math.cos(radians) * targetSpeed;
                    motionZ += Math.sin(radians) * targetSpeed;
                }
                LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
            }
        } else if (currentMode === "PlayerCollision") {
            let jumpHeight = collisionJumpHeightSetting.getCurrentValue();
            let speedBoost = collisionSpeedBoostSetting.getCurrentValue();

            let localPlayerX = LocalPlayer.getPositionX();
            let localPlayerY = LocalPlayer.getPositionY();
            let localPlayerZ = LocalPlayer.getPositionZ();
            let localPlayerCollisionSize = LocalPlayer.getCollisionSize()[0];

            let players = Level.getAllPlayers();
            let collided = false;

            for (let i = 0; i < players.length; i++) {
                let playerID = players[i];
                if (playerID === LocalPlayer.getUniqueID() || !Player.isAlive(playerID)) {
                    continue;
                }

                let playerX = Player.getPositionX(playerID);
                let playerY = Player.getPositionY(playerID);
                let playerZ = Player.getPositionZ(playerID);

                let dist = getDistance(localPlayerX, localPlayerY, localPlayerZ, playerX, playerY, playerZ);

                if (dist < localPlayerCollisionSize * 1.5) {
                    collided = true;
                    break;
                }
            }

            if (collided) {
                LocalPlayer.setVelocityY(jumpHeight);
                let pushX = -Math.sin(radians) * speedBoost;
                let pushZ = Math.cos(radians) * speedBoost;
                LocalPlayer.setVelocity(
                    LocalPlayer.getVelocityX() + pushX,
                    LocalPlayer.getVelocityY(),
                    LocalPlayer.getVelocityZ() + pushZ
                );
            } else {
                let motionX = 0;
                let motionZ = 0;
                let targetSpeed = baseMovementSpeed;

                if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                    motionX -= Math.sin(radians) * targetSpeed;
                    motionZ += Math.cos(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                    motionX += Math.sin(radians) * targetSpeed;
                    motionZ -= Math.cos(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                    motionX -= Math.cos(radians) * targetSpeed;
                    motionZ -= Math.sin(radians) * targetSpeed;
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                    motionX += Math.cos(radians) * targetSpeed;
                    motionZ += Math.sin(radians) * targetSpeed;
                }
                LocalPlayer.setVelocity(motionX, LocalPlayer.getVelocityY(), motionZ);
            }
        }
    }
}

onScriptEnabled = function() {
    initSpeedModule();
    onLevelTick = onSpeedTick;
};

onScriptDisabled = function() {
    ModuleManager.removeModule(speedModule);
    LocalPlayer.setVelocity(0, 0, 0);
    currentDoshikIntervalTick = 0;
    currentCyclicHopTick = 0;
    currentSmoothYTick = 0;
    LocalPlayer.setOnGround(false);
    onLevelTick = null;
};

onLevelTick = null;

