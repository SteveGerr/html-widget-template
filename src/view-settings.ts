import { DataSettings, ViewSettings } from 'ptnl-constructor-sdk';
import {
    CreateViewSettings,
    ViewSettingsValidation,
    select,
    input,
} from 'ptnl-constructor-sdk/config';
import { themes } from './constants';
import { EViewOption } from './types';
import { getSelectItems } from './utils';

export const createViewSettings: CreateViewSettings<DataSettings> = ({
    dataSettings,
    viewSettings,
}: {
    dataSettings: DataSettings;
    viewSettings: ViewSettings;
}) => {
    return [
        input({
            key: EViewOption.HTML,
            label: {
                ru: 'HTML',
                en: 'HTML',
            },
            defaultValue: '<strong>Template</strong>',
        }),
        input({
            key: EViewOption.Decimal,
            label: {
                ru: 'Знаков после запятой',
                en: 'Decimal places',
            },
            defaultValue: '2',
        }),
    ];
};

export const validation: ViewSettingsValidation = {};
