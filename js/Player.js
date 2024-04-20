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
    xp_multiplier: BigNumber('1e100'),

    level_exp: BigNumber(''),
    setLevel(num) { player.level = num; currencies.setXpToNextLevel(); },

    xp_var: BigNumber(''),
    updateXp() { this.xp_var = currencies.getXp(); },

    holder_effect_var: BigNumber(''),
    updateHolder() { this.holder_effect_var = currencies.getHolderEffect(); },

    levels_: levels.map(object => ({ ...object })),

    holder_progress_multiplier: BigNumber('1e0'),

    upg1_start_cost: consts.holder_upgrades,
    upg1_cost_scale: BigNumber('5e0'),

    upg2_start_cost: consts.holder_upgrades,
    upg2_cost_scale: BigNumber('5e0'),

    prestige_points_var: BigNumber(''),
    updatePrestige() { this.prestige_points_var = currencies.getPrestigePoints(); },

    prestige_points_multiplier: BigNumber('1e0'),

    prestige_effect_var: BigNumber(''),
    updatePrestigeEffect() { this.prestige_effect_var = currencies.getPrestigeBoost(); },

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

let events = {
    isHolderHeld: false,
    isPrestigePressed: false,
    isSacrificePressed: false
}