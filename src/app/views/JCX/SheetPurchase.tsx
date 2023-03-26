import { Route } from "react-router-dom";
import { UqAction } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp } from "app/UqApp";
import { Detail, SheetType } from "uqs/UqDefault";
import { PageOriginEdit, PartSheet, PartOrigin, PageDetailQPA, PartDetail, ViewItemID } from "../../template";
import { PageProductSelect } from "./IDProduct";
import { QueryMore, SeedSheet } from "app/tool";
import { IDPartContact } from "./IDContact";

const captionPurchase = '采购单';
const pathPurchaseEdit = 'purchase-edit';

class SeedPurchase extends SeedSheet {
    readonly sheet = SheetType.Purchase;
}

export class SheetPartPurchase extends PartOrigin {
    readonly sheetType = SheetType.Purchase;
    readonly path: string;

    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchItem: QueryMore;

    readonly caption: string;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: PartProps<PartSheet> & { detail: Partial<Detail>; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.path = pathPurchaseEdit;
        const { UqDefault: uq } = uqApp.uqs;
        this.ActBookSheet = uq.BookSheet;
        this.QuerySearchItem = uqApp.objectOf(IDPartContact).searchItems;

        this.PageDetailItemSelect = PageProductSelect;
        this.caption = captionPurchase;
        this.PageSheetEdit = PagePurchaseEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id };
        return detail;
    }
}

function PagePurchaseEdit() {
    return <PageOriginEdit Part={SheetPartPurchase} />;
}

function PageSheetDetail({ detail, Part }: (PartProps<SheetPartPurchase> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} PartSheet={Part as any} Part={DetailPartPurchase} />;
}

class DetailPartPurchase extends PartDetail {
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
