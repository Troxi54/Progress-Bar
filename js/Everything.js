


BigNumber.set({ EXPONENTIAL_AT: 0})

let elements;

const setting = {
    save: true,
    auto_save: 10,
    update_time_s: BigNumber('1e-0'),
    to_exp: BigNumber('1e50'),
    pp_i: .1,
    hu_i: .25,
    ppu_i: .25,
}

const levels = [
    ["", BigNumber('0e0'), BigNumber('1.25e0')],
    ["Super", BigNumber('5e1'), BigNumber('1.5e0')],
    ["Ultra", BigNumber('1e2'), BigNumber('2e0')],
    ["Extra", BigNumber('2.5e2'), BigNumber('3e0')],
    ["Imposible", BigNumber('1e3'), BigNumber('5e0')]
]

const consts = {
    holder: BigNumber('1.5e1'),
    holder_upgrades: BigNumber('5e1'),
    prestige: BigNumber('7.5e1'),
    prestige_upgrades: BigNumber('1.1e2'),
    sacrifice: BigNumber('1.5e2'),
    place_holder: BigNumber('2.5e3')
}

let player = {
    level: BigNumber('0e0'), 
    xp: BigNumber('0e0'),
    
    holder_progress: BigNumber('1e0'),
    holder_base: BigNumber('1e1'),

    upg1_tm: BigNumber('0e0'),
    upg1_effect: BigNumber('1.5e0'),

    upg2_tm: BigNumber('0e0'),
    upg2_effect: BigNumber('1e0'),

    prestige_points: BigNumber('0e0'),
    prestige_upgrades_unlocked: false,

    pupg1_tm: BigNumber('0e0'),
    pupg2_tm: BigNumber('0e0'),
    pupg3_ib: false,
    pupg4_ib: false,
    
    sacrifice: BigNumber('0e0'),

    holder_unlocked: false,
    holder_upgrades_unlocked: false,
    prestige_unlocked: false,
    prestige_upgrades_unlocked: false,
    sacrifice_unlocked: false,
    sacrifice_done: false,

    pp_ped: Date.now(),
    hu_abd: Date.now(),
    pu_abd: Date.now(),

    last_save: Date.now(),
}

const player_nosave = {
    xp_multiplier: BigNumber('1e0'),
    level_exp: BigNumber(''),
    setLevel(num) { player.level = num; currencies.setXpToNextLevel(); },
    xp_var: BigNumber(''),
    updateXp() { this.xp_var = currencies.getXp(); },

    levels_: levels.map(object => ({ ...object })),

    holder_progress_multiplier: BigNumber('1e0'),

    upg1_start_cost: consts.holder_upgrades,
    upg1_cost_scale: BigNumber('5e0'),

    upg2_start_cost: consts.holder_upgrades,
    upg2_cost_scale: BigNumber('5e0'),

    prestige_points_multiplier: BigNumber('1e0'),

    pupg1_effect: BigNumber('1e0'),
    pupg1_start_cost: BigNumber('2.5e4'),
    pupg1_cost_scale: BigNumber('1e1'),

    pupg2_effect: BigNumber('2e0'),
    pupg2_start_cost: BigNumber('1e4'),
    pupg2_cost_scale: BigNumber('5e0'),

    pupg3_cost: BigNumber('1.5e4'),
    pupg4_cost: BigNumber('5e4'),
    sacrifice_scale: BigNumber('2.5e1'),

    sm1_effect: BigNumber('2e0'),
    sm2_effect: BigNumber('3e0'),
    sm3_effect: BigNumber('2e0'),
    sm4_effect: BigNumber('1.5e2'),
    sm5_effect: BigNumber('5e-2'),
    sm6_effect: BigNumber('2e0'),
    sm7_effect: BigNumber('1.1e0'),

    lastLoop: Date.now()
}




const sm_requirements = [ BigNumber('1e0'), BigNumber('2e0'), BigNumber('3e0'), BigNumber('4e0'), BigNumber('5e0'), BigNumber('7e0'), BigNumber('1e1') ];

