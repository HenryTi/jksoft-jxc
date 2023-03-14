//=== UqApp builder created on Tue Mar 14 2023 16:01:21 GMT-0400 (Eastern Daylight Time) ===//
import * as JsTicket from './JsTicket';

export interface UQs {
    JsTicket: JsTicket.UqExt;
}

export const uqsSchema = {
    "jksoft/jksoft-mini-jxc-trial": JsTicket.uqSchema,
}

export * as JsTicket from './JsTicket';
