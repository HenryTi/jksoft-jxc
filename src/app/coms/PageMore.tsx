import { Atom, atom, useAtomValue } from "jotai";
import { useRef } from "react";
import { Page, PageProps, Scroller, useModal } from "tonwa-app";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";

export function PageMore(props: PageProps & { atomItems: Atom<any[]>; }) {
    const { atomItems } = props;
    const items = useAtomValue(atomItems);
    return <Page {...props}>
        {items.map((v, index) => <div key={index} className="p-3">{v}</div>)}
    </Page>;
}

export function PageMoreTest() {
    const modal = useModal();
    let arr = [];
    for (let i = 0; i < 30; i++) arr.push(i + 1);
    let { current: atomItems } = useRef(atom<any[]>(arr));
    function onRight() {
        modal.open(<PageMoreTest />);
    }
    let right = <button className="btn btn-sm btn-primary me-1" onClick={onRight}>
        <FA name="plus" />
    </button>;
    async function onScrollBottom(scroller: Scroller): Promise<void> {
        let items = getAtomValue(atomItems);
        let v = items[items.length - 1];
        if (v > 150) return;
        for (let i = 0; i < 5; i++) {
            items.push(++v);
        }
        setAtomValue(atomItems, [...items]);
    }
    return <PageMore header="More" atomItems={atomItems} onScrollBottom={onScrollBottom} right={right} />;
}
