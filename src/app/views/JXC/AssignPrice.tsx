import { PageAssign, GenBuds, GenAMSBudsSearch, GenAtom } from "app/template";
import { Route } from "react-router-dom";
import { GenGoods } from "./Atom";

export const pathPrice = 'price';

function PagePrice() {
    return <PageAssign Gen={GenGoods} caption={'零售价设置'}
        entitySetting="Price" budNames={['Retail']} />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice />} />
</>;
