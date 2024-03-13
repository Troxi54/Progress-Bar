function preLoop()
{
    console.log("\t\t\t\t\tProgress Bar game by Troxi\n\nIf you notice an error or warning please report it on our discord server.\n\t\t\tDiscord server: https://discord.gg/9RwU7VVGvu");

    let data = load();
    if (data !== null)
    {
        player = load();
    }

    
    player_nosave.updateHolder();
    player_nosave.updatePrestige();
    player_nosave.updatePrestigeEffect();
    player_nosave.updateXp();
    currencies.setXpToNextLevel();

    elements = {
        next: document.getElementById("next"),
        level: document.getElementById("level"),
        level_in: document.getElementById("level_in"),
        level_text: document.getElementById("level_text"),
        level_number: document.getElementById("level_number"),
        holder_div: document.getElementById("holder_div"),
        holder_upg1_div: document.getElementById("holder_upg1_div"),
        holder_upg1: document.getElementById("holder_upg1"),
        holder_upg2_div: document.getElementById("holder_upg2_div"),
        holder_upg2: document.getElementById("holder_upg2"),
        prestige_div: document.getElementById("prestige_div"),
        prestige_info: document.getElementById("prestige_info"),
        prestige_number: document.getElementById("prestige_number"),
        prestige_upgrades: document.getElementById("prestige_upgrades_div"),

        prestige_upgrade1: document.getElementById("prestige_upgrade1"),
        prestige_upgrade_text1: document.getElementById("prestige_upgrade_text1"),

        prestige_upgrade2: document.getElementById("prestige_upgrade2"),
        prestige_upgrade_text2: document.getElementById("prestige_upgrade_text2"),

        prestige_upgrade3: document.getElementById("prestige_upgrade3"),
        prestige_upgrade_text3: document.getElementById("prestige_upgrade_text3"),

        prestige_upgrade4: document.getElementById("prestige_upgrade4"),
        prestige_upgrade_text4: document.getElementById("prestige_upgrade_text4"),

        sacrifice_div: document.getElementById("sacrifice_div"),
        sacrifice_info: document.getElementById("sacrifice_info"),
        sacrifice_number: document.getElementById("sacrifice_number"),
        sacrifice_milestones: document.getElementById("sacrifice_milestones_div"),

        smd1: document.getElementById("smd1"),
        smt1: document.getElementById("smt1"),

        smd2: document.getElementById("smd2"),
        smt2: document.getElementById("smt2"),

        smd3: document.getElementById("smd3"),
        smt3: document.getElementById("smt3"),

        smd4: document.getElementById("smd4"),
        smt4: document.getElementById("smt4"),

        smd5: document.getElementById("smd5"),
        smt5: document.getElementById("smt5"),

        smd6: document.getElementById("smd6"),
        smt6: document.getElementById("smt6"),

        smd7: document.getElementById("smd7"),
        smt7: document.getElementById("smt7"),
    }

    sizes = {
        level: 0,
        level_in: 0,
    }

    

    updates.updateLevelNumberText();
    updates.updateLevelText();
    updates.updateHolderUpg1();
    updates.updateHolderUpg2();
    updates.updateNextText();
    updates.updatePrestigeText();
    updates.updatePrestigeNumber();

    updates.updatePrestigeUpgrade1();
    updates.updatePrestigeUpgrade2();
    updates.updatePrestigeUpgrade3();
    updates.updatePrestigeUpgrade4();

    updates.updateSacrificeText();
    updates.updateSacrificeNumber();

    updates.updateSM1();
    updates.updateSM2();
    updates.updateSM3();
    updates.updateSM4();
    updates.updateSM5();
    updates.updateSM6(); 
    updates.updateSM7();

    updates.updateShows();
    

    elements.holder_div.addEventListener("mousedown", function() 
    { 
        if (getComputedStyle(elements.holder_div).display != "none")
        { 
            events.isHolderHeld = true;
        }
    })
    elements.holder_div.addEventListener("touchstart", function() 
    { 
        if (getComputedStyle(elements.holder_div).display != "none")
        { 
            events.isHolderHeld = true;
        }
    })
    elements.holder_div.addEventListener("mouseup", function() 
    { 
        events.isHolderHeld = false;
    })
    elements.holder_div.addEventListener("touchend", function() 
    { 
        events.isHolderHeld = false;
    })
    elements.holder_div.addEventListener("mouseleave", function() 
    { 
        events.isHolderHeld = false;
    })

    elements.holder_upg1_div.addEventListener("click", function()
    {
        buy_hu1();
    })
    elements.holder_upg2_div.addEventListener("click", function()
    {
        buy_hu2();
    })
    elements.prestige_div.addEventListener("click", function()
    {
        if (player.level.ge(consts.prestige))
        {
            resets.prestige();
        }
    })
    elements.prestige_upgrade1.addEventListener("click", function()
    {
        buy_pu1();
    })
    elements.prestige_upgrade2.addEventListener("click", function()
    {
        buy_pu2();
    })
    elements.prestige_upgrade3.addEventListener("click", function()
    {
        buy_pu3();
    })  
    elements.prestige_upgrade4.addEventListener("click", function()
    {
        buy_pu4();
    })
    elements.sacrifice_div.addEventListener("click", function()
    {
        if (player.level.ge(currencies.getSacrificeRequirement()))
        {
            resets.sacrifice();
        }
    })

    document.addEventListener("keydown", function(k) { if (k.key == keys.Holder) events.isHolderHeld = true; })
    document.addEventListener("keyup", function(k) { if (k.key == keys.Holder) events.isHolderHeld = false; })

    document.addEventListener("keydown", function(k) { if (k.key == keys.Prestige) events.isPrestigePressed = true; })
    document.addEventListener("keyup", function(k) { if (k.key == keys.Prestige) events.isPrestigePressed = false; })

    document.addEventListener("keydown", function(k) { if (k.key == keys.Sacrifice) events.isSacrificePressed = true; })
    document.addEventListener("keyup", function(k) { if (k.key == keys.Sacrifice) events.isSacrificePressed = false; })
}

