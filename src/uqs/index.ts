//=== UqApp builder created on Thu Mar 16 2023 12:58:28 GMT-0400 (Eastern Daylight Time) ===//
import * as JsTicket from './JsTicket';

export interface UQs {
	JsTicket: JsTicket.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": JsTicket.uqSchema,
}

export * as JsTicket from './JsTicket';
