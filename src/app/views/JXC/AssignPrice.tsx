import { useUqApp } from "app/UqApp";
import { PageAssign, GenBuds, GenAMSBudsSearch, GenAtom } from "app/template";
import { Route } from "react-router-dom";
import { GenGoods } from "./Atom";

export const pathPrice = 'price';

export function PagePrice() {
    return <PageAssign Gen={GenGoods} caption={'零售价设置'}
        entity="Price" budNames={['Retail']} />
    //genBuds={genBuds} genBudsSearch={genBudsSearch} />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice />} />
</>;
