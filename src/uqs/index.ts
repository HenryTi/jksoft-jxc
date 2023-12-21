//=== UqApp builder created on Thu Dec 21 2023 08:50:45 GMT-0500 (Eastern Standard Time) ===//
import * as UqDefault from './UqDefault';

export interface UQs {
	UqDefault: UqDefault.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": UqDefault.uqSchema,
}

export * as UqDefault from './UqDefault';
