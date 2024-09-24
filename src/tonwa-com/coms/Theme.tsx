const labelCss = {
    // color: ' text-body-tertiary ',
    color: ' text-label ',
}

export interface Theme {
    bootstrapContainer: string;
    labelBox: LabelBoxCss;
    labelBoxH: LabelBoxCss;
    labelBoxV: LabelBoxCss;
    small: string;
    labelColor: string;
    value: string;
    pend: string;
    pendOver: string;
}

const valueColor = ' text-info ';
class ThemeValues implements Theme {
    bootstrapContainer: string = ' container-fluid ';
    labelBox: LabelBoxCss = labelBoxCssV;
    labelBoxH: LabelBoxCss = labelBoxCssH;
    labelBoxV: LabelBoxCss = labelBoxCssV;
    small = ' small ';
    labelColor = labelCss.color;
    sum = valueColor;
    sumBold = ' fw-bold ' + valueColor;
    value = ' fw-bold ' + valueColor;
    price = valueColor;
    amount = valueColor;
    pend = ' text-success ';
    pendOver = ' text-danger ';
    pendValue = valueColor;
}

export interface LabelBoxCss {
    colon: boolean;
    cnRowCols: string;
    cnRowColsSm: string;
    cnColLabel: string;
    cnColContent: string;
    cnGX: string;
    cnLabelContainer: string;
    cnReadonly: string;
    cnLabel: string;
}

const cnRows = '  row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-6 ';
// const cnRowsSm = '  row row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-6 row-cols-xl-8 row-cols-xxl-12 ';
const cnRowsSm = '  row row-cols-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6 row-cols-xxl-7 ';
const labelBoxCssH: LabelBoxCss = {
    colon: true,
    cnRowCols: ' gx-0 ' + cnRows,
    cnRowColsSm: ' gx-0 ' + cnRowsSm,
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
    cnGX: ' gx-0 ',
    cnLabelContainer: ` col-4 ${labelCss.color} text-end d-flex align-items-center flex-row justify-content-end `, //  small
    cnReadonly: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
    cnLabel: ' text-nowrap text-truncate ',
}

const labelBoxCssV: LabelBoxCss = {
    colon: false,
    cnRowCols: cnRows,
    cnRowColsSm: cnRowsSm,
    cnColLabel: '',
    cnColContent: ' text-dark ',
    cnGX: ' ',
    cnLabelContainer: ` ${labelCss.color} text-start d-flex align-items-center flex-row justify-content-start `, //  small
    cnLabel: ' text-nowrap text-truncate ',
    cnReadonly: ' d-flex align-items-center border tonwa-bg-gray-1 rounded pt-1 pb-2 px-2 text-nowrap text-truncate ',
}

// export const labelBoxCss = labelBoxCssV;

export const theme = new ThemeValues();

