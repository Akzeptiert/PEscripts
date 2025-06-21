var motionGraph = new Module("MotionGraph", true, true, ModuleCategory.MOVEMENT);

var enabledSetting = new StateSetting("Enabled", true);
var modeSetting = new ModeSetting("Mode", ["BPS", "Jump", "Vertical", "Combined", "Full"]);
var styleSetting = new ModeSetting("Style", ["Modern", "Minimal", "Detailed"]);
var barStyleSetting = new ModeSetting("Bar Style", ["Simple", "Detailed", "Arrows", "Waves", "Dots", "Blocks"]);
var colorModeSetting = new ModeSetting("Color", ["White", "Blue", "Green", "Gold", "Rainbow", "Gradient", "Speed Based"]);
var secondColorSetting = new ModeSetting("Second Color", ["Red", "Yellow", "Purple", "Aqua"]);
var updateSetting = new SliderSetting("Update Speed", [1, 0.1, 2, 0.1]);
var directionSetting = new StateSetting("Show Direction", false);
var showAverageSetting = new StateSetting("Show Average", false);
var showTimerSetting = new StateSetting("Show Timer", false);
var autoResetSetting = new ModeSetting("Auto Reset", ["Never", "Death", "Ground", "Time"]);
var resetTimeSetting = new SliderSetting("Reset Time", [10, 5, 30, 5]);
var resetSetting = new ButtonSetting("Reset Max Values", function() {
    clearMaxValues();
});

motionGraph.addSettings([
    enabledSetting,
    modeSetting,
    styleSetting,
    barStyleSetting,
    colorModeSetting,
    secondColorSetting,
    updateSetting,
    directionSetting,
    showAverageSetting,
    showTimerSetting,
    autoResetSetting,
    resetTimeSetting,
    resetSetting
]);

var motionData = {
    speeds: [],
    jumps: [],
    vertical: [],
    maxSpeed: 0,
    maxJump: 0,
    maxVertical: 0,
    lastGroundY: 0,
    jumpHeight: 0,
    lastUpdate: 0,
    rainbowHue: 0,
    startTime: 0,
    direction: "",
    averageSpeed: 0,
    resetTimer: 0
};

function clearMaxValues() {
    motionData.maxSpeed = 0;
    motionData.maxJump = 0;
    motionData.maxVertical = 0;
}

function clearData() {
    motionData.speeds = [];
    motionData.jumps = [];
    motionData.vertical = [];
    motionData.lastGroundY = 0;
    motionData.jumpHeight = 0;
    motionData.lastUpdate = 0;
    motionData.startTime = new Date().getTime();
    motionData.direction = "";
    motionData.averageSpeed = 0;
    motionData.resetTimer = 0;
    clearMaxValues();
}

function calcBPS() {
    var velX = LocalPlayer.getVelocityX();
    var velZ = LocalPlayer.getVelocityZ();
    return Math.sqrt(velX * velX + velZ * velZ) * 20;
}

function getDirection() {
    var velX = LocalPlayer.getVelocityX();
    var velZ = LocalPlayer.getVelocityZ();
    
    if(Math.abs(velX) < 0.01 && Math.abs(velZ) < 0.01) return "•";
    
    if(Math.abs(velX) > Math.abs(velZ)) {
        return velX > 0 ? "→" : "←";
    } else {
        return velZ > 0 ? "↓" : "↑";
    }
}

function formatNumber(num) {
    return Math.round(num * 100) / 100;
}

function formatTime(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}function getColorBySpeed(speed) {
    if(speed < 5) return "§a";
    if(speed < 10) return "§e";
    if(speed < 15) return "§6";
    if(speed < 20) return "§c";
    return "§4";
}

function getGradientColor() {
    var colors = {
        "Red": ["§c", "§4"],
        "Yellow": ["§e", "§6"],
        "Purple": ["§5", "§d"],
        "Aqua": ["§b", "§3"]
    };
    return colors[secondColorSetting.getCurrentMode()][motionData.rainbowHue < 180 ? 0 : 1];
}

function getRainbowColor() {
    var hue = motionData.rainbowHue;
    if(hue < 60) return "§6";
    if(hue < 120) return "§e";
    if(hue < 180) return "§a";
    if(hue < 240) return "§b";
    if(hue < 300) return "§d";
    return "§c";
}

