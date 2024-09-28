import { EntityBook } from "app/Biz";
import { EntityStore } from "app/tool";

export class AdminStore extends EntityStore<EntityBook> {
    readonly load = async (param: { bud: number; }, pageStart: number, pageSize: number,) => {
        const { $page, props, atoms, specs } = await this.uq.GetAdminBook.page(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, specs);
        return $page;
    }
}
