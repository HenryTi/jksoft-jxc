//=== UqApp builder created on Tue Nov 21 2023 10:10:08 GMT-0500 (Eastern Standard Time) ===//
import * as UqDefault from './UqDefault';

export interface UQs {
	UqDefault: UqDefault.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": UqDefault.uqSchema,
}

export * as UqDefault from './UqDefault';
