import { IDView, LabelRowEdit, OpenModal, PickProps, useModal } from "tonwa-app";
import { ViewPropProps } from "./useBizAtom";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { BizBud, BudAtom } from "app/Biz";
import { useState } from "react";

interface OpProps {
    saveProp: (newValue: string | number) => Promise<void>;
    pickValue?: (props: PickProps) => Promise<string | number>;
}

function ViewProp({ label, name, readonly, value: initValue, saveProp, id, pickValue, ValueTemplate }: ViewPropProps & OpProps) {
    let uqApp = useUqApp();
    let [value, setValue] = useState(initValue);
    async function onValueChanged(value: string | number) {
        await saveProp(value);
        let data = uqApp.pageCache.getData<PageMoreCacheData>();
        if (data) {
            let item = data.getItem<{ id: number }>(v => v.id === id) as any;
            if (item) item[name] = value;
        }
        setValue(value);
    }
    return <LabelRowEdit label={label}
        value={value} readonly={readonly}
        onValueChanged={onValueChanged}
        pickValue={pickValue}
        ValueTemplate={ValueTemplate} />
}

export function ViewPropMain(props: ViewPropProps) {
    const { id, name, savePropMain } = props;
    async function saveProp(newValue: string | number) {
        await savePropMain(id, name, newValue);
    }
    return <ViewProp {...props} saveProp={saveProp} />
}

interface BudValue {
    pickValue: (props: PickProps) => Promise<string | number>;
    ValueTemplate: (props: { value: any }) => JSX.Element;
}
export function ViewPropEx(veiwProps: ViewPropProps & { bizBud: BizBud; }) {
    const { openModal } = useModal();
    const { id, name } = veiwProps;
    const { bizBud, savePropEx } = veiwProps;
    async function saveProp(newValue: string | number) {
        await savePropEx(id, bizBud, newValue);
    }
    let { pickValue, ValueTemplate } = pickValueFromBudType(bizBud, openModal);
    return <ViewProp {...veiwProps} saveProp={saveProp} pickValue={pickValue} ValueTemplate={ValueTemplate} />
}

function pickValueFromBudType(bizBud: BizBud, openModal: OpenModal): BudValue {
    let { budDataType } = bizBud;
    switch (budDataType.type) {
        default: return {} as BudValue;
        case 'atom': return pickValueForBudAtom(budDataType as BudAtom, openModal);
    }
}

function pickValueForBudAtom(budType: BudAtom, openModal: OpenModal): BudValue {
    let { bizAtom } = budType;
    let gen = bizAtom.biz.uqApp.genAtoms[bizAtom.name];
    return {
        pickValue: async function (props: PickProps) {
            let ret = await openModal(gen.PageSelect);
            return ret?.id;
        },
        ValueTemplate: function ({ value }: { value: any }) {
            if (value === null || value === undefined) {
                return <span className="text-black-50">/</span>;
            }
            return <IDView uq={gen.uq} id={Number(value)}
                Template={gen.ViewItemAtom} />
        }
    }
}
