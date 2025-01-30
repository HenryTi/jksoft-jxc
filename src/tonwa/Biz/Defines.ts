import { EntityID } from "./EntityAtom";

export enum BizPhraseType {
    any = 0,
    atom = 11,
    fork = 12,
    bud = 13,
    budGroup = 14,
    combo = 16,
    sheet = 101,
    main = 102,
    detail = 103,
    pend = 104,
    detailAct = 111,
    query = 151,
    pick = 161,
    role = 201,
    permit = 202,
    options = 301,
    tree = 401,
    tie = 501,
    report = 601,
    in = 701,
    out = 700,
    ioApp = 710,
    ioSite = 711,
    book = 901,
    assign = 902,
    key = 1001,
    prop = 1011,
    optionsitem = 1031,
    console = 6001,
    templet = 6101,
    print = 6102
}
/*
export enum BudDataType {
    none = 0,
    int = 11,
    atom = 12,
    radio = 13,
    check = 14,
    ID = 19,
    dec = 21,
    char = 31,
    str = 32,
    date = 41,
    datetime = 42,
    optionItem = 81,
    fork = 95,
    any = 96,
    unique = 97,
    user = 98,
    arr = 99
}
*/
export enum BizBudFlag {
    index = 1
}

export class UI {
    readonly caption: string;
    readonly icon: string;
    readonly iconColor: string;

    constructor(ui: any, uiDefault?: any) {
        if (ui !== undefined) {
            const { caption: uiCaption, icon: uiIcon } = ui;
            if (uiCaption !== undefined) this.caption = uiCaption;
            if (uiIcon !== undefined) {
                let parts = (uiIcon as string).split(',');
                this.icon = parts[0].trim();
                if (parts.length > 1) {
                    let iconColor = parts[1].trim();
                    if (iconColor.indexOf('-') <= 0) iconColor = 'text-' + iconColor;
                    this.iconColor = iconColor;
                }
            }
        }
        if (uiDefault === undefined) return;
        for (let i in uiDefault) {
            if ((this as any)[i] === undefined) {
                (this as any)[i] = uiDefault[i];
            }
        }
    }
}

export interface UIStyle {
    "class": string;
    caption: string;
    icon: string;
    iconColor: string;
    format: string;
    edit: 'pop' | 'dropdown' | 'radio';
    fraction: number;
    show: boolean;
    required: boolean;
};
