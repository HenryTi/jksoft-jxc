import { Route } from "react-router-dom";
import { PageAchieve, pathAchieve } from "./PageAchieve";
import { PageSumGroup, pathSumGroup } from "./PageSumGroup";

export { pathAchieve } from './PageAchieve';

export const routeAchieve = <>
    <Route path={pathAchieve} element={<PageAchieve />} />
    <Route path={pathSumGroup} element={<PageSumGroup />} />
</>;
