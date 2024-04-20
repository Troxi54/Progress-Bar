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
        localStorage.setItem('Progress bar', btoa(JSON.stringify(player)));
    }
}
function load()
{
    let data = localStorage.getItem('Progress bar');
    if (data)
    {
        data = JSON.parse(atob(data));
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