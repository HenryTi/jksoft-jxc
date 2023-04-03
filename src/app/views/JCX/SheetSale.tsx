import { Route } from "react-router-dom";
import { UqAction } from "tonwa-uq";
import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { Detail } from "uqs/UqDefault";
import { PageOriginEdit, GenSheet, GenOrigin, GenDetail, PageDetailQPA } from "../../template/Sheet";
import { PageProductSelectForSale } from "./IDProduct";
import { ViewItemID } from "app/template";
import { QueryMore } from "app/tool";
import { GenContact } from "./IDContact";

const pathSaleEdit = 'sale-edit';

export class GenSale extends GenOrigin {
    readonly sheetName = 'sale';
    readonly path = 'pathSaleEdit';

    readonly QuerySearchItem: QueryMore;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: GenProps<GenSheet> & { detail: Detail; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    readonly targetCaption = '客商';

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.QuerySearchItem = uqApp.objectOf(GenContact).searchItems;

        this.PageDetailItemSelect = PageProductSelectForSale;
        this.PageSheetEdit = PageSaleEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id, v1: selectedItem.v1, };
        return detail;
    }
}

function PageSaleEdit() {
    return <PageOriginEdit Gen={GenSale} />;
}

function PageSheetDetail({ detail, Gen }: (GenProps<GenSale> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} GenSheet={Gen as any} Gen={GenDetailSale} />;
}

class GenDetailSale extends GenDetail {
    get caption(): string { return '明细'; }
    get path(): string { return undefined; }
    get itemCaption(): string { return '产品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewItemID;
    }
    get priceDisabled() { return true; }
}

export const routeSale = <>
    <Route path={`${pathSaleEdit}/:id`} element={<PageSaleEdit />} />
    <Route path={pathSaleEdit} element={<PageSaleEdit />} />
</>;