const currencies = {
    getXp()
    {
        return BigNumber('1e1')
        .times(intervalS())
        .times(player_nosave.xp_multiplier)
        .times(this.getHolderEffect())
        .times(this.getHolderUpgrade1Effect())
        .times(this.getPrestigeBoost())
        .times(player.sacrifice.ge(sm_requirements[3]) ? this.getSM4Effect() : BigNumber('1e0'));
    },
    setXpToNextLevel(level = player.level)
    {
        let scale = BigNumber('1e0');
        for (i = 0; i < player_nosave.levels_.length; ++i)
        {
            let dont = false;
            if (i + 1 >= player_nosave.levels_.length) dont =! dont; 
            else if (!level.gte(player_nosave.levels_[i + 1][1])) dont =! dont;

            if (!dont)
            {
                scale = scale.times(player_nosave.levels_[i][2].topow(player_nosave.levels_[i + 1][1].minus(player_nosave.levels_[i][1])));
            }
            else 
            {
                scale = scale.times(player_nosave.levels_[i][2].topow(level.minus(player_nosave.levels_[i][1])));
                break;
            }
        }
        player_nosave.level_exp = BigNumber('1e1').times(scale);
        return player_nosave.level_exp;
    },
    setLevels()
    {
        player_nosave.levels_ = levels.map(object => ({ ...object })); // what the hell, why in javascript no pointers or/and references like in C++

        let later = player.upg2_tm;
        for (let i = 1; i < player_nosave.levels_.length; ++i)
        {
            if (later.eq(BigNumber('0e0'))) { break; }
            if (i + 1 < player_nosave.levels_.length)
            {
                if (later.lt(player_nosave.levels_[i + 1][1].minus(player_nosave.levels_[i][1])))
                {
                    player_nosave.levels_[i][1] = player_nosave.levels_[i][1].plus(later);
                    later = BigNumber('0e0');
                }
                else
                {
                    later = later.minus(player_nosave.levels_[i + 1][1].minus(player_nosave.levels_[i][1]));
                    player_nosave.levels_[i][1] = player_nosave.levels_[i][1].plus(player_nosave.levels_[i + 1][1].minus(player_nosave.levels_[i][1]));
                }
            }
            else
            {
                player_nosave.levels_[i][1] = player_nosave.levels_[i][1].plus(later);
                later = BigNumber('0e0');
            }
        }
    },
    getTimeToNextLevel()
    {
        return player_nosave.level_exp.div(player_nosave.xp_var).times(intervalS());
    },
    getTimeToNextLevelRemain()
    {
        return this.getTimeToNextLevel().minus( this.getTimeToNextLevel().times(player.xp).div(player_nosave.level_exp) );
    },
    getHolderBase()
    {
        return player.holder_base.plus(this.getPrestigeUpgrade1Effect())
        .topow(player.sacrifice.ge(sm_requirements[4]) ? this.getSM5Effect() : BigNumber('1e0'));
    },
    getHolderProgress()
    {
        return player_nosave.holder_progress_multiplier.times(intervalS());
    },
    getHolderEffect()
    {
        return this.getHolderBase().topow(player.holder_progress.topow(this.getHolderBase().topow(BigNumber('2e0')).log(BigNumber('1e1'))).log(BigNumber('1e1')))
        .topow(player.sacrifice.ge(sm_requirements[0]) ? player_nosave.sm1_effect : BigNumber('1e0'));
    },
    getHolderUpgrade1Cost(times = BigNumber('0e0'))
    {
        if (times.gt(BigNumber('0e0'))) times = times.minus(BigNumber('1e0'));
        return player_nosave.upg1_start_cost.plus(player_nosave.upg1_cost_scale.times(player.upg1_tm.plus(times)));
    },
    getHolderUpgrade1Effect2()
    {
        return (player.sacrifice.lt(sm_requirements[5]) ? player.upg1_effect : player_nosave.sm6_effect);
    },
    getHolderUpgrade1Effect()
    {
        return this.getHolderUpgrade1Effect2().topow(player.upg1_tm);
    },
    getHolderUpgrade2Cost(times = BigNumber('0e0'))
    {
        if (times.gt(BigNumber('0e0'))) times = times.minus(BigNumber('1e0'));
        return player_nosave.upg2_start_cost.plus(player_nosave.upg2_cost_scale.times(player.upg2_tm.plus(times)));
    },
    getHolderUpgrade2Effect()
    {
        return player.upg2_effect.times(player.upg2_tm);
    },
    getPrestigePoints()
    {
        return BigNumber.max(player.level.minus(consts.prestige).plus(BigNumber('1e0')), BigNumber('0e0')).topow(player.level.log(BigNumber('1e1')))
        .times(this.getPrestigeUpgrade2Effect())
        .times(this.getSM2Effect())
        .topow(player.sacrifice.ge(sm_requirements[6]) ? player_nosave.sm7_effect : BigNumber('1e0'))
        .times(player_nosave.prestige_points_multiplier);
    },
    getPrestigeBoost()
    {
        return player.prestige_points.plus(BigNumber('1e0')).topow(BigNumber('1.5e0'))
        .topow(player.sacrifice.ge(sm_requirements[2]) ? player_nosave.sm3_effect : BigNumber('1e0'));
    },
    getPrestigeUpgrade1Cost(times = BigNumber('0e0'))
    {
        if (times.gt(BigNumber('0e0'))) times = times.minus(BigNumber('1e0'));
        return player_nosave.pupg1_start_cost.times(player_nosave.pupg1_cost_scale.topow(player.pupg1_tm.plus(times)));
    },
    getPrestigeUpgrade1Effect()
    {
        return player_nosave.pupg1_effect.times(player.pupg1_tm);
    },
    getPrestigeUpgrade2Cost(times = BigNumber('0e0'))
    {
        if (times.gt(BigNumber('0e0'))) times = times.minus(BigNumber('1e0'));
        return player_nosave.pupg2_start_cost.times(player_nosave.pupg2_cost_scale.topow(player.pupg2_tm.plus(times)));
    },
    getPrestigeUpgrade2Effect()
    {
        return player_nosave.pupg2_effect.topow(player.pupg2_tm);
    },
    getPrestigeUpgrade3Cost()
    {
        return player_nosave.pupg3_cost;
    },
    getPrestigeUpgrade4Cost()
    {
        return player_nosave.pupg4_cost;
    },
    getSacrificeRequirement()
    {
        return consts.sacrifice.plus(player_nosave.sacrifice_scale.times(player.sacrifice.times(player.sacrifice.log(BigNumber('1e1')).plus(BigNumber('1e0'))))).floor();
    },
    getSM2Effect()
    {
        return player_nosave.sm2_effect.topow(player.sacrifice);
    },
    getSM4Effect()
    {
        return player_nosave.sm4_effect.topow(player.sacrifice.minus(sm_requirements[3].minus(BigNumber('1e0'))));
    },
    getSM5Effect()
    {
        return BigNumber('1e0').plus(player_nosave.sm5_effect.times(player.sacrifice));
    }
}

