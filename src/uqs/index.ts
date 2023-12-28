//=== UqApp builder created on Wed Dec 27 2023 21:01:27 GMT-0500 (Eastern Standard Time) ===//
import * as UqDefault from './UqDefault';

export interface UQs {
	UqDefault: UqDefault.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": UqDefault.uqSchema,
}

export * as UqDefault from './UqDefault';
