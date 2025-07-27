const module = new Module("Pixel", true, true, ModuleCategory.OTHER);

const xPosition = new SliderSetting("X", [50, 0, 900, 1]);
const yPosition = new SliderSetting("Y", [30, 0, 700, 1]);
const cornerRadius = new SliderSetting("Corner Radius", [10, 0, 100, 10]);

const redColor = new SliderSetting("Red", [36, 0, 255, 1]);
const greenColor = new SliderSetting("Green", [35, 0, 255, 1]);
const blueColor = new SliderSetting("Blue", [35, 0, 255, 1]);
const alphaColor = new SliderSetting("Transparency", [255, 0, 255, 1]);

module.addSettings([xPosition, yPosition, cornerRadius, redColor, greenColor, blueColor, alphaColor]);

const context = getContext();

function dip2px(dip) {
    const density = context.getResources().getDisplayMetrics().density;
    return Math.round(dip * density);
}

const pixelSize = dip2px(4);
const canvasSize = pixelSize * 15;

const imagePath = "/storage/emulated/0/Photo/Steve.png";

function drawImage(canvas) {
    try {
        const options = new android.graphics.BitmapFactory.Options();
        options.inScaled = false;
        options.inPremultiplied = false;

        const bitmap = android.graphics.BitmapFactory.decodeFile(imagePath, options);
        if (bitmap == null) {
            return;
        }

        const scaledBitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, canvasSize, canvasSize, true);
        canvas.drawBitmap(scaledBitmap, 0, 0, new android.graphics.Paint());
    } catch (e) {
        // You might want to add more robust error handling here
    }
}

let popupWindow, imageView, backgroundWindow;
let playerHpTextView;
let playerSpeedTextView;
let cpsTextView;
let backgroundShape;

let lastClickTimes = [];
const CPS_WINDOW_MS = 1000;

let wasModuleActive = false;

function updatePixelWindowAppearance() {
    // Ensure UI updates happen on the main thread
    context.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                if (backgroundWindow && backgroundWindow.getContentView() instanceof android.widget.FrameLayout) {
                    const backgroundView = backgroundWindow.getContentView().getChildAt(0);
                    if (backgroundView instanceof android.view.View && backgroundShape) {
                        const currentRed = redColor.getCurrentValue();
                        const currentGreen = greenColor.getCurrentValue();
                        const currentBlue = blueColor.getCurrentValue();
                        const currentAlpha = alphaColor.getCurrentValue();
                        const backgroundColor = android.graphics.Color.argb(currentAlpha, currentRed, currentGreen, currentBlue);

                        backgroundShape.setColor(backgroundColor);
                        backgroundShape.setCornerRadius(dip2px(cornerRadius.getCurrentValue()));
                        backgroundView.setBackgroundDrawable(backgroundShape); // Ensure Drawable is updated
                        backgroundWindow.update(xPosition.getCurrentValue(), yPosition.getCurrentValue(), -1, -1);
                        popupWindow.update(xPosition.getCurrentValue(), yPosition.getCurrentValue(), -1, -1);
                    }
                }
            } catch (e) {
                print("Error in updatePixelWindowAppearance: " + e);
            }
        }
    }));
}

