import { App, Notice, TFile } from "obsidian";
import { t } from "../lang/helpers";
import { HotkeyConfig } from "../types";
import { TemplaterService } from "./templater-service";

export class HotkeyService {
	constructor(private app: App, private templaterService: TemplaterService) {}

	async addIOTOHotkeys() {
		// 定义要添加的热键映射
		const hotkeyMappings = [
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-${t("Selector")}-${t(
					"CreateInput"
				)}.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "1",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-${t("Selector")}-${t(
					"CreateOutput"
				)}.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "2",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-${t("Selector")}-${t(
					"CreateTask"
				)}.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "3",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-${t("Selector")}-${t(
					"CreateOutcome"
				)}.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "4",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-${t("Selector")}-${t(
					"Auxiliaries"
				)}.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "5",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBSyncAirtable.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "A",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBFetchAirtable.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "A",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBSyncVika.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "V",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBFetchVika.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "V",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBSyncFeishu.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "F",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
					"SyncTemplates"
				)}/IOTO-OBFetchFeishu.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "F",
				},
			},
		];

		// 提取所有模板路径到一个数组中
		const templatePaths = hotkeyMappings.map(
			(mapping) => mapping.templatePath
		);

		await this.templaterService.addTemplaterHotkeys(templatePaths);

		// 1. 确保模板存在
		for (const mapping of hotkeyMappings) {
			if (!this.templateExists(mapping.templatePath)) {
				new Notice(
					`${t("Template does not exist:")} ${mapping.templatePath}`
				);
				return;
			}
		}

		// 2. 获取当前热键配置
		const hotkeysPath = ".obsidian/hotkeys.json";
		let currentHotkeys: HotkeyConfig = {};

		try {
			const content = await this.app.vault.adapter.read(hotkeysPath);
			currentHotkeys = JSON.parse(content || "{}");
		} catch (e) {
			console.error(t("Read hotkeys.json error:"), e);
			// 如果文件不存在，创建空对象
			currentHotkeys = {};
		}

		// 3. 添加新热键
		let addedCount = 0;
		for (const mapping of hotkeyMappings) {
			const commandId = `templater-obsidian:${mapping.templatePath}`;
			const newHotkey = mapping.hotkey;

			// 初始化此命令的热键数组（如果不存在）
			if (!currentHotkeys[commandId]) {
				currentHotkeys[commandId] = [];
			}

			// 检查是否已存在相同的热键配置
			const exists = currentHotkeys[commandId].some((existingHotkey) => {
				return (
					existingHotkey.key === newHotkey.key &&
					JSON.stringify(existingHotkey.modifiers.sort()) ===
						JSON.stringify(newHotkey.modifiers.sort())
				);
			});

			if (!exists) {
				currentHotkeys[commandId].push(newHotkey);
				addedCount++;
			}
		}

		// 4. 保存回hotkeys.json
		try {
			await this.app.vault.adapter.write(
				hotkeysPath,
				JSON.stringify(currentHotkeys, null, 2)
			);
			new Notice(
				`${t("Successfully added")} ${addedCount} ${t(
					"hotkeys to Obsidian"
				)}`
			);
		} catch (e) {
			console.error(t("Write to hotkeys.json error:"), e);
			new Notice(t("Update hotkeys.json failed"));
		}
	}

	// 检查模板文件是否存在
	templateExists(templatePath: string): boolean {
		const file = this.app.vault.getAbstractFileByPath(templatePath);
		return file instanceof TFile;
	}
}
