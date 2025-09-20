let trackedPlayers = {};
let context = getContext();

function checkPlayer(name) {
    let players = Level.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        if (Player.getNameTag(players[i]).toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function animateView(view, startX, endX, duration, callback) {
    let animation = new android.view.animation.TranslateAnimation(
        android.view.animation.Animation.ABSOLUTE, startX,
        android.view.animation.Animation.ABSOLUTE, endX,
        android.view.animation.Animation.ABSOLUTE, 0,
        android.view.animation.Animation.ABSOLUTE, 0
    );
    animation.setDuration(duration);
    animation.setFillAfter(true);
    animation.setAnimationListener(new android.view.animation.Animation.AnimationListener({
        onAnimationStart: function() {},
        onAnimationEnd: function() {
            if (callback) callback();
        },
        onAnimationRepeat: function() {}
    }));
    view.startAnimation(animation);
}

function showPlayerFrame(name) {
    context.runOnUiThread(new java.lang.Runnable({
        run: function() {
            let window = new android.widget.PopupWindow();
            let textView = new android.widget.TextView(context);
            textView.setText(name);
            textView.setTextColor(android.graphics.Color.WHITE);
            textView.setTextSize(20);
            textView.setPadding(20, 10, 20, 10);

            let shape = new android.graphics.drawable.GradientDrawable();
            shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
            shape.setColor(android.graphics.Color.DKGRAY);
            shape.setCornerRadius(20);

            textView.setBackground(shape);

            let dpWidth = android.util.TypedValue.applyDimension(
                android.util.TypedValue.COMPLEX_UNIT_DIP, 150, context.getResources().getDisplayMetrics()
            );
            textView.setWidth(dpWidth);

            let blueLine = new android.view.View(context);
            blueLine.setBackgroundColor(android.graphics.Color.BLUE);
            blueLine.setLayoutParams(new android.widget.FrameLayout.LayoutParams(
                dpWidth, 5, android.view.Gravity.BOTTOM
            ));

            let layout = new android.widget.FrameLayout(context);
            layout.addView(textView);
            layout.addView(blueLine);

            window.setContentView(layout);
            window.setWidth(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
            window.setHeight(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);

            layout.measure(0, 0);
            let textWidth = layout.getMeasuredWidth();
            let startX = textWidth;
            let endX = 0;

            window.showAtLocation(context.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, -startX, 100);

            animateView(layout, startX, endX, 500, function() {
                new android.os.Handler().postDelayed(new java.lang.Runnable({
                    run: function() {
                        animateView(layout, endX, startX, 500, function() {
                            window.dismiss();
                        });
                    }
                }), 5000);
            });
        }
    }));
}

let playerTracker = new Module("PlayerTracker", true, false, ModuleCategory.MISC);
let nameInput = new TextFieldSetting("PlayerName", "Enter player name", "");
playerTracker.addSetting(nameInput);

let trackButton = new ButtonSetting("TrackPlayer", function() {
    let name = nameInput.getText();
    if (name && !trackedPlayers[name]) {
        trackedPlayers[name] = false;
        Level.displayClientMessage("§aStarted tracking player: " + name);
    }
});
playerTracker.addSetting(trackButton);

function checkTrackedPlayers() {
    for (let name in trackedPlayers) {
        let isOnline = checkPlayer(name);
        if (isOnline && !trackedPlayers[name]) {
            Level.displayClientMessage("§e" + name + " has joined the server!");
            trackedPlayers[name] = true;
            showPlayerFrame(name);
        } else if (!isOnline && trackedPlayers[name]) {
            Level.displayClientMessage("§c" + name + " has left the server!");
            trackedPlayers[name] = false;
        }
    }
}

playerTracker.setOnToggleListener(function(view, active) {
    if (active) {
        Level.displayClientMessage("§aPlayerTracker enabled");
    } else {
        Level.displayClientMessage("§cPlayerTracker disabled");
        trackedPlayers = {};
    }
});

function onLevelTick() {
    if (playerTracker.isActive()) {
        checkTrackedPlayers();
    }
}
function onScriptEnabled() {
ModuleManager.addModule(playerTracker);
}

function onScriptDisabled() {
ModuleManager.removeModule(playerTracker);
}