const resets = {
    prestige()
    {
        if (getComputedStyle(elements.prestige_div).display != "none")
        {
            player.prestige_unlocked = true;
            player.prestige_points = player.prestige_points.plus(player_nosave.prestige_points_var);

            if (player.sacrifice.lt(sm_requirements[1]))
            {
                player_nosave.setLevel(BigNumber('0e0'));
                player.xp = BigNumber('0e0');
            }
            
            
            if (player.sacrifice.lt(sm_requirements[0]) && !player.pupg4_ib) 
            {
                player.holder_progress = BigNumber('1e0');
            }
            if (!player.pupg3_ib)
            {
                player.upg1_tm = BigNumber('0e0');
                player.upg2_tm = BigNumber('0e0');
                currencies.setLevels();
            }
            
            player_nosave.updateHolder();
            player_nosave.updateXp();
            player_nosave.updatePrestige();
            player_nosave.updatePrestigeEffect();
            

            updates.updateLevelNumberText();
            updates.updateLevelText();
            updates.updateHolderUpg1();
            updates.updateHolderUpg2();
            updates.updatePrestigeText();
            updates.updatePrestigeNumber();
        }
    },
    sacrifice()
    {
        if (getComputedStyle(elements.sacrifice_div).display != "none")
        {
            player.sacrifice_done = true;
            
            if (player.sacrifice.lt(sm_requirements[4])) player.prestige_points = BigNumber('0e0');

            player_nosave.setLevel(BigNumber('0e0'));
            player.xp = BigNumber('0e0');
            currencies.setXpToNextLevel();

            if (player.sacrifice.lt(sm_requirements[0])) player.holder_progress = BigNumber('1e0');
            if (player.sacrifice.lt(sm_requirements[5]))
            {
                player.upg1_tm = BigNumber('0e0');
                player.upg2_tm = BigNumber('0e0');
                currencies.setLevels();
            }
            

            if (player.sacrifice.lt(sm_requirements[6]))
            {
                player.pupg1_tm = BigNumber('0e0');
                player.pupg2_tm = BigNumber('0e0');
                player.pupg4_ib = false;
            }
            if (player.sacrifice.lt(sm_requirements[2])) player.pupg3_ib = false;

            player.sacrifice = player.sacrifice.plus(BigNumber('1e0'));

            player_nosave.updateHolder();
            player_nosave.updateXp();
            player_nosave.updatePrestige();
            player_nosave.updatePrestigeEffect();

            updates.updateLevelNumberText();
            updates.updateLevelText();
            updates.updateHolderUpg1();
            updates.updateHolderUpg2();
            updates.updatePrestigeText();
            updates.updatePrestigeNumber();

            updates.updatePrestigeUpgrade1();
            updates.updatePrestigeUpgrade2();
            updates.updatePrestigeUpgrade3();
            updates.updatePrestigeUpgrade4();

            updates.updateSacrificeText();
            updates.updateSacrificeNumber();

            updates.updateShows();
        }
    }
}