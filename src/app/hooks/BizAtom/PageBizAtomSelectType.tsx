import { Page, useModal } from "tonwa-app";
import { EntityAtom, EntityAtomID } from "app/Biz";
import { List } from "tonwa-com";

export function PageBizAtomSelectType({ caption, entityAtom }: { caption: string; entityAtom: EntityAtom; }) {
    const { closeModal } = useModal();
    const { children } = entityAtom;
    function ViewItem({ value }: { value: EntityAtomID; }) {
        const { caption } = value;
        return <div className="px-3 py-2">
            {caption}
        </div>
    }
    function onItemClick(item: EntityAtomID) {
        closeModal(item);
    }
    return <Page header={`选择${caption}类型`}>
        <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
    </Page>
}
