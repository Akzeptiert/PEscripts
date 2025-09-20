const module = new Module("Intercom", true, false, ModuleCategory.OTHER);
const nickname = new TextFieldSetting("Nickname", "turtl3", "noob");

var timer = 0;
var isParsing = false;
var lastUpdate = 0;

function getUpdates(a) {
    try {
        isParsing = true;
        
        let url = java.net.URL("http://80.66.89.129:3000/getupdates?start=" + a);
        let conn = url.openConnection();
        let buffReader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
        
        let response = "";
        for (let line = ""; line != null; line = buffReader.readLine()) {
            response = response + line;
        }
        
        buffReader.close();
        conn.disconnect();
        isParsing = false;
        
        response = JSON.parse(response);
        messages = [];
        
        if (response.length > 0) {
            for (update of response) {
                messages.push(update.content);
            }
            return [response.reverse()[0].id, messages];
        } else {
            return [lastUpdate - 1, []];
        }
    } catch (e) {
        print(e);
    }
}

function sendUpdate(a) {
    let url = java.net.URL("http://80.66.89.129:3000/sendupdate?content=" + a);
    return url.openConnection().getResponseCode();
}

function onLevelTick() {
    timer++;
    if (!module.isActive() || 30 > timer) {
        return;
    }
    timer = 0;
    
    new java.lang.Thread(new java.lang.Runnable({
        "run": function() {
            try {
                updates = getUpdates(lastUpdate);
                lastUpdate = updates[0] + 1;
                
                for (message of updates[1]) {
                    Level.displayClientMessage("§9[IC]§7 " + message);
                }
            } catch (e) {
                print(e);
            }
        }
    })).start();
}

function onChat(a) {
    if (!module.isActive() || !a.startsWith(".ic ")) {
        return;
    }
    
    preventDefault();
    
    new java.lang.Thread(new java.lang.Runnable({
        "run": function() {
            if (sendUpdate(nickname.getText() + ": " + a.slice(4)) != 200) {
                Level.displayClientMessage("§c[IC] §lkakoe-to gavno");
            }
        }
    })).start();
}

function onScriptEnabled() {
    module.addSetting(nickname);
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
