BigNumber.set({ 
    POW_PRECISION: 12,
    EXPONENTIAL_AT: 0,
    RANGE: Math.floor(76081 ** 1.5)});

let elements;

const setting = {
    save: true,
    auto_save: 10,
    update_time_s: BigNumber('1e-0'),
    to_exp: BigNumber('1e50'),
    pp_i: .05,
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

const sm_requirements = [ BigNumber('1e0'), BigNumber('2e0'), BigNumber('3e0'), BigNumber('4e0'), BigNumber('5e0'), BigNumber('7e0'), BigNumber('1e1') ];

const keys = {
    "Holder" : 'h',
    "Prestige" : 'p',
    "Sacrifice" : 's'
}