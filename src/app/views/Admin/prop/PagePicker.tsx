import { ChangeEvent, useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { FA, List, LMR, Sep } from "tonwa-com";
import { NextRight, NextTop } from "./NextTop";
import { PageNextProps } from "./types";

enum EnumPicker {
    往来单位,
    商品,
};

interface PickerItem {
    type?: EnumPicker;
    Picker: () => JSX.Element;
    caption?: string;
}

const arrTypes = [
    EnumPicker.往来单位,
    EnumPicker.商品,
];
const pickers: { [type in EnumPicker]: PickerItem } = {
    [EnumPicker.商品]: { Picker: PickerProduct, caption: '好商品' },
    [EnumPicker.往来单位]: { Picker: PickerContact, },
};
(function () {
    for (let i of arrTypes) pickers[i].type = i;
})();

function PickerProduct() {
    return <Page header="商品">
        PickerProduct
    </Page>
}

function PickerContact() {
    return <Page header="往来单位">
        PickerContact
    </Page>
}

export function PagePicker(props: PageNextProps) {
    let { name, type } = props;
    const { closeModal } = useModal();
    const [visible, setVisible] = useState(false);
    const selected = useRef(undefined);
    function ViewItem({ value }: { value: PickerItem; }) {
        let { type, caption } = value;
        if (caption?.trim().length === 0) caption = undefined;
        return <label className="px-3 py-2 w-12c">
            <input className="me-2" type="radio" name="a" value={EnumPicker[type]} />
            <span>{caption ?? EnumPicker[type]}</span>
        </label>;
    }
    function onChange(evt: ChangeEvent<HTMLInputElement>) {

    }
    function onSave() {

    }
    return <Page header="属性 - 基础信息" right={<NextRight />}>
        <NextTop {...props} />
        <List className="d-flex flex-wrap border-top border-bottom px-4 py-2"
            items={arrTypes.map(v => pickers[v])}
            ViewItem={ViewItem}
        />
        {visible && <button className="btn btn-primary" onClick={onSave}>提交</button>}
    </Page>;
}
