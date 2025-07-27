const module = new Module("TestModule", true, true, ModuleCategory.OTHER); 

let timer = 0; 
let view = undefined; 
let color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]); 

module.setOnClickListener(function(view2) { 
    view = view2; 
}); 

function onFastTick() { 
    timer++; 
    if (!module.isActive() || timer < 50 ||  view == undefined) { return; }  // последняя проверка обязательно нужна
    timer = 0; 
    color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]);  // 🌈
    view.setTextColor(color); 
    view.setShadowLayer(45, 0, 0, color);  // ЖЕЛАТЕЛЬНО НИЧЕГО НЕ МЕНЯТЬ!!! если поставить радиус слишком большой, то "тень" не вылезет за пределы TextView, будет выглядеть некрасиво!!!!!
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 