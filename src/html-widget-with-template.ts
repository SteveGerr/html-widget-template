import { Declare, SingleData, Widget } from 'ptnl-constructor-sdk';
import { Column, Filter } from 'ptnl-constructor-sdk/data';
import { getRegExpTpl } from './regexp_utils';
import {
    EBlockKey,
    EViewOption,
    filteredValuesType,
    legendDataType,
} from './types';
//

@Declare({
    provideCssVariables: true,
})
export class HtmlWidgetWithTemplate extends Widget implements SingleData {
    readonly data!: SingleData['data'];
    readonly dataSettings!: SingleData['dataSettings'];
    readonly opacity = 0.2;

    private filteredValues: filteredValuesType = {};
    private hasCategory = false;
    private hasFilters = false;
    private labels: string[] = [];
    private legend: legendDataType[] = [];
    private seriesNames: string[] = [];
    private themeColors: string[] = [];
    private widget: HTMLElement = document.getElementById('root');

    ///////////////////////////////////////////////////////////

    private getSeriesOptions() {
        const { columnsByBlock } = this.dataSettings;

        let seriesOptions: [] = [];
        let categories: Column[] | null[] | [] = [];

        if (this.hasCategory) {
            categories = columnsByBlock[EBlockKey.Series];
        } else {
            categories = [columnsByBlock[EBlockKey.VALUES][0]];
        }

        categories.forEach((category) => {
            let categoryNames: string[] = Array.from(
                new Set(this.getDataByColumn(category.path)),
            );

            categoryNames.forEach((categoryName, index) => {
                let categoryData = this.data.filter(
                    (item) => item[category.path] === categoryName,
                );

                // @ts-ignore
                seriesOptions.push(categoryData);
            });
        });

        return seriesOptions;
    }

    private getChartOptions() {
        const { columnsByBlock } = this.dataSettings;
        const settings = this.viewSettings;

        if (
            Array.isArray(columnsByBlock[EBlockKey.Series]) &&
            columnsByBlock[EBlockKey.Series].length
        ) {
            this.hasCategory = true;
        } else {
            this.hasCategory = false;
        }

        const series: [][] = this.getSeriesOptions();
        const serie: [] = series[0];

        let tplString = settings[EViewOption.HTML];

        const jsTags = new RegExp('javascript|link|meta|css|iframe', 'gim');
        tplString = tplString.replace(jsTags, 'div');
        tplString = tplString.replace(/\t/gm, '');

        let tplArr = tplString.match(/<%= .{3,}? %>/gim) || [];


        tplArr.forEach((tpl) => {
            const clearTpl = tpl.replace(/^<%= | %>$/gi, '');
            let newTpl = getRegExpTpl(clearTpl, serie);
            let newTplString = newTpl.toString();


            if (
                !isNaN(parseInt(newTpl)) &&
                !/(\d{1,4}[.-]){2,3}/.test(newTplString)
            ) {
                if (/\.|,/.test(newTplString)) {
                    const decimal = settings[EViewOption.Decimal];

                    // Ежели, число с деситичной дробью
                    if (+decimal) {
                        // Вытягиваем целую часть и после запятой
                        let [int, float] = newTplString.split(/\.|,/);
                        // Обрезаем дробную часть до 2х знаков
                        float = float.slice(0, decimal);
                        // Соединяем в строку и добавляем пробелы
                        newTpl = [int, float].join(',').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    }
                }

                newTpl = newTpl.toLocaleString();
            }

            tplString = tplString.replace(tpl, newTpl);
        });

        this.widget.innerHTML = tplString;
    }

    ///////////////////////////////////////////////////////////

    private getFilteredData = (filter: Filter): void => {
        if (Array.isArray(filter.value) && filter.value.length) {
            this.filteredValues = (filter.value as (string | number)[]).reduce(
                (acc, val) => ({ ...acc, [val]: true }),
                {},
            );
            this.hasFilters = true;
        } else {
            this.filteredValues = {};
            this.hasFilters = false;
        }
    };

    private getDataByColumn = (column: string): string[] => {
        return this.data.map((item) => item[column]);
    };

    private getDataUnique = (column: string): string[] => {
        const { columnsByBlock } = this.dataSettings;
        const data = this.getDataByColumn(columnsByBlock[column][0]?.path);

        return Array.from(new Set(data));
    };

    private chartInit = () => {
        const settings = this.viewSettings;

        this.getChartOptions();
    };

    private chart = () => {
        this.chartInit();

        return true;
    };

    onLangChange(): void {
        this.getChartOptions();
    }

    onThemeChange(): void {
        this.getChartOptions();
    }

    onChange(): void {
        this.chart();

        this.ready();
    }

    onInit(): void {
        this.dataSettings.events.onOtherFilterChange = (filter) => {
            this.getFilteredData(filter);
            this.getChartOptions();
        };
    }
}
