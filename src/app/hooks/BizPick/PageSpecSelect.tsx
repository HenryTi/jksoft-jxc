import { Page, PageSpinner, useModal } from "tonwa-app";
import { RowColsSm } from "../tool";
import { EntityFork } from "app/Biz";
import { useState } from "react";
import { ViewBud } from "..";
import { List, useEffectOnce } from "tonwa-com";
import { createIDSelectStore } from "./IDSelectStore";

export function PagePickSelect({ base, entity }: { base: number; entity: EntityFork; }) {
    const modal = useModal();
    const { keys } = entity;
    const [list, setList] = useState(undefined as any[]);
    useEffectOnce(() => {
        (async () => {
            const store = createIDSelectStore(entity);
            let ret = await store.search({ base }, 0, 100);
            setList(ret);
        })();
    });
    function onClick(item: any) {
        modal.close(item);
    }
    function ViewItem({ value }: { value: any; }) {
        const keyValues: [number, number | string][] = value.keys;
        return <div className="px-3 py-2">
            <RowColsSm>
                {keys.map(v => {
                    const { id } = v;
                    let val = keyValues.find(kv => kv[0] === id);
                    return <ViewBud key={id} bud={v} value={val} />;
                })}
            </RowColsSm>
        </div>;
    }

    if (list === undefined) {
        return <PageSpinner />;
    }
    return <Page header="选择">
        <List items={list} onItemClick={onClick} ViewItem={ViewItem} />
        <div className="px-3 py-2">
            <button className="btn btn-primary" onClick={onClick}>确定</button>
        </div>
    </Page>;
}
