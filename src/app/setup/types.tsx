import { PropDataType } from "uqs/UqDefault";
import { PageRadio } from "./PageRadio";
import { PagePicker } from "./PagePicker";

export interface RadioItem {
    id?: number;
    name: string;
    caption?: string;
}

export interface PageNextProps {
    id: number;
    name: string;
    caption?: string;
    type: PropDataType;
    items?: RadioItem[];
}

type PageNext = (props: PageNextProps) => JSX.Element;

export interface TypeItem {
    type?: PropDataType,
    caption: string;
    PageNext?: PageNext;
    memo?: string;
};

export const arrType: PropDataType[] = [
    PropDataType.char,
    PropDataType.picker,
    PropDataType.radio,
    PropDataType.check,
    PropDataType.bigint,
    PropDataType.number,
    PropDataType.date,
    PropDataType.datetime,
    PropDataType.text,
];

export const collPropDataType: { [type in PropDataType]: TypeItem } = {
    [PropDataType.char]: { caption: '文本', memo: '长度100以内的文本' },
    [PropDataType.picker]: { caption: 'ID', PageNext: PagePicker, memo: '选择基础信息' },
    [PropDataType.radio]: { caption: '单选项', PageNext: PageRadio, memo: '只能选一项' },
    [PropDataType.check]: { caption: '多选项', PageNext: PageRadio, memo: '可以选多项' },
    [PropDataType.bigint]: { caption: '整数' },
    [PropDataType.number]: { caption: '4位小数', memo: '固定4位小数' },
    [PropDataType.date]: { caption: '日期', memo: '年月日' },
    [PropDataType.datetime]: { caption: '时间', memo: '日期加时间' },
    [PropDataType.text]: { caption: '大文本', memo: '16M以内的大文本' },
    [PropDataType.none]: undefined,
    [PropDataType.bool]: undefined,
    [PropDataType.item]: undefined,
    [PropDataType.itemPicker]: undefined,
    [PropDataType.type]: undefined,
    [PropDataType.group]: undefined,
};

(function () {
    for (let i of arrType) collPropDataType[i].type = i;
})();
