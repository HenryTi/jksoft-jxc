import { UqQuery } from "tonwa-uq";
import { PartWithPath } from "../Part";

export abstract class PartReport extends PartWithPath {
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
