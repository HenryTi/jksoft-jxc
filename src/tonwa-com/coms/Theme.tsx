const labelCss = {
    color: ' text-body-tertiary ',
}

export interface Theme {
    bootstrapContainer: string;
    labelBox: LabelBoxCss;
    labelBoxH: LabelBoxCss;
    labelBoxV: LabelBoxCss;
    small: string;
    labelColor: string;
    value: string;
}

class ThemeValues implements Theme {
    bootstrapContainer: string = ' container-fluid ';
    labelBox: LabelBoxCss = labelBoxCssV;
    labelBoxH: LabelBoxCss = labelBoxCssH;
    labelBoxV: LabelBoxCss = labelBoxCssV;
    small = ' small ';
    labelColor = labelCss.color;
    sum = ' fs-larger text-info ';
    value = ' fw-bold fs-larger text-primary ';
    price = ' text-dark ';
    amount = ' text-dark ';
}

export interface LabelBoxCss {
    colon: boolean;
    cnRowCols: string;
    cnColLabel: string;
    cnColContent: string;
    cnGX: string;
    cnLabelContainer: string;
    cnReadonly: string;
    cnLabel: string;
}

const cnRows = '  row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-6 ';
const labelBoxCssH: LabelBoxCss = {
    colon: true,
    cnRowCols: ' gx-0 ' + cnRows,
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
    cnGX: ' gx-0 ',
    cnLabelContainer: ` col-4 text-body-secondary text-end d-flex align-items-center flex-row justify-content-end `, //  small
    cnReadonly: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
    cnLabel: ' text-nowrap text-truncate ',
}

const labelBoxCssV: LabelBoxCss = {
    colon: false,
    cnRowCols: cnRows,
    cnColLabel: '',
    cnColContent: ' text-dark ',
    cnGX: ' ',
    cnLabelContainer: ` ${labelCss.color} text-start d-flex align-items-center flex-row justify-content-start `, //  small
    cnLabel: ' text-nowrap text-truncate pb-1',
    cnReadonly: ' d-flex align-items-center border tonwa-bg-gray-1 rounded pt-1 pb-2 px-2 text-nowrap text-truncate ',
}

// export const labelBoxCss = labelBoxCssV;

export const theme = new ThemeValues();

