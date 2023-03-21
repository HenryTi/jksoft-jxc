import { EnumID } from "uqs/UqDefault";

export interface IDCustom {
    caption: string;
}

export const arrIDCustom = [EnumID.Contact, EnumID.Product];
export const collIDCustom: { [key in EnumID]?: IDCustom } = {
    [EnumID.Contact]: { caption: '联系人' },
    [EnumID.Product]: { caption: '产品' },
};
