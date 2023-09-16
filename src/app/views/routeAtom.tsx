import { EntityAtom } from "app/Biz";
import { UqApp } from "app/UqApp";
import { pathAtom, pathAtomEdit, pathAtomList, pathAtomNew, pathAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import React from "react";
import { Route } from "react-router-dom";

export function routeAtom(uqApp: UqApp, gAtom: GAtom) {
    let { name, caption, pageNew, pageList, pageView, pageEdit } = gAtom;
    return <React.Fragment key={name}>
        <Route path={pathAtomNew(name)} element={pageNew} />
        <Route path={`${pathAtomList(name)}`} element={pageList} />
        <Route path={`${pathAtomList(name)}/:atom`} element={pageList} />
        <Route path={`${pathAtomEdit(name)}`} element={pageEdit} />
        <Route path={`${pathAtomView(name)}`} element={pageView} />
        <Route path={`${pathAtom(name)}`} element={pageView} />
    </React.Fragment>;
    // }
}
