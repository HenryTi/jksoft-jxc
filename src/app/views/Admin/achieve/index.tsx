import { Route } from "react-router-dom";
import { PageAchieve } from "./PageAchieve";
import { PageSumGroup, pathSumGroup } from "./PageSumGroup";
import { PageSumFormula, pathSumFormula } from "./PageSumFormula";
import { centers } from "app/views/center";

export * from './PageAchieve';

export const routeAchieve = <>
    <Route path={centers.achieve.path} element={<PageAchieve />} />
    <Route path={pathSumGroup} element={<PageSumGroup />} />
    <Route path={pathSumFormula} element={<PageSumFormula />} />
</>;
