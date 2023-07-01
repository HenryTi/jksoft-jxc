import { PageAssign } from "app/hooks";
import { Route } from "react-router-dom";
import { EnumAtom } from "uqs/UqDefault";

export const pathPrice = 'price';

function PagePrice() {
    return <PageAssign atomName={EnumAtom.Goods} caption={'零售价设置'}
        entitySetting="Price" budNames={['Retail']}
        noMedsMessage="noMedsMessage" />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice />} />
</>;
