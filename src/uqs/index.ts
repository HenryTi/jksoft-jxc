//=== UqApp builder created on Wed Mar 15 2023 22:15:45 GMT-0400 (Eastern Daylight Time) ===//
import * as JsTicket from './JsTicket';

export interface UQs {
	JsTicket: JsTicket.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": JsTicket.uqSchema,
}

export * as JsTicket from './JsTicket';
