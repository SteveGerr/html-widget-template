export enum EBlockKey {
    VALUES = 'VALUES',
    Series = 'Series',
    Y = 'Y',
}

export enum EViewOption {
    Themes = 'Themes',
    ThemeReverse = 'ThemeReverse',
    //
    HTML = 'HTML',
    Decimal = 'Decimal',
}

export type filteredValuesType = {
    [key: string | number]: true;
};

export type legendDataType = {
    name: string;
    itemStyle?: {
        color: string;
        opacity?: number;
    };
};