const resets = {
    prestige()
    {
        if (getComputedStyle(elements.prestige_div).display != "none")
        {
            player.prestige_unlocked = true;
            player.prestige_points = player.prestige_points.plus(currencies.getPrestigePoints());

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
            
            player_nosave.updateXp();

            updates.updateLevelNumberText();
            updates.updateLevelText();
            updates.updateHolderUpg1();
            updates.updateHolderUpg2();
            updates.updateNextText();
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

            player_nosave.updateXp();

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

            updates.updateShows();
        }
    }
}

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
        let xp = player_nosave.xp_var.times(BigNumber('1e-1').div(setting.update_time_s));
        elements.level_text.innerHTML = round(Math.max(Math.min(player.xp.div(player_nosave.level_exp).times(BigNumber('1e2')).toNumber(), 100), 0), 1) + "% | "
                                      + abb(BigNumber.max(currencies.getTimeToNextLevelRemain(), BigNumber('0e0')), 1) + " seconds" 
                                      + ((!xp.eq(BigNumber('1e0')) ? " (" + abb(xp.div(intervalS())) + "x)" : ""));
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
        + (player.level.gte(consts.prestige) ? "+" + abb(currencies.getPrestigePoints(), 2) + " prestige points</span>"
        : "Required: level " + abb(consts.prestige, undefined, false));
    },
    updatePrestigeNumber()
    {
        elements.prestige_number.innerHTML = player.prestige_points.gt(BigNumber('0e0')) ? "Prestige points: " + abb(player.prestige_points) + "<span style='color: rgb(130, 0, 0)'> = 1/" + abb(currencies.getPrestigeBoost(), 2) + "x time.</span>" : "";
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

let events = {
    isHolderHeld: false
}

document.addEventListener("DOMContentLoaded", function() {

    let data = load();
    if (data !== null)
    {
        player = load();
    }

    console.log(player);
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
    //document.addEventListener("focusout", function() { events.isHolderHeld = false; })

    
    let buy_hu1 = function() 
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
    let buy_hu2 = function()
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
    let buy_pu1 = function()
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
    elements.prestige_upgrade1.addEventListener("click", function()
    {
        buy_pu1();
    })
    let buy_pu2 = function()
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
            updates.updatePrestigeText();
            updates.updatePrestigeUpgrade2();
        }
    }
    elements.prestige_upgrade2.addEventListener("click", function()
    {
        buy_pu2();
    })
    let buy_pu3 = function()
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
    elements.prestige_upgrade3.addEventListener("click", function()
    {
        buy_pu3();
    })
    let buy_pu4 = function()
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

    new ResizeObserver(function()
    {
        
    }).observe(elements.level_in);

    function update()
    {
        setFPS();
        
        sizes.level = elements.level.offsetWidth - getComputedStyle(elements.level).borderTopWidth.slice(0, -2) * 2;
        sizes.level_in = elements.level_in.offsetWidth;

        if (player.sacrifice.ge(sm_requirements[3])) 
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

        player.xp = player.xp.plus(player_nosave.xp_var);

        if (player.xp.gte(player_nosave.level_exp) && elements.level_in.style.width == "100%")
        {
            console.log('yes');
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

            if (player.level.gte(consts.holder))
            {
                player.holder_unlocked = true;
                updates.updateShows();
            }
            if (player.level.gte(consts.holder_upgrades))
            {
                player.holder_upgrades_unlocked = true;
                updates.updateShows();
            }
            if (player.level.gte(consts.prestige))
            {
                player.prestige_unlocked = true;
                updates.updateShows();
            }
            if (player.level.gte(consts.prestige_upgrades))
            {
                player.prestige_upgrades_unlocked = true;
                updates.updateShows();
            }
            if (player.level.gte(consts.sacrifice))
            {
                player.sacrifice_unlocked = true;
                updates.updateShows();
            }
            
            player.xp = player.xp.plus(player_nosave.xp_var);

            elements.level_in.classList.add("notransition");
            elements.level_in.style.width = "0px";
            elements.level_in.offsetHeight;
            elements.level_in.classList.remove("notransition");

            updates.updateLevelNumberText();
            updates.updateNextText();
            updates.updatePrestigeText();
            updates.updateSacrificeText();
            
        }

        elements.level_in.style.transition = getLoopInterval() + "ms linear";
        elements.level_in.style.width = Math.max(Math.min(player.xp.div(player_nosave.level_exp).times(BigNumber('1e2')).toNumber(), 100), 0) + "%";

        updates.updateLevelText();

        if (events.isHolderHeld) 
        { 
            player.holder_progress = player.holder_progress.plus(currencies.getHolderProgress());
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






function round(num, acc = 1)
{
    let str = num.toString();
    const search = str.search(/[.]/);

    if (search === -1)
    {
        str += ".";
        for (i = 0; i < acc; ++i)
        {
            str += "0";
        }
    }
    else if (search > -1)
    {
        if (str.length - search > acc)
        {
            str = str.substr(0, search + acc + 1);
        }
    }
    
    return str;
}

function abb(num, acc = 2, add_zeros = true) // do not use it, it is bad
{
    if (acc === undefined) { acc = 2; }
    if (num.ge(setting.to_exp)) {; return num.toPrecision(acc + 1).replace(/[+]/, ''); }
    num = num.toNumber();
    if (num < 1) { return add_zeros ? round(num, acc) : num; }
    const table = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'De', 'Ude', 'Dde', 'Tde', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg'];
    const eln = Math.floor(Math.log10(num) / 3);
    

    retn = num / Math.pow(10, eln * 3);
    if (eln == 0 && !add_zeros) { acc = 0; retn = Math.floor(retn); }
    const ret = (acc > 0 ? round(retn, acc) : retn) + table[eln];

    return ret;
}

function abbi(num) { return abb(num, undefined, false); }

function save()
{
    if (setting.save)
    {
        localStorage.setItem('Data', JSON.stringify(player));
    }
}
function load()
{
    let data = localStorage.getItem('Data');
    data = JSON.parse(data);
    for (let p in data)
    {
        if (data.hasOwnProperty(p))
        {
            if (typeof data[p] === 'string')
            {
                if (data[p].includes('e+') || data[p].includes('e-'))
                {
                    data[p] = BigNumber(data[p]);
                }
            }
            else if (typeof data[p] === 'object')
            {
                for (let i = 0; i < data[p].length; ++i)
                {
                    for (let j in data[p][i])
                    {
                        if (data[p][i][j].includes('e+') || data[p][i][j].includes('e-'))
                        {
                            data[p][i][j] = BigNumber(data[p][i][j]);
                        }
                    }
                }
            }
        }
    }
    return data;
}

function setFPS(set)
{
    let thisLoop = new Date();
    let fps = 1e3 / (thisLoop - player_nosave.lastLoop);
    if (set) player_nosave.lastLoop = thisLoop;
    thisLoop = undefined; // it's manually deleting, right?
    return fps;
}

function getLoopIntervalBN()
{
    return setting.update_time_s.times(BigNumber('1e3')).div((
        setFPS(false) == 0 ? BigNumber(setFPS()) : BigNumber('1e0').times(BigNumber('6e1'))));
}
function intervalS() { return getLoopIntervalBN().div(BigNumber('1e3')); }

function getLoopInterval() { return getLoopIntervalBN().toNumber(); }