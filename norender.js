const module = new Module("NO RENDER+", true, true, ModuleCategory.MISC);
const name = new StateSetting("Name tags", false);
const flame = new StateSetting("Flame", false);
const part = new StateSetting("Particles", false);
const screen = new StateSetting("Screen texts", false);
const boss = new StateSetting("Boss bar", false);
const control = new StateSetting("Control buttons", false);
const left = new StateSetting("Left hand", false);
module.addSettings([name, flame, part, screen, boss, control, left]);

let namee = name.isActive();
let flamee = flame.isActive();
let partt = part.isActive();
let scren = screen.isActive();
let bosss = boss.isActive;
let cont = control.isActive();
let lef = left.isActive();


name.setOnStateToggleListener(function(namee) {
    if (!namee) {
        Memory.write(15192066, [216, 244, 146, 230]);
    }
});


flame.setOnStateToggleListener(function(flamee) {
if (!flamee) {
                Memory.write(22391252, [208, 248]);
}
});

part.setOnStateToggleListener(function(partt) {
if (!partt) {
        Memory.write(15176710, [220, 244, 254, 226]);
        Memory.write(15176616, [220, 244, 32, 227]);

        }
});

screen.setOnStateToggleListener(function(scren) {
if (!scren) {
        Memory.write(13651294, [60, 246, 142, 231]);
        Memory.write(13651244, [72, 246, 254, 224]);
        Memory.write(13659550, [70, 246, 12, 227]);
        Memory.write(13659562, [70, 246, 12, 227]);
        Memory.write(12227840, [152, 247, 188, 227]);
        }
        });
boss.setOnStateToggleListener(function(bosss) {
if (!bosss) {
                Memory.write(12486174, [0, 105]);

                }
                });
control.setOnStateToggleListener(function(cont) {
if (!cont) {
Memory.write(15069668, [245, 244, 78, 229]);
}
});

left.setOnStateToggleListener(function(lef) {
if (!lef) {
Memory.write(15129292, [231, 244, 104, 227]);
}
});

function onLevelTick() {
if (module.isActive()) {
if (name.isActive()) {
            Memory.write(15192066, [0, 191, 0, 191]);
         }

if (flame.isActive()) {
            Memory.write(22391252, [16, 189]);
}
        
if (part.isActive()) {
            Memory.write(15176710, [0, 191, 0, 191]);
            Memory.write(15176616, [0, 191, 0, 191]);
        }
        
if (screen.isActive()) {
            Memory.write(13651294, [0, 191, 0, 191]);
            Memory.write(13651244, [0, 191, 0, 191]);
            Memory.write(13659550, [0, 191, 0, 191]);
            Memory.write(13659562, [0, 191, 0, 191]);
            Memory.write(12227840, [0, 191, 0, 191]);
        }
        
if (boss.isActive()) {
            Memory.write(12486174, [16, 189]);
        }
    
if (control.isActive()) {
            Memory.write(15069668, [0, 191, 0, 191]);
        }
        
if (left.isActive()) {
            Memory.write(15129292, [0, 191, 0, 191]);
        }
        }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}