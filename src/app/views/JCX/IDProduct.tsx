import { PageIDList, PageIDNew, PageIDView, GenID, PageIDSelect } from "app/template/ID";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Item, ItemType, uqSchema } from "uqs/UqDefault";

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';

export class GenProduct extends GenID {
    readonly itemName = 'product';
    readonly path: string;
    get exLabel(): string { return '描述' }
}

class GenProductForSale extends GenProduct {
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

export function PageProductSelect() {
    return <PageIDSelect Gen={GenProduct} />;
}

// show price on product item
export function PageProductSelectForSale() {
    return <PageIDSelect Gen={GenProductForSale} />;
}

export const routeProduct = <>
    <Route path={pathProductNew} element={<PageIDNew Gen={GenProduct} />} />
    <Route path={pathProductList} element={<PageIDList Gen={GenProduct} />} />
    <Route path={`${pathProductView}/:id`} element={<PageIDView Gen={GenProduct} />} />
</>;
