const module = new Module("NoDamageFall", true, true, ModuleCategory.MOVEMENT);

let ok = false;
let okk = false;
let cleanMessage;
let op = false;
let time = 0;

function getBlockUnderPlayer() {
if (module.isActive()) {
    let x = Math.floor(LocalPlayer.getPositionX());
    let y = Math.floor(LocalPlayer.getPositionY()) - 4;
    let z = Math.floor(LocalPlayer.getPositionZ());
    return Block.getID(x, y, z);
    }
}

function onLevelTick() {
if (module.isActive()) {
if (LocalPlayer.isFalling()) {
let y = getBlockUnderPlayer();
let yy = getBlockUnderPlayer();

if (yy === 0) {
op = true;
}

if (y > 0) {
if (op) {
ok = true;
if (ok) {
Level.displayClientMessage("Удар!");
okk = true;
}
}
} else {
okk= false;
ok = false;
}
}
}
}

function onSendPacket(a, b) {
if (okk && module.isActive()) {
        if (a == PacketType.MOVE_PLAYER_PACKET) {
        let i28 = Memory.getFloat(b, 28);
time++
if (time < 8) {
time = 0
                    Memory.setFloat(b, 28, LocalPlayer.getPositionY() - 100000000000000);
                    Memory.setFloat(b, 28, LocalPlayer.getPositionY() - 2);
                    Memory.setFloat(b, 28, LocalPlayer.getPositionY());
                    }
        }
        if (a == PacketType.PLAYER_ACTION_PACKET) {
        print("a");
        preventDefault();
        }
}
}

function onFastTick() {
if (module.isActive()) {
if (LocalPlayer.isFalling()) {
if (cleanMessage != null) {
  if (cleanMessage.includes("Удар")) {
  op = false;
ok = false;
okk = false;
  }
  }
}
}
}

function onReceiveServerMessage(message) {
if (module.isActive()) {
  // Удаляет скучный цветной текст
  cleanMessage = message.replace(/\§[0-9A-FK-OR]/ig, '');  


  // Проверяет, содержит ли сообщение команду /roll
}
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}