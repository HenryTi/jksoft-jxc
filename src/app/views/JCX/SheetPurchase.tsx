import { Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp, useUqApp } from "app/UqApp";
import { SheetPurchase, DetailQPA } from "uqs/JsTicket";
import { PageOriginEdit, PartSheet, PartOrigin } from "../../template/Sheet";
import { PageProductSelect, ViewProduct } from "./IDProduct";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { FA, LMR } from "tonwa-com";
import { ViewContact } from "./IDContact";

export const captionPurchase = '采购单';
const pathPurchaseEdit = 'purchase-edit';

export class SheetPartPurchase extends PartOrigin<SheetPurchase, DetailQPA> {
    readonly pathNew: string;
    readonly pathEdit: string;

    readonly ID: UqID<any>;
    readonly IDDetail: UqID<any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchSheetItem: UqQuery<any, any>;

    readonly caption: string;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: PartProps<PartSheet<SheetPurchase, DetailQPA>> & { detail: Partial<DetailQPA>; }) => JSX.Element;
    readonly ViewNO: (props: { no: string }) => JSX.Element;
    readonly ViewTarget: (props: { sheet: SheetPurchase }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: SheetPurchase }) => JSX.Element;
    readonly ViewItemEditRow: ({ row }: { row: any }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        const { JsTicket: uq } = uqApp.uqs;

        this.pathNew = pathPurchaseEdit;
        this.pathEdit = pathPurchaseEdit;

        this.ID = uq.SheetPurchase;
        this.IDDetail = uq.DetailQPA;
        this.QueryGetDetails = uq.GetDetailQPAs;
        this.ActBookSheet = uq.BookSheetPurchase;
        this.QuerySearchSheetItem = uq.SearchContact;

        this.PageDetailItemSelect = PageProductSelect;
        this.caption = captionPurchase;
        this.PageSheetEdit = PagePurchaseEdit;
        this.PageSheetDetail = PageSheetDetail;

        this.ViewItemEditRow = function ({ row }: { row: DetailQPA }) {
            let { item, quantity, price, amount } = row;
            return <LMR className="px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewProduct} />
                <div className="align-self-end text-end d-flex align-items-end">
                    <div>
                        <span><small>单价:</small> {price.toFixed(4)} <small>金额:</small> {amount.toFixed(4)}</span>
                        <br />
                        <small>数量:</small> <b>{quantity}</b>
                    </div>
                    <FA name="pencil-square-o" className="ms-3 text-info" />
                </div>
            </LMR>;
        }

        this.ViewNO = function ({ no }: { no: string }) {
            return <Band label={'编号'} labelClassName="text-end">
                {no}
            </Band>
        }

        this.ViewTarget = ({ sheet }: { sheet: SheetPurchase }) => {
            return <IDView id={sheet.target} uq={uq} Template={ViewContact} />;
        }

        this.ViewTargetBand = ({ sheet }: { sheet: SheetPurchase }) => {
            return <Band labelClassName="text-end" label={'往来单位'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    buildSheet(id: number, no: string, target: number): SheetPurchase {
        return { id, no, target };
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id };
        return detail;
    }
}

function PagePurchaseEdit() {
    return <PageOriginEdit Part={SheetPartPurchase} />;
}

function PageSheetDetail({ detail, Part }: (PartProps<PartSheet> & { detail: Partial<DetailQPA> })) {
    const uqApp = useUqApp();
    const { uq } = uqApp.partOf(Part);
    const { quantity, price, amount, item } = detail;
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(quantity != undefined);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let v = Number(value);
        switch (name) {
            case 'quantity': onQuantityChange(v); break;
            case 'price': onPriceChange(v); break;
        }
        setHasValue(!Number.isNaN(v));
    }
    function setAmountValue(amount: number) {
        detail.amount = amount;
        setValue('amount', amount);
    }
    function onQuantityChange(value: number) {
        setAmountValue(value * getValues('price'));
    }
    function onPriceChange(value: number) {
        setAmountValue(value * getValues('quantity'));
    }
    const options = { onChange, valueAsNumber: true };
    let formRows: FormRow[] = [
        { name: 'quantity', label: '数量', type: 'number', options: { ...options, value: quantity } },
        { name: 'price', label: '单价', type: 'number', options: { ...options, value: price ?? 1 } },
        { name: 'amount', label: '金额', type: 'number', options: { ...options, value: amount, disabled: true } },
        { type: 'submit', label: hasValue === true ? '提交' : '关闭' },
    ];

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let { amount } = detail;
        closeModal({ ...data, amount });
    }
    return <Page header="明细">
        <div className="container">
            <Band label={'产品'} labelClassName="py-2 fw-bold">
                <IDView uq={uq} id={item} Template={ViewProduct} />
            </Band>
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}

// <Route path={pathPurchaseNew} element={<PagePurchaseNew />} />
export const routePurchase = <>
    <Route path={`${pathPurchaseEdit}/:id`} element={<PagePurchaseEdit />} />
    <Route path={pathPurchaseEdit} element={<PagePurchaseEdit />} />
</>;
