import { UqQuery } from "tonwa-uq";
import { GentWithPath } from "app/tool";

export abstract class GenReport extends GentWithPath {
    abstract get QueryReport(): UqQuery<any, any>;
    abstract get sortField(): string;
    abstract get ViewItem(): (props: { value: any }) => JSX.Element;
    abstract get onItemClick(): (item: any) => Promise<void>;

    abstract get captionHistory(): string;
    abstract get QueryHistory(): UqQuery<any, any>;
    abstract get ViewItemHistory(): (props: { value: any }) => JSX.Element;
    abstract get historySortField(): string;
    abstract get onHistoryClick(): (item: any) => Promise<void>;
}
