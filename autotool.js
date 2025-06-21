var module = new Module("АвтоВыбор", true, true, ModuleCategory.PLAYER);
var setting = new StateSetting("Ножницы", true); module.addSetting(setting);

const wood = [5,17,53,47,54,58,63,64,65,68,72,85,86,96,99,100,103,107,125,126,134,143,146,162,163,164,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,25,84,91,127,131,135,136,176,177,199,200];
const stone = [1,4,14,15,16,21,22,23,24,27,28,41,42,43,45,48,49,52,56,57,61,62,66,67,69,70,71,73,74,77,79,87,97,98,101,108,109,112,113,114,116,117,118,121,129,130,133,138,139,145,147,148,151,152,153,154,155,156,157,158,159,168,172,173,178,179,180,181,182,201,202,203,204,205,206,212,213,214,215,216,219,220,221,223,222,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,128,140,167,174,198,218]; // Ох, зря я туда полез...
const grass = [2,3,12,13,60,78,80,82,88,110,208,252]; const wool = [18,30,31,32,35,37,38,39,40,106,161,171];

const axes = [258,271,275,279,286]; const pickaxes = [257,270,274,278,285];
const swords = [267,268,272,276,283]; const shovels = [256,269,273,277,284];
const scissors = 359;

var lastBlock = 0;

function onLevelTick() {
    if (module.isActive()) {
        var block = Block.getID(LocalPlayer.getPointedVector()[0], LocalPlayer.getPointedVector()[1]-1, LocalPlayer.getPointedVector()[2]);
        if (block == lastBlock ) { return }
        if (wood.includes(block)) {
            for (var slot = 0; slot < 9; slot++) {
                if (axes.includes(Item.getID(slot))) {
                    Inventory.setSelectedSlot(slot);
                    lastBlock = block;
                    return;
                }
            }
        } else if (stone.includes(block)) {
            for (var slot = 0; slot < 9; slot++) {
                if (pickaxes.includes(Item.getID(slot))) {
                    Inventory.setSelectedSlot(slot);
                    lastBlock = block;
                    return;
                }
            }
        } else if (grass.includes(block)) {
            for (var slot = 0; slot < 9; slot++) {
                if (shovels.includes(Item.getID(slot))) {
                    Inventory.setSelectedSlot(slot);
                    lastBlock = block;
                    return;
                }
            }
        } else if (setting.isActive() && wool.includes(block)) {
            for (var slot = 0; slot < 9; slot++) {
                if (scissors == Item.getID(slot)) {
                    Inventory.setSelectedSlot(slot);
                    lastBlock = block;
                    return;
                }
            }
        }
    }
}

function onScriptEnabled() {
   ModuleManager.addModule(module);
}

function onScriptDisabled() {
   ModuleManager.removeModule(module);
}