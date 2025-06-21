var autoFood = new Module("Auto Food", true, true, ModuleCategory.PLAYER);
var autoSwapSetting = new StateSetting("Auto Swap", true);

autoFood.addSettings([autoSwapSetting]);

var eating = false;
var lastSlot = 0;

function onScriptEnabled() {
    ModuleManager.addModule(autoFood);
}

function isFood(slot) {
    var duration = Item.getUseDuration(slot);
    return duration > 0;
}

function findFood() {
    for(var i = 0; i < 9; i++) {
        if(isFood(i)) return i;
    }
    return -1; 
}

function onLevelTick() {
    if(!autoFood.isActive()) return;

    var currentSlot = Inventory.getSelectedSlot();
    var foodSlot = findFood();

    if(autoSwapSetting.isActive() && foodSlot != -1 && !eating) {
        lastSlot = currentSlot;
        Inventory.setSelectedSlot(foodSlot);
        LocalPlayer.longClick();
        eating = true;
    } else if(!autoSwapSetting.isActive() && isFood(currentSlot) && !eating) {
        LocalPlayer.longClick();
        eating = true;
    }

    if(eating) {
        if(!isFood(currentSlot)) {
            eating = false;
            if(autoSwapSetting.isActive()) {
                Inventory.setSelectedSlot(lastSlot);
            }
        } else {
            LocalPlayer.longClick();
        }
    }
}

function onScreenChange() {
    eating = false;
    if(autoSwapSetting.isActive()) {
        Inventory.setSelectedSlot(lastSlot);
    }
}

function onServerConnect() {
    eating = false;
}

function onServerDisconnect() {
    eating = false;
}