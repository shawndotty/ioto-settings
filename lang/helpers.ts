//Solution copied from obsidian-kanban: https://github.com/mgmeyers/obsidian-kanban/blob/44118e25661bff9ebfe54f71ae33805dc88ffa53/src/lang/helpers.ts

import { moment, App } from "obsidian";

import en from "./locale/en";
import zhCN from "./locale/zh-cn";
import zhTW from "./locale/zh-tw";
 

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	"zh-cn": zhCN,
	"zh-tw": zhTW,
};

const locale = localeMap[moment.locale()];

export function t(str: keyof typeof en, userLang: string = "auto"): string {
    if (!locale) {
      console.dir({
        where: "helpers.t",
        message: "Error: Language file not found",
        locale: moment.locale(),
      });
    }

    // 获取用户指定的语言环境
    const targetLocale = userLang === "auto" ? locale : localeMap[userLang];
    
    // 如果找不到对应的翻译，则返回英文默认值
    return targetLocale?.[str] ?? en[str];
}
