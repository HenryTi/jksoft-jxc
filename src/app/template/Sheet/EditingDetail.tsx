import { Detail } from "uqs/UqDefault";

export interface EditingDetail {
    origin: Detail;
    pendFrom: number;
    pendValue: number;
    sheet: string;          // sheet phrase,
    no: string;             // origin sheet no
    rows: Detail[];         // 新产生的明细内容。不分解明细的话，就只有一行
}
