document.addEventListener("DOMContentLoaded", function() {

    preLoop();

    function update()
    {
        setFPS();
        
        sizes.level = elements.level.offsetWidth - getComputedStyle(elements.level).borderTopWidth.slice(0, -2) * 2;
        sizes.level_in = elements.level_in.offsetWidth;

        if (player.sacrifice.ge(sm_requirements[3]) || events.isPrestigePressed) 
        { 
            if (Date.now() - player.pp_ped >= setting.pp_i * 1e3) 
            {
                resets.prestige();
                player.pp_ped = Date.now();
            }
        }
        if (player.sacrifice.ge(sm_requirements[5])) 
        { 
            if (Date.now() - player.hu_abd >= setting.hu_i * 1e3) 
            {
                buy_hu1(); 
                buy_hu2(); 
                player.hu_abd = Date.now();
            }
        }
        if (player.sacrifice.ge(sm_requirements[6])) 
        { 
            if (Date.now() - player.pu_abd >= setting.ppu_i * 1e3)
            {
                buy_pu1(); 
                buy_pu2(); 
                buy_pu3(); 
                buy_pu4(); 
                player.pu_abd = Date.now();
            }
        }
        if (events.isSacrificePressed)
        {
            if (player.level.ge(currencies.getSacrificeRequirement()))
            {
                resets.sacrifice();
            }
        }

        player.xp = player.xp.plus(player_nosave.xp_var);

        if (player.xp.gte(player_nosave.level_exp) && elements.level_in.style.width == "100%")
        {
            let l10 = 0;
            while (player.xp.ge(currencies.setXpToNextLevel(player.level.plus(BigNumber('1e1').topow(l10 + 1)).minus(BigNumber('1e0')))))++l10;++l10;
            while (--l10 + 1)
            {
                while(player.xp.gte(currencies.setXpToNextLevel(player.level.plus(BigNumber('1e1').topow(l10)).minus(BigNumber('1e0')))))
                {
                    player.xp = player.xp.minus(player_nosave.level_exp);
                    player_nosave.setLevel(player.level.plus(BigNumber('1e1').topow(l10)));
                }
            }

            player_nosave.updatePrestige();

            if (player.level.gte(consts.holder))
            {
                player.holder_unlocked = true;
                updates.updateNextText();
                updates.updateShows();
            }
            if (player.level.gte(consts.holder_upgrades))
            {
                player.holder_upgrades_unlocked = true;
                updates.updateNextText();
                updates.updateShows();
            }
            if (player.level.gte(consts.prestige))
            {
                player.prestige_unlocked = true;
                updates.updateNextText();
                updates.updateShows();
            }
            if (player.level.gte(consts.prestige_upgrades))
            {
                player.prestige_upgrades_unlocked = true;
                updates.updateNextText();
                updates.updateShows();
            }
            if (player.level.gte(consts.sacrifice))
            {
                player.sacrifice_unlocked = true;
                updates.updateNextText();
                updates.updateShows();
            }
            
            player.xp = player.xp.plus(player_nosave.xp_var);

            elements.level_in.classList.add("notransition");
            elements.level_in.style.width = "0px";
            elements.level_in.offsetHeight;
            elements.level_in.classList.remove("notransition");

            updates.updateLevelNumberText();
            
            updates.updatePrestigeText();
            updates.updateSacrificeText();
            
        }

        elements.level_in.style.transition = getLoopInterval() + "ms linear";
        elements.level_in.style.width = Math.max(Math.min(player.xp.div(player_nosave.level_exp).times(BigNumber('1e2')).toNumber(), 100), 0) + "%";

        updates.updateLevelText();

        if (events.isHolderHeld) 
        { 
            player.holder_progress = player.holder_progress.plus(currencies.getHolderProgress());
            player_nosave.updateHolder();
            player_nosave.updateXp();
        }

        if (Date.now() - player.last_save >= setting.auto_save * 1e3)
        {
            save();
            player.last_save = Date.now();
        }
    }

    setInterval(update, getLoopInterval());
});