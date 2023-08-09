import { EntityAtom } from "app/Biz";
import { UqApp } from "app/UqApp";
import { pathAtom, pathAtomEdit, pathAtomList, pathAtomNew, pathAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import React from "react";
import { Route } from "react-router-dom";

export function routeAtom(uqApp: UqApp, gAtom: GAtom) {
    const { name, caption, pageNew, pageList, pageView, pageEdit } = gAtom;
    const entity = uqApp.biz.entities[name] as EntityAtom;
    const ga = {
        ...gAtom,
        caption: caption ?? entity.caption,
        entity,
    }
    addGAtoms(uqApp, entity, ga);
    return <React.Fragment key={name}>
        <Route path={pathAtomNew(name)} element={pageNew} />
        <Route path={`${pathAtomList(name)}`} element={pageList} />
        <Route path={`${pathAtomList(name)}/:atom`} element={pageList} />
        <Route path={`${pathAtomEdit(name)}`} element={pageEdit} />
        <Route path={`${pathAtomView(name)}`} element={pageView} />
        <Route path={`${pathAtom(name)}`} element={pageView} />
    </React.Fragment>;
}

function addGAtoms(uqApp: UqApp, entity: EntityAtom, gAtom: GAtom) {
    const { phrase, children } = entity;
    uqApp.gAtoms[gAtom.name] = gAtom;
    uqApp.gAtoms[phrase] = gAtom;
    for (let ea of children) {
        addGAtoms(uqApp, ea, gAtom);
    }
}
