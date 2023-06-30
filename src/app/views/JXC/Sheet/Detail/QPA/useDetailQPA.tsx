import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewItemID } from "app/template";
import { Editing, OptionsUseSheetDetail, selectAtomMetricSpec as selectAtomMetricSpecHook } from "app/hooks";
import { AtomMetricSpec, AtomPhrase, EditingRow, SheetRow } from "app/tool";
import { Page, uqAppModal, useModal } from "tonwa-app";
import { Detail, EnumAtom } from "uqs/UqDefault";
import { ChangeEvent, useRef, useState } from "react";
import { useUqApp } from "app/UqApp";
import { FA } from "tonwa-com";
import { useAtomValue } from "jotai";
import { GenGoodsHook, ViewAtomGoods } from "app/views/JXC/Atom";
import { ViewAMSAtom, ViewAMSAtomSpec, ViewAMSMetric, ViewAMSSpec } from "../../ViewAMS";
import { UseSheetDetailReturn } from "app/hooks";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export interface OptionsUseDetailQPA extends OptionsUseSheetDetail {
}

export function useDetailQPA({ detail }: OptionsUseDetailQPA): UseSheetDetailReturn {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const caption = '明细';
    const itemCaption = '商品';
    function buildFormRows(detial: Detail): FormRow[] {
        let { value, v1: price, v2: amount } = detial;
        return [
            buildValueRow(value),
            buildPriceRow(price),
            buildAmountRow(amount),
        ];
    }
    let valueDisabled: boolean = false;
    function buildValueRow(value: number): FormRow {
        return { name: fieldQuantity, label: '数量', type: 'number', options: { value, disabled: valueDisabled } };
    }
    let priceDisabled: boolean = false;
    function buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldPrice, label: '单价', type: 'number', options: { value, disabled: priceDisabled } };
    }
    let amountDisabled: boolean = true;
    function buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldAmount, label: '金额', type: 'number', options: { value, disabled: amountDisabled } };
    }

    // const { current: genAtomSpec } = useRef(new GenGoodsHook(uqApp, 'Goods'));
    /*
    async function selectAtomSpecMetric(header?: string): Promise<AtomMetricSpec> {
        let ret = await selectGoodsMetricSpec(genAtomSpec);
        return ret;
    }
    */

    // const genAtomSpec = new GenGoodsHook(uqApp, 'Goods');
    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        const { openModal, closeModal } = uqAppModal(uqApp);
        let atomMetricSpec = await selectAtomMetricSpecHook(uqApp, EnumAtom.Goods);
        if (atomMetricSpec === undefined) return;
        let { atom, metricItem } = atomMetricSpec;
        if (!metricItem.id) {
            await openModal(<Page header="提示">
                <div className="px-3">
                    <div className="my-3">
                        <ViewAtomGoods value={atom} />
                    </div>
                    <div className="my-3 text-danger">
                        <FA name="times-circle" /> 无计量单位
                    </div>
                    <div className="my-3">
                        <button className="btn btn-outline-primary" onClick={closeModal}>
                            返回
                        </button>
                    </div>
                </div>
            </Page>);
            return;
        }
        let item = await saveAtomMetricSpec(atomMetricSpec);
        let editingRow = editingRowFromAtom(item);
        if (editingRow === undefined) return;
        let ret = await openModal(<PageDetail header={'新增明细'} editingRow={editingRow} />);
        if (ret === undefined) return [];
        return [ret];
    }

    async function saveAtomMetricSpec(atomMetricSpec: AtomMetricSpec): Promise<number> {
        let { atom, atomMetric, spec, metricItem } = atomMetricSpec;
        if (atomMetric === undefined) {
            let ret = await uq.SaveAtomMetric.submit({ atom: atom.id, metricItem: metricItem.id });
            atomMetric = atomMetricSpec.atomMetric = ret.id;
        }
        let specId = 0;
        if (spec !== undefined) {
            specId = spec.id;
            if (specId === undefined) {
                specId = await saveSpec(atom, spec);
            }
        }
        let ret = await uq.SaveAtomMetricSpec.submit({
            atomMetric,
            spec: specId,
        });
        return ret.id;
    }

    async function saveSpec(atom: AtomPhrase, spec: any): Promise<number> {
        let gSpec = uqApp.specFromAtom(atom.phrase);
        let values = gSpec.entity.getSpecValues(spec);
        let ret = await uq.SaveSpec.submit({
            spec: gSpec.name,
            atom: atom.id,
            values
        });
        return ret.id;
    }

    function editingRowFromAtom(item: number/*atomMetricSpec: AtomMetricSpec*/): EditingRow {
        if (item === undefined) return;
        let row: Detail = {
            item //: undefined,
            // atomMetricSpec: atomMetricSpec,
        } as Detail;
        let editingRow = new EditingRow(undefined, [row]);
        return editingRow;
    }

    async function editRow(genEditing: Editing, editingRow: EditingRow): Promise<void> {
        const { openModal } = uqAppModal(uqApp);
        let ret = await openModal<SheetRow>(<PageDetail header="修改明细" editingRow={editingRow} />);
        if (ret === undefined) return;
        await genEditing.updateRow(editingRow, ret.details);
    }

    function PageDetail({ header, editingRow }: { header?: string; editingRow?: EditingRow; }): JSX.Element {
        editingRow = editingRow ?? new EditingRow(undefined, undefined);
        const { atomDetails } = editingRow;
        let details = useAtomValue(atomDetails);
        let refDetail = useRef<Detail>(details === undefined ? {} as Detail : { ...details[0] });
        let detail = refDetail.current;
        const { value, v1: price, v2: amount, item/*, atomMetricSpec*/ } = detail;
        const { closeModal } = useModal();
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        const [hasValue, setHasValue] = useState(value != undefined);
        function onChange(evt: ChangeEvent<HTMLInputElement>) {
            const { value, name } = evt.target;
            if (value.trim().length === 0) {
                (detail as any)[name] = undefined;
            }
            else {
                let v = Number(value);
                (detail as any)[name] = Number.isNaN(v) === true ? undefined : v;
            }
            switch (name) {
                case fieldQuantity: onQuantityChange(detail.value); break;
                case fieldPrice: onPriceChange(detail.v1); break;
            }
            const { v1: price, v2: amount, value: quantity } = detail;
            let hv = amount !== undefined && price !== undefined && quantity !== undefined;
            setHasValue(hv);
        }
        function setAmountValue(quantity: number, price: number) {
            if (quantity === undefined || price === undefined) {
                detail.v2 = undefined;
                setValue(fieldAmount, '');
            }
            let amount = quantity * price;
            detail.v2 = amount;
            setValue(fieldAmount, amount.toFixed(4));
        }
        function onQuantityChange(value: number) {
            detail.value = value;
            let p = getValues(fieldPrice) ?? price;
            if (!p) return;
            setAmountValue(value, p);
        }
        function onPriceChange(value: number) {
            detail.v1 = value;
            let q = getValues(fieldQuantity) ?? value;
            if (!q) return;
            setAmountValue(q, value);
        }
        const options = { onChange, valueAsNumber: true };
        const formRows = buildFormRows(detail);
        formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
        formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

        async function onSubmit(data: any) {
            // closeModal(data);
            // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
            // 只能用下面变通
            let ret: SheetRow = {
                origin: undefined,
                details: [detail],
            }
            closeModal(ret);
        }
        const ViewItemTop = (): JSX.Element => {
            return <div className="container">
                <Band label={itemCaption}>
                    <ViewAMSAtom id={item} />
                </Band>
                <Band label="单位">
                    <ViewAMSMetric id={item} />
                </Band>
            </div>
        }
        return <Page header={header ?? caption}>
            <div className="mt-3"></div>
            <ViewItemTop />
            <ViewAMSSpec id={item} hasLabel={true} />
            <form className="container" onSubmit={handleSubmit(onSubmit)}>
                <FormRowsView rows={formRows} register={register} errors={errors} />
            </form>
        </Page>;
    }


    const cnCol = ' col py-2 ';
    function ViewDetailQPA({ editingRow }: { editingRow: EditingRow; }): JSX.Element {
        const uqApp = useUqApp();
        const { atomDetails } = editingRow;
        const details = useAtomValue(atomDetails);
        if (details === undefined || details.length === 0) {
            return <div className={cnCol}>
                ViewDetailQPA editingRow rows === undefined || rows.length = 0;
            </div>
        }
        const { item, value, v1: price, v2: amount/*, atomMetricSpec*/ } = details[0];
        return <div className="container">
            <div className="row">
                <ViewAMSAtomSpec id={item} className={cnCol} />
                <div className={cnCol + ' d-flex justify-content-end align-items-end'}>
                    <div className="text-end">
                        <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                        <br />
                        <small>数量:</small> <b>{value}</b> <span><ViewAMSMetric id={item} /></span>
                    </div>
                    <FA name="pencil-square-o" className="ms-3 text-info" />
                </div>
            </div>
        </div>;
    }

    return {
        detail,
        ViewItemTemplate: ViewItemID,
        ViewRow: ViewDetailQPA,
        addRow,
        editRow,
        // genAtomSpec,
    }
}
