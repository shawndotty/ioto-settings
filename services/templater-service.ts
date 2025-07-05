import { App, Notice } from "obsidian";
import { t } from "../lang/helpers";
import { IOTOSettings } from "../types";

// 在文件顶部添加类型定义
interface TemplaterPlugin {
	settings: {
		templates_folder?: string;
		user_scripts_folder?: string;
		enabled_templates_hotkeys?: string[];
		[key: string]: any;
	};
	save_settings: () => Promise<void>;
}

export class TemplaterService {
	constructor(private app: App, private settings: IOTOSettings) {}

	private getTemplater(): TemplaterPlugin | null {
		// 获取Templater插件实例
		const templater = this.app.plugins.plugins["templater-obsidian"] as
			| TemplaterPlugin
			| undefined;

		if (!templater) {
			new Notice(t("Templater plugin not found or not enabled"));
			return null;
		}

		// 获取当前配置
		return templater;
	}

	private async getTemplaterSettings() {
		const templater = this.getTemplater();
		if (!templater) return null;

		return templater.settings || {};
	}

	async addTemplaterPaths() {
		const templater = this.getTemplater();
		const settings = await this.getTemplaterSettings();
		if (!settings) return false;

		settings.templates_folder = `${t("0-Extras")}/IOTO/Templates/Templater`;
		settings.user_scripts_folder = `${t("0-Extras")}/IOTO/Scripts`;

		// 保存设置
		if (templater) {
			await templater.save_settings();
		}
		new Notice(t("Successfully add Templater paths"));
		return true;
	}

	async addTemplaterHotkeys(templatePaths: Array<string> = []) {
		// 获取当前配置
		const templater = this.getTemplater();
		if (!templater) return false;
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
			new Notice(t("All templates already exist in Templater hotkeys"));
		}
	}
}
