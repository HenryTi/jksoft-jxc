import { Entity, EntityQuery, EntityBook } from "app/Biz";
import { ToolButton } from "app/coms";
import { Modal } from "tonwa-app";
import { BizPhraseType } from "uqs/UqDefault";
import { PageQuery } from "./PageQuery";
import { PageBook } from "./PageBook";

export function adminData(modal: Modal, entity: Entity) {
    let page: any;
    switch (entity.bizPhraseType) {
        default:
            return;
        case BizPhraseType.query:
            page = <PageQuery entity={entity as EntityQuery} />;
            break;
        case BizPhraseType.book:
            page = <PageBook entity={entity as EntityBook} />;
            break;
    }
    return new ToolButton(
        { caption: '数据', icon: 'search' },
        () => modal.open(page)
    );
}
