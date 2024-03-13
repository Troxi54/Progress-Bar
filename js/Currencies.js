const currencies = {
    getXp()
    {
        return BigNumber('1e1')
        .times(intervalS())
        .times(player_nosave.xp_multiplier)
        .times(player_nosave.holder_effect_var)
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