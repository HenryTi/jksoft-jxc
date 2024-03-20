export interface Theme {
    bootstrapContainer: string;
    labelBox: LabelBoxCss;
    labelBoxH: LabelBoxCss;
    labelBoxV: LabelBoxCss;
    small: string;
}

class ThemeValues implements Theme {
    bootstrapContainer: string = ' container-fluid ';
    labelBox: LabelBoxCss = labelBoxCssV;
    labelBoxH: LabelBoxCss = labelBoxCssH;
    labelBoxV: LabelBoxCss = labelBoxCssV;
    small = ' small ';
}

export interface LabelBoxCss {
    colon: boolean;
    cnRowCols: string;
    cnColLabel: string;
    cnColContent: string;
    cnGX: string;
    cnLabelContainer: string;
    cnContent: string;
    cnLabel: string;
}
/*
const cnCombo: CnCombo = {
    cnRowCols: ' gx-0 row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
}

const cnCombo: Css = {
    cnRowCols: ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: '',
    cnColContent: '',
}
*/
// let cnGX = ' gx-0 ';
// let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-end d-flex align-items-center flex-row justify-content-end `; //  small
// let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';
// let cnLabel = ' text-nowrap text-truncate ';
/*
let cnGX = ' ';
let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-start d-flex align-items-center flex-row justify-content-start `; //  small
let cnLabel = ' text-nowrap text-truncate ps-2 pb-1';
let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';
*/
const cnRows = '  row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-6 ';
const labelBoxCssH: LabelBoxCss = {
    colon: true,
    cnRowCols: ' gx-0 ' + cnRows,
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
    cnGX: ' gx-0 ',
    cnLabelContainer: ` col-4 text-secondary text-end d-flex align-items-center flex-row justify-content-end `, //  small
    cnContent: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
    cnLabel: ' text-nowrap text-truncate ',
}

const labelBoxCssV: LabelBoxCss = {
    colon: false,
    cnRowCols: cnRows,
    cnColLabel: '',
    cnColContent: '',
    cnGX: ' ',
    cnLabelContainer: ` text-secondary text-start d-flex align-items-center flex-row justify-content-start `, //  small
    cnLabel: ' text-nowrap text-truncate pb-1',
    cnContent: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
}

// export const labelBoxCss = labelBoxCssV;

export const theme = new ThemeValues();

