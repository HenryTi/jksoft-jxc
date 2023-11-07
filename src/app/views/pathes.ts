/*
export const pathAtomCenter = 'atom-center';
export const pathSheetCenter = 'sheet-center';
export const pathReportCenter = 'report';
export const pathAssignCenter = 'assign-center';
export const pathTieCenter = 'tie-center';
export const captionTieCenter = '关系中心';
export const pathMy = 'my';
export const pathActSetting = 'act-setting';
*/
export interface Center {
    path: string;
    caption: string;
    icon: string;
    iconColor?: string;
}

export const centers = {
    atom: {
        path: 'atom-center',
        caption: '档案中心',
        icon: 'database',
        iconColor: 'text-succeed',
    },
    sheet: {
        path: 'sheet-center',
        caption: '单据中心',
        icon: 'file-o',
    },
    report: {
        path: 'report',
        caption: '报表中心',
        icon: 'calculator',
        iconColor: 'text-info',
    },
    assign: {
        path: 'assign-center',
        caption: '赋值中心',
        icon: 'sliders',
        iconColor: 'text-danger'
    },
    tie: {
        path: 'tie-center',
        caption: '关系中心',
        icon: 'link',
        iconColor: 'text-success',
    },
    me: {
        caption: '我的',
        path: 'my',
        icon: 'user-o',
        iconColor: 'text-warning',
    },
    setting: {
        caption: '操作设置',
        path: 'act-setting',
        icon: 'cog',
        iconColor: 'text-info',
    },
}
