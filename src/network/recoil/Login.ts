import { atom } from "recoil";

export const emailAtom = atom<string>({
    key: "emailAtom",
    default: ""
});

export const isLoginAtom = atom<boolean>({
    key: "isLoginAtom",
    default: false
});
