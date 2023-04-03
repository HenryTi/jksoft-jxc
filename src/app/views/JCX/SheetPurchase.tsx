import { Route } from "react-router-dom";
import { UqAction } from "tonwa-uq";
import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { Detail, SheetType, uqSchema } from "uqs/UqDefault";
import { PageOriginEdit, GenSheet, GenOrigin, PageDetailQPA, GenDetail, ViewItemID } from "../../template";
import { PageProductSelect } from "./IDProduct";
import { QueryMore } from "app/tool";
import { GenContact } from "./IDContact";

const pathPurchaseEdit = 'purchase-edit';

export class GenPurchase extends GenOrigin {
    readonly sheetName = 'purchase';
    readonly path = pathPurchaseEdit;

    readonly QuerySearchItem: QueryMore;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: GenProps<GenSheet> & { detail: Partial<Detail>; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    readonly targetCaption = '供应商';

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.QuerySearchItem = uqApp.objectOf(GenContact).searchItems;

        this.PageDetailItemSelect = PageProductSelect;
        this.PageSheetEdit = PagePurchaseEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id };
        return detail;
    }
}

function PagePurchaseEdit() {
    return <PageOriginEdit Gen={GenPurchase} />;
}

function PageSheetDetail({ detail, Gen }: (GenProps<GenPurchase> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} GenSheet={Gen as any} Gen={GenDetailPurchase} />;
}

class GenDetailPurchase extends GenDetail {
    get caption(): string { return '明细'; }
    get path(): string { return undefined; }
    get itemCaption(): string { return '产品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewItemID;
    }
}

export const routePurchase = <>
    <Route path={`${pathPurchaseEdit}/:id`} element={<PagePurchaseEdit />} />
    <Route path={pathPurchaseEdit} element={<PagePurchaseEdit />} />
</>;
