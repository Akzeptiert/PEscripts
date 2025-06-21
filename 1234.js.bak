var module = new Module("PacketLog", true, true, ModuleCategory.OTHER);

const directories = [
    "/storage/emulated/0/Fonts/"

];

function getCurrentTime() {
    let date = new java.util.Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (hours < 10 ? "0" + hours : hours) + ":" +
           (minutes < 10 ? "0" + minutes : minutes) + ":" +
           (seconds < 10 ? "0" + seconds : seconds);
}

function createAndWriteToFile(directoryPath, textToWrite) {
    const randomName = "дамп.txt";
    const filePath = directoryPath + randomName;
    try {
        const file = new java.io.File(filePath);
        const append = true; // Включаем режим добавления
        const writer = new java.io.FileWriter(file, append);
        const bufferedWriter = new java.io.BufferedWriter(writer);
        bufferedWriter.write(textToWrite + "\n"); // Добавляем новую строку после каждого текста
        bufferedWriter.close();
    } catch (e) {
        // Обработка ошибок
        e.printStackTrace();
    }
}


function onSendPacket(name, address) {
  if(!module.isActive()) {
    return true; 
  }

  let time = getCurrentTime();
  
    if (name == PacketType.INTERACT_PACKET && (Memory.getInt(address, 12) & 0xff) == 2) {
        let target = Memory.getInt(address, 12+4)
        
        let namer = Player.getNameTag(target);
        
     const textToWrite = namer + " " + time + " " + target;
                createAndWriteToFile(directories, textToWrite);
  Level.displayClientMessage(namer + " " + time + " " + target + "\n");

  return true;
}
}
function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}