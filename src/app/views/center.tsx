import { pathAssign, pathAtom, pathReport, pathTie, } from "app/hooks";
import { to62 } from "tonwa-com";
import { BizPhraseType } from "uqs/UqDefault";
import { pathSheet } from "./Biz/Sheet";
import { SvgDataCenter, SvgRelationCenter, SvgSheetCenter, SvgUserManagement } from "svgs";
import { JSX } from "react";

export interface CenterItem {
    path: string;
    caption: string;
    icon?: string | JSX.Element;
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
const flow: CenterItem = {
    path: 'flow-center',
    caption: '流程中心',
    icon: <SvgRelationCenter />, // 'keyboard-o',
    iconColor: 'text-success',
    getPath: (id: number) => `flow/${to62(id)}`,
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
    icon: <SvgSheetCenter />,
    getPath: pathSheet, // (id: number) => `sheet/${to62(id)}`,
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
    icon: <SvgRelationCenter />, // 'link',
    iconColor: 'text-success',
    getPath: pathTie,
};
const io: CenterItem = {
    path: 'io',
    caption: '数据接口',
    icon: <SvgDataCenter />, // 'refresh',
    iconColor: 'text-info',
};
const me: CenterItem = {
    caption: '我的',
    path: 'my',
    icon: 'user-o',
    iconColor: 'text-warning',
};
const setting: CenterItem = {
    caption: '权限设置',
    path: 'act-setting',
    icon: 'cog',
    iconColor: 'text-info',
};
const users: CenterItem = {
    caption: '用户管理',
    path: 'users',
    icon: <SvgUserManagement />, // 'users',
    iconColor: 'text-info',
};
const userSum: CenterItem = {
    caption: '用户业绩',
    path: 'user-sum',
};
const achieve: CenterItem = {
    caption: '业绩设置',
    path: 'admin-achieve',
};
const compile: CenterItem = {
    path: "compile",
    caption: '业务脚本',
};
export const centers: {
    editing: CenterItem,
    atom: CenterItem,
    flow: CenterItem,
    sheet: CenterItem,
    report: CenterItem,
    assign: CenterItem,
    tie: CenterItem,
    io: CenterItem,
    me: CenterItem,
    users: CenterItem,
    setting: CenterItem,
    userSum: CenterItem,
    achieve: CenterItem,
    compile: CenterItem,
} = {
    editing, atom, flow, sheet, report, assign, tie, io, me, setting, users, userSum, achieve, compile
}
