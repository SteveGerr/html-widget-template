export const getRegExpTpl = (tpl, data) => {
    let index = 0;

    if (/.+\?.+:.+$/gim.test(tpl)) {
        tpl = getIfTpl(tpl, data);
    }

    if (/_to_/.test(tpl)) {
        tpl = getToTpl(tpl, data);
    }

    if (/_percentTo_/.test(tpl)) {
        tpl = getPercentToTpl(tpl, data);
    }

    if (/first_/gim.test(tpl)) {
        index = 0;
        tpl = tpl.replace('first_', '');
    } else if (/last_/gim.test(tpl)) {
        index = data.length - 1;
        tpl = tpl.replace('last_', '');
    } else if (/prev_/gim.test(tpl)) {
        index = data.length >= 2 && index !== 0 ? index - 1 : index;
        tpl = tpl.replace('prev_', '');
    } else if (/next_/gim.test(tpl)) {
        index = data.length >= 2 ? index + 1 : index;
        tpl = tpl.replace('next_', '');
    }

    if (/col_\d/.test(tpl)) {
        tpl = data[index][tpl];
    }

    return tpl;
};

export const getIfTpl = (tpl, data) => {
    const [ifTpl, varTpl] = tpl.split(' ? ');
    const [trueTpl, falseTpl] = varTpl.split(' : ');
    const sign = ifTpl.match(/ [><=]? /)[0];
    let [op1, op2] = ifTpl.split(sign);

    if (/col_\d/.test(op1)) {
        op1 = getRegExpTpl(op1, data);
    }

    if (/col_\d/.test(op2)) {
        op2 = getRegExpTpl(op2, data);
    }

    const result =
        (sign === ' < ' && op1 < op2) ||
        (sign === ' > ' && op1 > op2) ||
        (sign === ' = ' && op1 == op2);

    return result ? trueTpl : falseTpl;
};

export const getToTpl = (tpl, data) => {
    let [op1, op2] = tpl.split('_to_');

    if (/col_\d/.test(op1)) {
        op1 = getRegExpTpl(op1, data);
    }

    if (/col_\d/.test(op2)) {
        op2 = getRegExpTpl(op2, data);
    }

    return op1 / op2;
};

export const getPercentToTpl = (tpl, data) => {
    let [op1, op2] = tpl.split('_percentTo_');

    if (/col_\d/.test(op1)) {
        op1 = getRegExpTpl(op1, data);
    }

    if (/col_\d/.test(op2)) {
        op2 = getRegExpTpl(op2, data);
    }

    return (op1 * 100) / op2;
};
