import { Page, useModal } from "tonwa-app";
import { EntityAtom, EntityID } from "tonwa";
import { List } from "tonwa-com";

export function PageBizAtomSelectType({ caption, entityAtom }: { caption: string; entityAtom: EntityAtom; }) {
    const modal = useModal();
    const { subClasses: children } = entityAtom;
    function ViewItem({ value }: { value: EntityID; }) {
        const { caption } = value;
        return <div className="px-3 py-2">
            {caption}
        </div>
    }
    function onItemClick(item: EntityID) {
        modal.close(item);
    }
    return <Page header={`选择${caption}类型`}>
        <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
    </Page>
}
