import { PageAssign } from "app/hooks";
import { Route } from "react-router-dom";
import { EnumAtom } from "uqs/UqDefault";

export const pathPrice = 'price';

function PagePrice() {
    return <PageAssign
        atom={'goods'}
        caption={'零售价设置'}
        budNames={['Price.retail']}
        noMedsMessage="@pathPrice" />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice />} />
</>;
