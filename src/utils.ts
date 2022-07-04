import { select } from 'ptnl-constructor-sdk/config';
import { EViewOption } from './types';

export const getSelectItems = (item) => {
    const [value, ru, en] = item;
    return {
        label: {
            ru,
            en,
        },
        value,
    };
};

export const addThousandsSeparator = (value: number | string): string => {
    let numberSplit = value.toString().split('.');
    numberSplit[0] = numberSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
    return numberSplit.join('.');
};

export const getColors = (settings, length, themeColors) => {
    if (settings[EViewOption.Themes] === 'LIGHTS') {
        if (length <= 5) {
            const redColor = themeColors[4];
            themeColors = themeColors.slice(0, length);

            themeColors[length - 1] = redColor;
        }
    }

    const themeReverse = settings[EViewOption.ThemeReverse];
    const reverseTheme = [...themeColors].reverse();

    return themeReverse ? reverseTheme : themeColors;
};

export const getLabelTpl = (params, type, text) => {
    let { name, value, seriesName, percent } = params;
    let result;

    if (type === 'name') {
        result = name;
    } else if (type === 'series') {
        result = seriesName;
    } else if (type === 'percent') {
        result = percent;
    } else {
        result = value.toLocaleString();
    }

    return result + text;
};

export const getHR = () => {
    return select({
        key: 'Horizontal',
        label: {
            ru: '',
            en: '',
        },
        options: [
            {
                label: {
                    ru: '————————————————————————————',
                    en: '————————————————————————————',
                },
                value: 'hr',
            },
        ],
        defaultValue: 'hr',
    });
};
