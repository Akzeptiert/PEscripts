const module = new Module("ALL NICKS", true, true, ModuleCategory.MISC);
var button = new ButtonSetting("Отправить", function(view) {
    let serverData = nicks(ii, pp);
    if (serverData && serverData.players) {
        let players = serverData.players.list.join(", ");
        Level.displayClientMessage(players);
    } else {
        Level.displayClientMessage("Не удалось получить список игроков.");
    }
});

module.addSettings([button]);

let ii;
let BufferedReader = java.io.BufferedReader;
let pp;

function nicks(ip, port) {
    try {
        if (android.os.Build.VERSION.SDK_INT > 9) {
            let gfgPolicy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(gfgPolicy);
        }
        
        let url;
        if (ip == null || port == null) {
            url = new URL("https://api.mcsrvstat.us/bedrock/2/" + Server.getAddress() + ":" + Server.getPort());
        } else {
            url = new URL("https://api.mcsrvstat.us/bedrock/2/" + ip + ":" + port);
        }
        
        

        // Отладка - выводим URL
        Level.displayClientMessage("Requesting data from URL: " + url.toString());

        let connection = url.openConnection();
        let inputStream = connection.getInputStream();
        let bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        
        // Отладка - читаем и выводим полученный JSON
        let response = bufferedReader.readLine();
        Level.displayClientMessage("Response: " + response);

        let data = JSON.parse(response);

        // Отладка - проверка структуры данных
        Level.displayClientMessage("Parsed Data: ", data);

        return data;
    } catch (e) {
        // Отладка - выводим ошибку
        Level.displayClientMessage(ip + ":" + port);
        Level.displayClientMessage("Error in nicks function: ", e);
        Level.displayClientMessage("Web.getServerData", e);
        return null;
    }
}

function onServerConnect(addr, port) {
        getContext().getSystemService(android.content.Context.CLIPBOARD_SERVICE).setText(addr+":"+port);
    ii = addr;
    pp = port;
    // Отладка - выводим адрес и порт
    Level.displayClientMessage("Connected to server: " + ii + ":" + pp);
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
