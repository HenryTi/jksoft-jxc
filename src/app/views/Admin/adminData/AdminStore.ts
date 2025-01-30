import { EntityBook } from "tonwa";
import { EntityStore } from "app/tool";

export class AdminStore extends EntityStore<EntityBook> {
    readonly load = async (param: { i: number; bud: number; keys: object; }, pageStart: number, pageSize: number,) => {
        const { $page, props, atoms, forks } = await this.client.GetAdminBook(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, forks);
        return $page;
    }
}