function getColorPrefix() {
    switch(colorModeSetting.getCurrentMode()) {
        case "White": return "§f";
        case "Blue": return "§b";
        case "Green": return "§a";
        case "Gold": return "§6";
        case "Rainbow": return getRainbowColor();
        case "Gradient": return getGradientColor();
        case "Speed Based": return getColorBySpeed(calcBPS());
        default: return "§f";
    }
}

function getSpeedBar(value, max, type) {
    var barLength = 20;
    var scale = type === "jump" ? 2 : (type === "vertical" ? 1 : 20);
    var filled = Math.min(Math.floor((value / scale) * barLength), barLength);
    var bar = "";
    var color = getColorPrefix();
    
    switch(barStyleSetting.getCurrentMode()) {
        case "Simple":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "─";
                else if(i === filled) bar += color + "│";
                else bar += "§8─";
            }
            break;
        case "Detailed":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "█";
                else if(i === filled) bar += color + "▓";
                else bar += "§8░";
            }
            break;
        case "Arrows":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "»";
                else if(i === filled) bar += color + "›";
                else bar += "§8·";
            }
            break;
        case "Waves":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "∼";
                else if(i === filled) bar += color + "≈";
                else bar += "§8-";
            }
            break;
        case "Dots":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "●";
                else if(i === filled) bar += color + "○";
                else bar += "§8·";
            }
            break;
        case "Blocks":
            for(var i = 0; i < barLength; i++) {
                if(i < filled) bar += color + "■";
                else if(i === filled) bar += color + "□";
                else bar += "§8▢";
            }
            break;
    }
    return bar;
}

function getExtraInfo() {
    var info = "";
    if(showTimerSetting.isActive()) {
        var time = new Date().getTime() - motionData.startTime;
        info += "§8[" + formatTime(time) + "]";
    }
    if(showAverageSetting.isActive()) {
        if(info !== "") info += " ";
        info += "§8[AVG: " + formatNumber(motionData.averageSpeed) + "]";
    }
    if(directionSetting.isActive() && motionData.direction !== "") {
        if(info !== "") info += " ";
        info += "§8[" + motionData.direction + "]";
    }
    return info !== "" ? " " + info : "";
}

function formatDisplay() {
    var color = getColorPrefix();
    var style = styleSetting.getCurrentMode();
    var mode = modeSetting.getCurrentMode();
    var current = calcBPS();
    var result = "";
    var extraInfo = getExtraInfo();
    
    switch(style) {
        case "Modern":
            result = "§8╔══" + color + " Motion Graph " + "§8══╗" + extraInfo + "\n";
            if(mode === "BPS" || mode === "Combined" || mode === "Full") {
                result += "§8│ " + color + "Speed: " + formatNumber(current) + " §8(" + formatNumber(motionData.maxSpeed) + ") §8│\n";
                result += "§8│ " + getSpeedBar(current, motionData.maxSpeed, "speed") + " §8│\n";
            }
            if(mode === "Jump" || mode === "Combined" || mode === "Full") {
                result += "§8│ " + color + "Jump: " + formatNumber(motionData.jumpHeight) + " §8(" + formatNumber(motionData.maxJump) + ") §8│\n";
                result += "§8│ " + getSpeedBar(motionData.jumpHeight, motionData.maxJump, "jump") + " §8│\n";
            }
            if(mode === "Vertical" || mode === "Full") {
                var velY = LocalPlayer.getVelocityY();
                result += "§8│ " + color + "Vertical: " + formatNumber(velY) + " §8(" + formatNumber(motionData.maxVertical) + ") §8│\n";
                result += "§8│ " + getSpeedBar(Math.abs(velY), motionData.maxVertical, "vertical") + " §8│\n";
            }
            result += "§8╚" + "═".repeat(20) + "╝";
            break;
            
        case "Minimal":
            if(mode === "BPS" || mode === "Combined" || mode === "Full") {
                result += color + "BPS: " + formatNumber(current) + extraInfo + "\n";
                result += getSpeedBar(current, motionData.maxSpeed, "speed") + "\n";
            }
            if(mode === "Jump" || mode === "Combined" || mode === "Full") {
                result += color + "↑ " + formatNumber(motionData.jumpHeight) + "\n";
                result += getSpeedBar(motionData.jumpHeight, motionData.maxJump, "jump") + "\n";
            }
            if(mode === "Vertical" || mode === "Full") {
                result += color + "⇅ " + formatNumber(LocalPlayer.getVelocityY()) + "\n";
                result += getSpeedBar(Math.abs(LocalPlayer.getVelocityY()), motionData.maxVertical, "vertical");
            }
            break;
            
        case "Detailed":
            result = "§8┌─" + color + " Motion Info " + "§8─┐" + extraInfo + "\n";
            if(mode === "BPS" || mode === "Combined" || mode === "Full") {
                result += "§8├ " + color + "Speed: " + formatNumber(current) + "\n";
                result += "§8├ " + color + "Max: " + formatNumber(motionData.maxSpeed) + "\n";
                result += "§8├ " + getSpeedBar(current, motionData.maxSpeed, "speed") + "\n";
            }
            if(mode === "Jump" || mode === "Combined" || mode === "Full") {
                result += "§8├ " + color + "Height: " + formatNumber(motionData.jumpHeight) + "\n";
                result += "§8├ " + color + "Max: " + formatNumber(motionData.maxJump) + "\n";
                result += "§8├ " + getSpeedBar(motionData.jumpHeight, motionData.maxJump, "jump") + "\n";
            }
            if(mode === "Vertical" || mode === "Full") {
                var velY = LocalPlayer.getVelocityY();
                result += "§8├ " + color + "Vertical: " + formatNumber(velY) + "\n";
                result += "§8├ " + color + "Max: " + formatNumber(motionData.maxVertical) + "\n";
                result += "§8├ " + getSpeedBar(Math.abs(velY), motionData.maxVertical, "vertical");
            }
            result += "\n§8└" + "─".repeat(20) + "┘";
            break;
    }
    
    return result;
}

