import { Route } from "react-router-dom";
import { PageProp } from "./PageProp";
import { PagePropEdit } from "./PagePropEdit";

export const pathProp = 'prop';
export const pathSetup = 'setup';
export const routeSetup = <>
    <Route path={pathProp} element={<PageProp />} />
    <Route path={`${pathProp}/:prop`} element={<PagePropEdit />} />
</>;
