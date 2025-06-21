const timerModule = new Module("GameInfo", true, true, ModuleCategory.PLAYER);

const ctx = getContext();
var textView = null;
var titleTextView = null;
var popupWindow = null;
var timerHandler = null;
var colorChangeHandler = null;
let popupHeight;
let popupWidth;
let timer = 0;
let color;

function dip2px(dp) {
    return Math.ceil(ctx.getResources().getDisplayMetrics().density * dp);
}

let exampleText = "[+] Update Killaura, [+] Fix FreeCam, [+] Fix AntiBot, [+] Fix TriggerBot, [+] Update ModuleManager, [+] New DamageFly, [+] New Script Report, [+] New Notifications, [+] New Killaura no Flag, [+] New TargetHud, [+] Edition Faker FullFix, [+] New Fly, [+] New Xray, [+] New ChatBot, [+] New BedDestroyer";

function createAndShowTextView() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                if (textView !== null && titleTextView !== null) {
                    return;
                }
                
                                    if (!getScreenName().equals("start_screen")) {
                                    return;
                                    }
                
                let commaCount = (exampleText.match(/,/g) || []).length; // считаем количество запятых
                
                let lines = exampleText.split(',').map(function(item) {
                    return item.trim();
                }).join('\n');
                
                let longestWord = exampleText.split(',').map(function(item) {
                return item.trim(); // убираем лишние пробелы
                }).reduce(function(longest, current) {
                return current.length > longest.length ? current : longest; // находим самое длинное слово
                }, "");
                
                let longestWordLength = longestWord.length;
                
                color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]);  // 🌈

                // Создаем TextView
                titleTextView = new android.widget.TextView(ctx);
                titleTextView.setText("            Change Log");
                titleTextView.setPadding(dip2px(10), dip2px(2), dip2px(10), dip2px(2));
                titleTextView.setAlpha(1.0);
                titleTextView.setTextSize(13);
                titleTextView.setTextColor(android.graphics.Color.WHITE);

                // Создаем разделитель
                let divider = new android.view.View(ctx);
                let dividerParams = new android.widget.LinearLayout.LayoutParams(
                    android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                    dip2px(1)
                );
                dividerParams.bottomMargin = dip2px(3);
                divider.setLayoutParams(dividerParams);
                divider.setBackgroundColor(android.graphics.Color.WHITE);
                
                textView = new android.widget.TextView(ctx);
                textView.setText(lines);
                textView.setPadding(dip2px(10), dip2px(10), dip2px(10), dip2px(10));
                textView.setAlpha(1.0);
                textView.setTextSize(13);
                textView.setTextColor(color);

                // Создаем LinearLayout
                let linearLayout = new android.widget.LinearLayout(ctx);
                linearLayout.setOrientation(android.widget.LinearLayout.VERTICAL);

                let shape = new android.graphics.drawable.GradientDrawable();
                shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
                shape.setColor(android.graphics.Color.argb(150, 0, 0, 0)); // полупрозрачный фон
                shape.setCornerRadius(dip2px(10));
                linearLayout.setBackgroundDrawable(shape);
                
                linearLayout.setClickable(false);
                linearLayout.setFocusable(false);

                // Добавляем элементы в layout
                linearLayout.addView(titleTextView);
                linearLayout.addView(divider);
                linearLayout.addView(textView);
                
                let po = longestWordLength - 5;

                if (longestWordLength > 28) {
                popupWidth = dip2px(165 + po);
                }
                
                if (longestWordLength < 28) {
                popupWidth = dip2px(165);
                }
                
                let op = 13 * commaCount;
                
                if (commaCount > 0) {
                popupHeight = dip2px(105 + op);
                }
                
                if (commaCount === 0) {
                popupHeight = dip2px(105);
                }
                
                popupWindow = new android.widget.PopupWindow(
                    linearLayout,
                    popupWidth,
                    popupHeight,
                    false
                );

                // Делаем PopupWindow прозрачной для кликов
                popupWindow.setClippingEnabled(false); // Позволяет кликам проходить через окно
                popupWindow.setTouchable(false); // Не перехватывает касания

                // Вычисляем координаты для центрирования
                let displayMetrics = ctx.getResources().getDisplayMetrics();
                let screenWidth = displayMetrics.widthPixels;
                let screenHeight = displayMetrics.heightPixels;

                let xOffset = -(screenWidth / 2) + popupWidth / 2;
                let yOffset = -(screenHeight / 2) + popupHeight / 2;

                // Отображаем PopupWindow
                popupWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, xOffset, yOffset);

            } catch (e) {
                showToast(e.toString(), 5000);
            }
        }
    }));
}

function showToast(message, duration) {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            let toast = android.widget.Toast.makeText(ctx, message, android.widget.Toast.LENGTH_LONG);
            toast.setDuration(duration);
            toast.show();
        }
    }));
}

function clearMenu() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                if (popupWindow !== null) {
                    popupWindow.dismiss(); // закрываем PopupWindow
                    popupWindow = null;    // сбрасываем переменную
                }

                textView = null;          // очищаем TextView
                titleTextView = null;     // очищаем заголовок
                timer = 0;                // сбрасываем таймер
                
                
            } catch (e) {
                showToast(e.toString(), 5000);
            }
        }
    }));
}

let ok;
let okk;

function onFastTick() {
    if (timerModule.isActive()) {
    ok = true;
    okk = true;
        if (getScreenName().equals("start_screen")) {
            createAndShowTextView();
            
            // Обновляем цвет текста
            color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]);
            if (textView !== null) {
                ctx.runOnUiThread(new java.lang.Runnable({
                    run: function() {
                        textView.setTextColor(color);
                        textView.setShadowLayer(45, 0, 0, color);
                        titleTextView.setShadowLayer(85, 0, 0, color);
                    }
                }));
            }
        } else {
            clearMenu();
        }
    } else {
    okk = false;
    }
if (ok && !okk) {
clearMenu();
}
}

function onScriptEnabled() {
    ModuleManager.addModule(timerModule);
}

function onScriptDisabled() {
    ModuleManager.removeModule(timerModule);
}
