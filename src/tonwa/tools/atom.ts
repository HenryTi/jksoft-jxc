import { Atom, WritableAtom, getDefaultStore } from 'jotai';

const jotaiStore = getDefaultStore();

export function getAtomValue<T>(atom: Atom<T>) {
    return jotaiStore.get(atom);
}

export function setAtomValue<T>(atom: WritableAtom<T, any, any>, value: T) {
    jotaiStore.set(atom, value);
}
