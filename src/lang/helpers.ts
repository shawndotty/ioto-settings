//Solution copied from obsidian-kanban: https://github.com/mgmeyers/obsidian-kanban/blob/44118e25661bff9ebfe54f71ae33805dc88ffa53/src/lang/helpers.ts

import { moment } from "obsidian";
import IOTO from "src/main";

import en from "./locale/en";
import zhCN from "./locale/zh-cn";
import zhTW from "./locale/zh-tw";

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	"zh-cn": zhCN,
	"zh-tw": zhTW,
};

// 优化语言选择逻辑，增加健壮性和可读性
const lang =
	IOTO.IOTORunningLanguage === "ob"
		? moment.locale()
		: IOTO.IOTORunningLanguage;
const locale = localeMap[lang] ?? en;

export function t(
	str: keyof typeof en,
	variables?: { [key: string]: string }
): string {
	if (!locale) {
		console.dir({
			where: "helpers.t",
			message: "Error: Language file not found",
			locale: lang,
		});
	}

	let result = (locale && locale[str]) || en[str];

	if (result && variables && Object.keys(variables).length > 0) {
		Object.entries(variables).forEach(([varKey, value]) => {
			// 支持两种占位符格式: {{varName}} 或 %varName%
			result = result.replace(
				new RegExp(`{{${varKey}}}|%${varKey}%`, "g"),
				value
			);
		});
	}

	return result;
}
