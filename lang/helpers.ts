//Solution copied from obsidian-kanban: https://github.com/mgmeyers/obsidian-kanban/blob/44118e25661bff9ebfe54f71ae33805dc88ffa53/src/lang/helpers.ts

import { moment } from "obsidian";

import en from "./locale/en";
import zhCN from "./locale/zh-cn";
import zhTW from "./locale/zh-tw";


const localeMap: { [k: string]: Partial<typeof en> } = {
    en,
    "zh-cn": zhCN,
    "zh-tw": zhTW
};

const locale = localeMap[moment.locale()];


export function t(str: keyof typeof en): string {
    if (!locale) {
      console.dir({
        where: "helpers.t",
        message: "Error: IOTO locale not found",
        locale: moment.locale(),
      });
    }
  
    return (locale && locale[str]) || en[str];
}