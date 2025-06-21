const module = new Module("amm", true, true, ModuleCategory.MOVEMENT);

let joj= "";
let get;

function bpd() {
    var playerSpeedX = Player.getVelocityX(targett);
    var playerSpeedZ = Player.getVelocityZ(targett);
    var playerSpeed = Math.round((Math.sqrt(Math.pow(playerSpeedX, 2) + Math.pow(playerSpeedZ, 2)) * 100)) / 100;
    return playerSpeed;
}
function bpdd() {
    return Math.hypot(Player.getVelocityX(targett), Player.getVelocityZ(targett));
}

function onSendPacket(name, address) {
if (module.isActive()) {
    if (name == PacketType.INTERACT_PACKET && (Memory.getInt(address, 12) & 0xff) == 2) { 
        let target = Memory.getInt(address, 12+4)
       
        
        joj += "Id " + target;
        joj += "\n";
        
                Level.displayClientMessage(joj);
                
        let statusFlag = Player.getStatusFlag(target, 5);
        let stat = Player.getStatusFlag(target, 21);
        let s = Player.getStatusFlag(target, 30);
        let st = Player.getStatusFlag(target, 16);
        let p = Player.isInvisible(target);
        let v = Player.isInWall(target);
        let r = Player.isImmobile(target);
        let w = Player.canShowNameTag(target);
        
        let playerName = Player.getNameTag(target); // Получаем имя игрока
    
    if (w || r || bpd == 0 || bpdd == 0 || v || playerName === "" || p || statusFlag || stat || s || st || target == 0) {
    addFriend(target);
    }
}
}
}

function onTeleport(get, x, y, z) {
if (module.isActive()) {
    if (!Player.isOnGround(playerID)) {
    addFriend(playerID);
    }
  }
}
    
let currentTarget = null; // Текущая цель
let lastTarget = null;    // Предыдущая цель

function onAttack(targett) {
    if (!module.isActive()) {
        return;
    }
    
    get = targett;

    // Если цель изменилась
    if (currentTarget !== targett) {
        // Проверяем, жив ли предыдущий игрок
        if (Player.isAlive(currentTarget)) {
            addFriend(targett);
        }

        // Обновляем цели
        lastTarget = currentTarget;
        currentTarget = targett;
    }
}



function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}