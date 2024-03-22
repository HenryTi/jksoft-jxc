import { pathAssign, pathAtom, pathReport, pathSheet, pathSE, pathTie, } from "app/hooks";
import { to62 } from "tonwa-com";
import { BizPhraseType } from "uqs/UqDefault";

export interface CenterItem {
    path: string;
    caption: string;
    icon?: string;
    iconColor?: string;
    phrase?: BizPhraseType;
    getPath?: (id: number) => string;
}

const editing: CenterItem = {
    path: 'editing-center',
    caption: '操作中心',
    icon: 'keyboard-o',
    iconColor: 'text-danger',
    getPath: (id: number) => `sheet/${to62(id)}`,
};
const atom: CenterItem = {
    path: 'atom-center',
    caption: '档案中心',
    icon: 'database',
    iconColor: 'text-success',
    getPath: pathAtom.list,
};
const sheet: CenterItem = {
    path: 'sheet-center',
    caption: '单据中心',
    icon: 'file-o',
    getPath: pathSheet, // (id: number) => `sheet/${to62(id)}`,
};
const se: CenterItem = {
    path: 'se-center',
    caption: '新单据中心',
    icon: 'file-o',
    getPath: pathSE, // (id: number) => `sheet/${to62(id)}`,
};

const report: CenterItem = {
    path: 'report',
    caption: '报表中心',
    icon: 'calculator',
    iconColor: 'text-info',
    getPath: pathReport,
};
const assign: CenterItem = {
    path: 'assign-center',
    caption: '赋值中心',
    icon: 'sliders',
    iconColor: 'text-danger',
    getPath: pathAssign,
};

const tie: CenterItem = {
    path: 'tie-center',
    caption: '关系中心',
    icon: 'link',
    iconColor: 'text-success',
    getPath: pathTie,
};
const io: CenterItem = {
    path: 'io',
    caption: '数据接口',
    icon: 'refresh',
    iconColor: 'text-info',
};
const me: CenterItem = {
    caption: '我的',
    path: 'my',
    icon: 'user-o',
    iconColor: 'text-warning',
};
const setting: CenterItem = {
    caption: '操作设置',
    path: 'act-setting',
    icon: 'cog',
    iconColor: 'text-info',
};
const user: CenterItem = {
    caption: '用户管理',
    path: 'admin-user',
};
const achieve: CenterItem = {
    caption: '业绩设置',
    path: 'admin-achieve',
};
const compile: CenterItem = {
    path: "compile",
    caption: '设计',
};
export const centers: { [name: string]: CenterItem } = {
    editing, atom, se, sheet, report, assign, tie, io, me, setting, user, achieve, compile
}