function displayInfo() {
    Level.showTipMessage(formatDisplay());
}

function updateData() {
    var currentBPS = calcBPS();
    var currentY = LocalPlayer.getPositionY();
    var velY = LocalPlayer.getVelocityY();
    
    motionData.speeds.push(currentBPS);
    if(motionData.speeds.length > 20) motionData.speeds.shift();
    
    motionData.vertical.push(velY);
    if(motionData.vertical.length > 20) motionData.vertical.shift();
    
    if(!LocalPlayer.isOnGround()) {
        var currentJumpHeight = currentY - motionData.lastGroundY;
        motionData.jumpHeight = Math.max(currentJumpHeight, 0);
        motionData.jumps.push(motionData.jumpHeight);
    } else {
        if(autoResetSetting.getCurrentMode() === "Ground") {
            clearMaxValues();
        }
        motionData.lastGroundY = currentY;
        motionData.jumpHeight = 0;
        motionData.jumps = [];
    }
    
    if(motionData.jumps.length > 20) motionData.jumps.shift();
    
    if(currentBPS > motionData.maxSpeed) motionData.maxSpeed = currentBPS;
    if(motionData.jumpHeight > motionData.maxJump) motionData.maxJump = motionData.jumpHeight;
    if(Math.abs(velY) > motionData.maxVertical) motionData.maxVertical = Math.abs(velY);
    
    motionData.direction = directionSetting.isActive() ? getDirection() : "";
    
    var sum = 0;
    for(var i = 0; i < motionData.speeds.length; i++) sum += motionData.speeds[i];
    motionData.averageSpeed = sum / motionData.speeds.length;
    
    motionData.rainbowHue = (motionData.rainbowHue + 2) % 360;
    
    if(autoResetSetting.getCurrentMode() === "Time") {
        motionData.resetTimer++;
        if(motionData.resetTimer >= resetTimeSetting.getCurrentValue() * 20) {
            clearMaxValues();
            motionData.resetTimer = 0;
        }
    }
}

function onLevelTick() {
    if (!motionGraph.isActive() || !enabledSetting.isActive()) return;
    
    var currentTime = new Date().getTime();
    if (currentTime - motionData.lastUpdate > (1000 / (updateSetting.getCurrentValue() * 20))) {
        updateData();
        displayInfo();
        motionData.lastUpdate = currentTime;
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(motionGraph);
    clearData();
}

function onServerConnect() {
    clearData();
}

function onScreenChange() {
    clearData();
}