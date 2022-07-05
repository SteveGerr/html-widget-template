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

    if (/_percent_of_/.test(tpl)) {
        console.log("getPercentToTplMinusNum");
        tpl = getPercentToTplMinusNum(tpl, data);
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

/** Условия */
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

/** Деление */
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

/** Процент от числа */
export const getPercentToTpl = (tpl, data) => {
    // ["col_2", "col_3"] = "col_2_percentTo_col_3".split('_percentTo_')
    let [op1, op2] = tpl.split('_percentTo_');

    if (/col_\d/.test(op1)) {
        op1 = getRegExpTpl(op1, data);
    }

    if (/col_\d/.test(op2)) {
        op2 = getRegExpTpl(op2, data);
    }

    return (op1 * 100) / op2;
};

/** Процент от числа минус число */
export const getPercentToTplMinusNum = (tpl, data) => {

    // ["col_2", "col_3_minus_100"] = "col_2_percent_of_col_3_minus_100".split('_percent_of_')
    let [op1, op2] = tpl.split('_percent_of_');
    // ["col_3", "number"] = "col_3_minus_100".split('_minus_')
    let [op3, deductible] = op2.split('_minus_');

    if (/col_\d/.test(op1)) {
        op1 = getRegExpTpl(op1, data);
    }

    if (/col_\d/.test(op3)) {
        op3 = getRegExpTpl(op3, data);
    }

    return +((op1 * 100) / op3).toFixed(4) - +deductible;
};