function createPopup(playerHp, playerSpeed, currentCps) {
    context.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                // If windows already exist, just update their content and appearance
                if (popupWindow && backgroundWindow) {
                    if (playerHpTextView && playerHp !== undefined) {
                        playerHpTextView.setText("HP| " + Math.floor(playerHp));
                    }
                    if (playerSpeedTextView && playerSpeed !== undefined) {
                        playerSpeedTextView.setText("Speed| " + playerSpeed + " b/s");
                    }
                    if (cpsTextView && currentCps !== undefined) {
                        cpsTextView.setText("CPS| " + currentCps);
                    }
                    // This call will now be safely run on the UI thread
                    updatePixelWindowAppearance();
                    return;
                }

                // If windows don't exist, create them
                const currentRed = redColor.getCurrentValue();
                const currentGreen = greenColor.getCurrentValue();
                const currentBlue = blueColor.getCurrentValue();
                const currentAlpha = alphaColor.getCurrentValue();
                const backgroundColor = android.graphics.Color.argb(currentAlpha, currentRed, currentGreen, currentBlue);

                const backgroundLayout = new android.widget.FrameLayout(context);
                const backgroundView = new android.view.View(context);

                const cornerRadiusPx = dip2px(cornerRadius.getCurrentValue());
                backgroundShape = new android.graphics.drawable.GradientDrawable();
                backgroundShape.setColor(backgroundColor);
                backgroundShape.setCornerRadius(cornerRadiusPx);
                backgroundView.setBackgroundDrawable(backgroundShape);

                const backgroundWidth = dip2px(140);
                const backgroundHeight = canvasSize + dip2px(30);

                playerHpTextView = new android.widget.TextView(context);
                playerHpTextView.setText("HP| " + (playerHp !== undefined ? Math.floor(playerHp) : "Н/Д"));
                playerHpTextView.setTextSize(dip2px(7));
                playerHpTextView.setAlpha(1.0);
                playerHpTextView.setTextColor(android.graphics.Color.WHITE);

                const hpParams = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.view.Gravity.END | android.view.Gravity.BOTTOM
                );
                hpParams.setMargins(0, 0, dip2px(47), dip2px(60));
                playerHpTextView.setLayoutParams(hpParams);

                playerSpeedTextView = new android.widget.TextView(context);
                playerSpeedTextView.setText("Speed| " + (playerSpeed !== undefined ? playerSpeed + " b/s" : "Н/Д"));
                playerSpeedTextView.setTextSize(dip2px(7));
                playerSpeedTextView.setAlpha(1.0);
                playerSpeedTextView.setTextColor(android.graphics.Color.WHITE);

                const speedParams = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.view.Gravity.END | android.view.Gravity.BOTTOM
                );
                speedParams.setMargins(0, 0, dip2px(15), dip2px(35));
                playerSpeedTextView.setLayoutParams(speedParams);

                cpsTextView = new android.widget.TextView(context);
                cpsTextView.setText("CPS| " + (currentCps !== undefined ? currentCps : "Н/Д"));
                cpsTextView.setTextSize(dip2px(7));
                cpsTextView.setAlpha(1.0);
                cpsTextView.setTextColor(android.graphics.Color.WHITE);

                const cpsParams = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.view.Gravity.END | android.view.Gravity.BOTTOM
                );
                cpsParams.setMargins(0, 0, dip2px(47), dip2px(10));
                cpsTextView.setLayoutParams(cpsParams);

                backgroundLayout.setLayoutParams(new android.widget.FrameLayout.LayoutParams(backgroundWidth, backgroundHeight));
                backgroundLayout.addView(backgroundView);
                backgroundLayout.addView(playerHpTextView);
                backgroundLayout.addView(playerSpeedTextView);
                backgroundLayout.addView(cpsTextView);

                backgroundWindow = new android.widget.PopupWindow(backgroundLayout, backgroundWidth, backgroundHeight);
                backgroundWindow.setTouchable(false);
                backgroundWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                backgroundWindow.showAtLocation(
                    context.getWindow().getDecorView(),
                    android.view.Gravity.LEFT | android.view.Gravity.TOP,
                    xPosition.getCurrentValue(),
                    yPosition.getCurrentValue()
                );

                const layout = new android.widget.FrameLayout(context);
                const bitmap = android.graphics.Bitmap.createBitmap(canvasSize, canvasSize, android.graphics.Bitmap.Config.ARGB_8888);
                const canvas = new android.graphics.Canvas(bitmap);

                drawImage(canvas);

                imageView = new android.widget.ImageView(context);
                imageView.setImageBitmap(bitmap);
                imageView.setLayoutParams(new android.widget.FrameLayout.LayoutParams(canvasSize, canvasSize));

                layout.addView(imageView);

                popupWindow = new android.widget.PopupWindow(layout, canvasSize, canvasSize);
                popupWindow.setTouchable(true);
                popupWindow.setFocusable(false);
                popupWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                popupWindow.showAtLocation(
                    context.getWindow().getDecorView(),
                    android.view.Gravity.LEFT | android.view.Gravity.TOP,
                    xPosition.getCurrentValue(),
                    yPosition.getCurrentValue()
                );

            } catch (e) {
                print("Error in createPopup: " + e);
            }
        }
    }));
}

function removePopup() {
    if (popupWindow != null || backgroundWindow != null) {
        context.runOnUiThread(new java.lang.Runnable({
            run: function() {
                try {
                    if (popupWindow != null && popupWindow.isShowing()) {
                        popupWindow.dismiss();
                        popupWindow = null;
                    }
                    if (backgroundWindow != null && backgroundWindow.isShowing()) {
                        backgroundWindow.dismiss();
                        backgroundWindow = null;
                        playerHpTextView = null;
                        playerSpeedTextView = null;
                        cpsTextView = null;
                        backgroundShape = null;
                    }
                } catch (e) {
                    print("Error in removePopup: " + e);
                }
            }
        }));
    }
}

function calculateCps() {
    const now = Date.now();
    while (lastClickTimes.length > 0 && lastClickTimes[0] < now - CPS_WINDOW_MS) {
        lastClickTimes.shift();
    }
    return Math.floor(lastClickTimes.length / 1);
}

function onFastTick() {
    const isModuleCurrentlyActive = module.isActive();

    if (isModuleCurrentlyActive) {
        const currentHp = LocalPlayer.getHealth();
        const playerSpeed = Math.round(Math.sqrt(Math.pow(LocalPlayer.getVelocityX(), 2) + Math.pow(LocalPlayer.getVelocityZ(), 2)) * 100) / 100;
        const currentCps = calculateCps();
        // Call createPopup, which handles UI thread internally
        createPopup(currentHp, playerSpeed, currentCps);
        // updatePixelWindowAppearance() is now also wrapped in runOnUiThread
        // No direct call here needed if createPopup also updates it when existing.
        // However, if you want a *separate* and constant update, you can call it here:
        // if (popupWindow && backgroundWindow) {
        //     updatePixelWindowAppearance();
        // }
        // For efficiency, it's better to let createPopup handle the update if the window exists.
        // If you need more frequent updates beyond what createPopup provides on its "update" path,
        // then consider calling updatePixelWindowAppearance() directly here.
    } else {
        if (wasModuleActive) {
            removePopup();
            lastClickTimes = [];
        }
    }
    wasModuleActive = isModuleCurrentlyActive;
}

function onAttack(playerID) {
    if (module.isActive()) {
        lastClickTimes.push(Date.now());
        const currentCps = calculateCps();
        if (cpsTextView) {
            context.runOnUiThread(new java.lang.Runnable({
                run: function() {
                    cpsTextView.setText("CPS| " + currentCps);
                }
            }));
        }
    }
}

function onUseItem(blockID) {
    if (module.isActive()) {
        lastClickTimes.push(Date.now());
        const currentCps = calculateCps();
        if (cpsTextView) {
            context.runOnUiThread(new java.lang.Runnable({
                run: function() {
                    cpsTextView.setText("CPS| " + currentCps);
                }
            }));
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
    wasModuleActive = module.isActive();
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
    removePopup();
    lastClickTimes = [];
    wasModuleActive = false;
}
