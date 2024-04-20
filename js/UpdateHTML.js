const updates = {
    updateNextText()
    {
        let text = "Level " + abb(consts.holder, undefined, false) + ": <span style='color: rgb(130, 130, 130);'>Holder</span>";
        if (!player.sacrifice.gt(BigNumber('0e0')))
        {
            if (!player.prestige_upgrades_unlocked)
            {
                if (!player.prestige_unlocked)
                {
                    if (player.level.gte(consts.holder))
                    {
                        text = "Level " + abb(consts.holder_upgrades, undefined, false) + ": <span style='color: rgb(130, 130, 130);'>Holder Upgrades</span>";
                    }
                    if (player.level.gte(consts.holder_upgrades))
                    {
                        text = "Level " + abb(consts.prestige, undefined, false) + ": <span style='color: rgb(130, 0, 0);'>Prestige</span>";
                    }
                }
                else
                {
                    text = "Level " + abb(consts.prestige_upgrades, undefined, false) + ": <span style='color: rgb(130, 0, 0);'>Prestige Upgrades</span>";
                }
            }
            else
            {
                text = "Level " + abb(consts.sacrifice, undefined, false) + ": <span style='color: rgb(65, 0, 130);'>Sacrifice</span>";
            }
        }
        else
        {
            text = "Level " + abb(consts.place_holder, undefined) + ": <span style='background: linear-gradient(to left, #FF0000 0%, #00FF00 50%, #0000FF 100%); background-clip: text; -webkit-text-fill-color: transparent;'>Try to reach this</span>"
        }

        elements.next.innerHTML = text;
    },
    updateLevelText()
    {
        let xp = player_nosave.xp_var.times(BigNumber('1e-1').div(intervalS())).times(BigNumber('1e5')).ceil().div(BigNumber('1e5'));
        elements.level_text.innerHTML = round(Math.max(Math.min(player.xp.div(player_nosave.level_exp).times(BigNumber('1e2')).toNumber(), 100), 0), 1) + "% | "
                                      + abb(BigNumber.max(currencies.getTimeToNextLevelRemain(), BigNumber('0e0')), 1) + " seconds" 
                                      + ((!xp.eq(BigNumber('1e0')) ? " (" + abb(xp) + "x)" : ""));
    },
    updateLevelNumberText()
    {
        let scale = "";
        for (i = 0; i < levels.length; ++i)
        {
            if (player.level.gte(player_nosave.levels_[i][1]))
            {
                scale = player_nosave.levels_[i][0];
            }
        }
        elements.level_number.innerHTML = scale + " Level " + abb(player.level, 2, false);
    },
    updateHolderUpg1()
    {
        elements.holder_upg1.innerHTML = "<span style='font-size: 175%;'>Upgrade 1</span><br><br>" + abb(currencies.getHolderUpgrade1Effect2()) 
        + "x holder effect<br>Require: level " + abbi(currencies.getHolderUpgrade1Cost());
    },
    updateHolderUpg2()
    {
        let scale_name;
        for (let i = 1; i < levels.length; ++i) { if (player.upg2_tm.plus(levels[1][1]).ge(levels[i][1])) { scale_name = levels[i][0]; } }
        elements.holder_upg2.innerHTML = 
        "<span style='font-size: 175%;'>Upgrade 2</span><br><br>" + scale_name + " level<br>starts " + abb(player.upg2_effect, undefined, false) 
        + " later<br>Required: level " + abbi(currencies.getHolderUpgrade2Cost());
    },
    updatePrestigeText()
    {
        elements.prestige_info.innerHTML = "<span style='font-size: 50px;'>Prestige</span><br><br>It resets everything before, but decrease <br>time to levels based on prestige points.<br><br><span style='font-size: 23px;'>"
        + (player.level.gte(consts.prestige) ? "+" + abb(player_nosave.prestige_points_var, 2) + " prestige points</span>"
        : "Required: level " + abb(consts.prestige, undefined, false));
    },
    updatePrestigeNumber()
    {
        elements.prestige_number.innerHTML = player.prestige_points.gt(BigNumber('0e0')) ? "Prestige points: " + abb(player.prestige_points) + "</span><span style='color: rgb(130, 0, 0)'> = 1/" + abb(player_nosave.prestige_effect_var, 2) + "x time.</span>" : "";
    },
    updatePrestigeUpgrade1()
    {
        elements.prestige_upgrade_text1.innerHTML = "<span style='font-size: 175%;'>Upgrade 1</span><br><br>+" + abb(player_nosave.pupg1_effect, undefined, false) + " to the base<br>of holder formula<br>"
        + "Required: " + abb(currencies.getPrestigeUpgrade1Cost()) + " PP";
    },
    updatePrestigeUpgrade2()
    {
        elements.prestige_upgrade_text2.innerHTML = "<span style='font-size: 175%;'>Upgrade 2</span><br><br>" + abb(player_nosave.pupg2_effect, undefined, false) + "x prestige points<br>"
        + "Required: " + abb(currencies.getPrestigeUpgrade2Cost()) + " PP";
    },
    updatePrestigeUpgrade3()
    {
        elements.prestige_upgrade_text3.innerHTML = "<span style='font-size: 175%;'>Upgrade 3</span><br><br>Prestige doesn't reset<br>holder upgrades<br>" + (!player.pupg3_ib ?
            "Required: " + abb(currencies.getPrestigeUpgrade3Cost()) + " PP":
            "Bought");
    },
    updatePrestigeUpgrade4()
    {
        elements.prestige_upgrade_text4.innerHTML = "<span style='font-size: 175%;'>Upgrade 4</span><br><br>Prestige doesn't reset<br>holder progress<br>" + (!player.pupg4_ib ?
            "Required: " + abb(currencies.getPrestigeUpgrade4Cost()) + " PP":
            "Bought");
    },
    updateSacrificeText()
    {
        elements.sacrifice_info.innerHTML = "<span style='font-size: 50px;'>Sacrifice</span><br><br>It resets everything before,<br>but unlocks powerful milestones.<br><br><span style='font-size: 23px;'>"
        + (player.level.ge(currencies.getSacrificeRequirement()) ? "You can sacrifice</span>"
        : "Required: level " + abb(currencies.getSacrificeRequirement(), undefined, false)) + "</span>";
    },
    updateSacrificeNumber()
    {
        elements.sacrifice_number.innerHTML = player.sacrifice > 0 ? "You have sacrificed " + abb(player.sacrifice, undefined, false) + " times" : "";
    },
    updateSM1()
    {
        elements.smt1.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[0]) +"</span><br><br>Squared holder effect and holder progress is never reset again";
    },
    updateSM2()
    {
        elements.smt2.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[1]) +"</span><br><br>" + abb(player_nosave.sm2_effect) + "x PP per sacrifice and prestige no longer reset level";
    },
    updateSM3()
    {
        elements.smt3.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[2]) +"</span><br><br>Squared PP effect and keep the third PP upgrade on Sacrifice reset";
    },
    updateSM4()
    {
        elements.smt4.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[3]) +"</span><br><br>1/" + abb(player_nosave.sm4_effect) + "x time per sacrifice start at this and automatically<br>do prestige every " + setting.pp_i + "s.";
    },
    updateSM5()
    {
        elements.smt5.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[4]) +"</span><br><br>^(1 + sacrifice / " + abb(BigNumber('1e0').div(player_nosave.sm5_effect)) + ") holder base and sacrifice no longer reset PP";
    },
    updateSM6()
    {
        elements.smt6.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[5]) +"</span><br><br>Holder upgrade 1 effect is now " + abb(player_nosave.sm6_effect) + " and keep holder upgrades on sacrififce, automatically buy them";
    },
    updateSM7()
    {
        elements.smt7.innerHTML = "<span style='font-size: 25px;'>Sacrifice "+ abbi(sm_requirements[6]) +"</span><br><br>^" + abb(player_nosave.sm7_effect) + " PP and keep prestige upgrades on sacrifice, automatically buy them";
    },
    updateShows()
    {     
        if (player.holder_unlocked)
        {
            elements.holder_div.style.display = "flex";
        }
        else
        {
            elements.holder_div.style.display = "none";
        }
        if (player.holder_upgrades_unlocked)
        {
            elements.holder_upg1_div.style.display = "flex";
            elements.holder_upg2_div.style.display = "flex";
        }
        else
        {
            elements.holder_upg1_div.style.display = "none";
            elements.holder_upg2_div.style.display = "none";
        }
        if (player.prestige_unlocked)
        {
            elements.prestige_div.style.display = "flex";
        }
        else
        {
            elements.prestige_div.style.display = "none";
        }
        if (player.prestige_upgrades_unlocked)
        {
            elements.prestige_upgrades.style.display = "flex";
        }
        else
        {
            elements.prestige_upgrades.style.display = "none";
        }
        if (player.sacrifice_unlocked)
        {
            elements.sacrifice_div.style.display = "flex";
        }
        else
        {
            elements.sacrifice_div.style.display = "none";
        }
        if (player.sacrifice_done)
        {
            elements.sacrifice_milestones.style.display = "block"; 
        }
        else
        {
            elements.sacrifice_milestones.style.display = "none";
        }
    }
}