//=== UqApp builder created on Thu Jan 25 2024 12:09:15 GMT-0500 (Eastern Standard Time) ===//
import * as UqDefault from './UqDefault';

export interface UQs {
	UqDefault: UqDefault.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": UqDefault.uqSchema,
}

export * as UqDefault from './UqDefault';
