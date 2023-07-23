import { Route } from "react-router-dom";
import { PageAchieve, pathAchieve } from "./PageAchieve";
import { PageSumGroup, pathSumGroup } from "./PageSumGroup";
import { PageSumFormula, pathSumFormula } from "./PageSumFormula";

export { pathAchieve } from './PageAchieve';

export const routeAchieve = <>
    <Route path={pathAchieve} element={<PageAchieve />} />
    <Route path={pathSumGroup} element={<PageSumGroup />} />
    <Route path={pathSumFormula} element={<PageSumFormula />} />
</>;
