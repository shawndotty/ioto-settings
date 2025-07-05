import { App, Notice } from "obsidian";
import { t } from "../lang/helpers";
import { IOTOSettings } from "../types";

export class TemplaterService {
	constructor(private app: App, private settings: IOTOSettings) {}

	private getTemplater() {
		// 获取Templater插件实例
		// @ts-ignore
		const templater = this.app.plugins.getPlugin("templater-obsidian");

		if (!templater) {
			new Notice(t("Templater plugin not found or not enabled"));
			return;
		}

		// 获取当前配置
		return templater;
	}

	async addTemplaterPaths() {
		// 获取当前配置
		const templater = this.getTemplater();
		const currentSettings = templater.settings || {};
		currentSettings.templates_folder = `${t(
			"0-Extras"
		)}/IOTO/Templates/Templater`;
		currentSettings.user_scripts_folder = `${t("0-Extras")}/IOTO/Scripts`;
		// 保存设置
		await templater.save_settings();
		new Notice(t("Successfully add Templater paths"));
	}

	async addTemplaterHotkeys(templatePaths: Array<string> = []) {
		// 获取当前配置
		const templater = this.getTemplater();
		const currentSettings = templater.settings || {};

		// 初始化enabled_templates_hotkeys数组（如果不存在）
		if (!Array.isArray(currentSettings.enabled_templates_hotkeys)) {
			currentSettings.enabled_templates_hotkeys = [];
		}

		// 添加不存在的模板路径
		let addedCount = 0;
		for (const templatePath of templatePaths) {
			if (
				!currentSettings.enabled_templates_hotkeys.includes(
					templatePath
				)
			) {
				currentSettings.enabled_templates_hotkeys.push(templatePath);
				addedCount++;
			}
		}

		if (addedCount > 0) {
			// 保存设置
			await templater.save_settings();
			new Notice(
				`${t("Added")} ${addedCount} ${t(
					"template(s) to Templater hotkeys"
				)}`
			);
		} else {
			new Notice("All templates already exist in Templater hotkeys");
		}
	}
}
