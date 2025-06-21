let module = new Module("Браузер", true, true, ModuleCategory.OTHER).setOnClickListener((view) => openPage(textField2.getText()));

let textField2 = new TextFieldSetting("Url", "ссылка", "https://google.com/", "buttonText");
module.addSetting(textField2);

function openPage(url){
print("открываем ресурс...\nСкрипт от CondoM");
var ctx = getContext();
ctx.runOnUiThread(new java.lang.Runnable({run: function(){
    var webs = new android.webkit.WebView(ctx);
    var webset = webs.getSettings();
    webset.setJavaScriptEnabled(true);
    webs.setWebChromeClient(new android.webkit.WebChromeClient());
    webs.setWebViewClient(new android.webkit.WebViewClient());
    webs.loadUrl(url);
    new android.app.AlertDialog.Builder(ctx).setView(webs).show();
    }}));
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
