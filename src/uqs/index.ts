//=== UqApp builder created on Tue Dec 19 2023 22:07:31 GMT-0500 (Eastern Standard Time) ===//
import * as UqDefault from './UqDefault';

export interface UQs {
	UqDefault: UqDefault.UqExt;
}

export const uqsSchema = {
	"jksoft/jksoft-mini-jxc-trial": UqDefault.uqSchema,
}

export * as UqDefault from './UqDefault';
