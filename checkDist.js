let lastHealth = 20; 

function onLevelTick() { 
    let currentHealth = LocalPlayer.getHealth(); 
    if (currentHealth < lastHealth) { 
        Level.displayClientMessage(LocalPlayer.getDistanceTo(LocalPlayer.getNearestPlayer(10))); 
        lastHealth = currentHealth; 
    } 
} 