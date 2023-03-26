import { PageIDList, PageIDNew, PageIDView, PartID, PageIDSelect } from "app/template/ID";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Item, ItemType } from "uqs/UqDefault";

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';

export class IDPartProduct extends PartID {
    readonly IDType = ItemType.Product;
    readonly path: string;
    readonly caption = '产品';
}

class IDPartProductForSale extends IDPartProduct {
    declare readonly ViewItemID: (value: any) => JSX.Element;
    declare readonly query: UqQuery<any, any>;
    constructor(uqApp: UqApp) {
        super(uqApp);
        this.query = this.uq.SearchProductForSale;
        this.ViewItemID = ({ value: { no, ex, v1: price } }: { value: Item & { v1: number; } }) => {
            return <LMR className="d-block px-3 py-2">
                <div>
                    <div className='small text-muted'>{no}</div>
                    <div><b>{ex}</b></div>
                </div>
                <div>{price}元</div>
            </LMR>
        }
    }
}

function PageProductNew() {
    return <PageIDNew Part={IDPartProduct} />;
}

function PageProductView() {
    return <PageIDView Part={IDPartProduct} />;
}

function PageProductList() {
    return <PageIDList Part={IDPartProduct} />
}

export function PageProductSelect() {
    return <PageIDSelect Part={IDPartProduct} />;
}

// show price on product item
export function PageProductSelectForSale() {
    return <PageIDSelect Part={IDPartProductForSale} />;
}

export const routeProduct = <>
    <Route path={pathProductNew} element={<PageProductNew />} />
    <Route path={pathProductList} element={<PageProductList />} />
    <Route path={`${pathProductView}/:id`} element={<PageProductView />} />
</>;
