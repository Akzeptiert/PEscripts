let or = false;



function onLevelTick() {
    if (Module.isActive("TriggerBot")) {
or = true;
} else {
or = false;
}
if (or) {
let cps = Setting.getCurrentValue("TriggerBot", "CPS");

let hm = LocalPlayer.getPointedPlayer();

let timer = 0;

let timerr = 0;

let ji = Setting.isActive("TriggerBot", "Random");

let ij = Setting.getCurrentValue("TriggerBot", "Minimal CPS");

let ki = Setting.getCurrentValue("TriggerBot", "Maximal CPS");

timer++

if (timer < hm) { return; } 
LocalPlayer.attack(hm);
timer = 0;

if (ji) {
let randomCPS = Math.floor(Math.random() * (ki - ij + 1)) + ij;

timerr++

if (timerr < randomCPS) { return; } 
LocalPlayer.attack(hm);
timerr = 0;

}
}
}