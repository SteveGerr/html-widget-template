import {
    block,
    Config,
    DataQueryFunction,
    DataQueryMethod,
    drilldown,
    filter,
    sort,
} from 'ptnl-constructor-sdk/config';
import { ColumnType } from 'ptnl-constructor-sdk/data';
import { EBlockKey } from './types';

export const config: Config = {
    label: {
        ru: 'HTML виджет с шаблонам',
        en: 'html widget with template',
    },
    icon: 'icon.svg',

    dataSettings: {
        method: DataQueryMethod.Aggregate,

        blocks: [
            block({
                key: EBlockKey.VALUES,
                dataQueryFunction: DataQueryFunction.Group,
                label: {
                    ru: 'Значения',
                    en: 'VALUES',
                },
                columnTypes: [
                    ColumnType.Number,
                    ColumnType.String,
                    ColumnType.Date,
                ],
            }),
            block({
                key: EBlockKey.Series,
                dataQueryFunction: DataQueryFunction.Group,
                label: {
                    ru: 'Серия',
                    en: 'Series',
                },
                columnTypes: [ColumnType.String, ColumnType.Date],
                max: 1,
            }),
            filter(),
            sort(),
            drilldown({
                source: EBlockKey.VALUES,
                additionalFilterSources: [EBlockKey.Series],
            }),
        ],
    },
};
