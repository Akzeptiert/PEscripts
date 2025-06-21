

let anti = false;

let targe = -1;

let tel = false;

let targettt = -1;

function onTeleport(targett, x, y, z) {
if (anti) {
let dis = LocalPlayer.getDistanceTo(targett);

if (dis < porno) {
if (targett == targe) {
} else {
targettt = targett;
tel = true;
}
}
}
}

function onLevelTick() {
    if (Module.isActive("AntiBot")) {
let tele = Setting.isActive("AntiBot", "Teleport check");

let porno = Setting.getCurrentValue("AntiBot", "Radius");

if (tele) {

anti = true;

}

}
if (anti) {
Player.setCollisionSize(targe, 3, 3);
}
}

function onAttack(player) {
if (anti) {
targe = player;
}
}

let timero = 0;

function onSendPacket(name, address) {
    if (name == PacketType.INTERACT_PACKET && (Memory.getInt(address, 12) & 0xff) == 2 && anti && tel) {
       let target = Memory.getInt(address, 12+4)
       
       if (target == targettt) {
       if (targettt !== targe) {
               preventDefault()
       Level.displayClientMessage("§l§6Var§fiable > §rAntiBot > Bot appeared.");
        }
        }
            if (Module.isActive("AntiBot")) {
                if (Setting.isActive("AntiBot", "Hitbox check")) {
                if (Module.isActive("HitBoxes") {
                let poro = Setting.getCurrentValue("HitBoxes", "Horizontal");
                let poo = Setting.getCurrentValue("HitBoxes", "Vertical");
                timero++
                if (timero > 1) {
                Player.setCollisionSize(target, 0.5, 0.5);
                }
                if (timero > 20) {
                Player.setCollisionSize(target, poro, poo);
                Level.displayClientMessage("ok");
                timero = 0;
                    }
                } else {
                Player.setCollisionSize(target, 0.7, 0.7);
                }
            }
        }
    }
}