// holder upgrades ->

function buy_hu1() 
{ 
    if (getComputedStyle(elements.holder_upg1_div).display != "none")
    {
        let l10 = 0;
        while (player.level.ge(currencies.getHolderUpgrade1Cost(BigNumber('1e1').topow(l10))))++l10;++l10;
        while (--l10 + 1)
        {
            while(player.level.ge(currencies.getHolderUpgrade1Cost(BigNumber('1e1').topow(l10))))
            {
                player.upg1_tm = player.upg1_tm.plus(BigNumber('1e1').topow(l10));
            }
        }
        player_nosave.updateXp();
        updates.updateHolderUpg1();
    }
}

function buy_hu2()
{
    if (getComputedStyle(elements.holder_upg2_div).display != "none")
    {
        let l10 = 0;
        while (player.level.ge(currencies.getHolderUpgrade2Cost(BigNumber('1e1').topow(l10))))++l10;++l10;
        while (--l10 + 1)
        {
            while(player.level.ge(currencies.getHolderUpgrade2Cost(BigNumber('1e1').topow(l10))))
            {
                player.upg2_tm = player.upg2_tm.plus(BigNumber('1e1').topow(l10));
            }
        }
        currencies.setLevels();
        currencies.setXpToNextLevel();
        updates.updateLevelNumberText()
        updates.updateHolderUpg2();
    }
}


// prestige upgrades ->

function buy_pu1()
{
    if (getComputedStyle(elements.prestige_upgrades).display != "none")
    {
        let l10 = 0;
        while (player.prestige_points.ge(currencies.getPrestigeUpgrade1Cost(BigNumber('1e1').topow(l10))))++l10;++l10;
        while (--l10 + 1)
        {
            while(player.prestige_points.ge(currencies.getPrestigeUpgrade1Cost(BigNumber('1e1').topow(l10))))
            {
                player.pupg1_tm = player.pupg1_tm.plus(BigNumber('1e1').topow(l10));
            }
        }
        updates.updatePrestigeUpgrade1();
    }
}


function buy_pu2()
{
    if (getComputedStyle(elements.prestige_upgrades).display != "none")
    {
        let l10 = 0;
        while (player.prestige_points.ge(currencies.getPrestigeUpgrade2Cost(BigNumber('1e1').topow(l10))))++l10;++l10;
        while (--l10 + 1)
        {
            while(player.prestige_points.ge(currencies.getPrestigeUpgrade2Cost(BigNumber('1e1').topow(l10))))
            {
                player.pupg2_tm = player.pupg2_tm.plus(BigNumber('1e1').topow(l10));
            }
        }
        player_nosave.updatePrestige();
        updates.updatePrestigeText();
        updates.updatePrestigeUpgrade2();
    }
}

function buy_pu3()
{
    if (getComputedStyle(elements.prestige_upgrades).display != "none")
    {
        if (player.prestige_points.ge(currencies.getPrestigeUpgrade3Cost()))
        {
            player.pupg3_ib = true;
            updates.updatePrestigeUpgrade3();
        }
    }
}

function buy_pu4()
{
    if (getComputedStyle(elements.prestige_upgrades).display != "none")
    {
        if (player.prestige_points.ge(currencies.getPrestigeUpgrade4Cost()))
        {
            player.pupg4_ib = true;
            updates.updatePrestigeUpgrade4();
        }
    }
}