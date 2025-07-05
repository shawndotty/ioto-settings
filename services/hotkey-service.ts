import { App, Notice, TFile } from "obsidian";
import { t } from "../lang/helpers";
import { HotkeyConfig, HotkeyMapping } from "../types";
import { TemplaterService } from "./templater-service";

export class HotkeyService {
	constructor(private app: App, private templaterService: TemplaterService) {}

	private createTemplatePath(type: string, name: string): string {
		return `${t(
			"0-Extras"
		)}/IOTO/Templates/Templater/OBIOTO/IOTO-${type}-${name}.md`;
	}

	private createSyncTemplatePath(action: string, platform: string): string {
		return `${t("0-Extras")}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
			"SyncTemplates"
		)}/IOTO-OB${action}${platform}.md`;
	}

	async addIOTOHotkeys() {
		// 定义要添加的热键映射
		const hotkeyMappings = [
			{
				templatePath: this.createTemplatePath(
					t("Selector"),
					t("CreateInput")
				),
				hotkey: {
					modifiers: ["Alt"],
					key: "1",
				},
			},
			{
				templatePath: this.createTemplatePath(
					t("Selector"),
					t("CreateOutput")
				),
				hotkey: {
					modifiers: ["Alt"],
					key: "2",
				},
			},
			{
				templatePath: this.createTemplatePath(
					t("Selector"),
					t("CreateTask")
				),
				hotkey: {
					modifiers: ["Alt"],
					key: "3",
				},
			},
			{
				templatePath: this.createTemplatePath(
					t("Selector"),
					t("CreateOutcome")
				),
				hotkey: {
					modifiers: ["Alt"],
					key: "4",
				},
			},
			{
				templatePath: this.createTemplatePath(
					t("Selector"),
					t("Auxiliaries")
				),
				hotkey: {
					modifiers: ["Alt"],
					key: "5",
				},
			},
			{
				templatePath: this.createSyncTemplatePath("SyncAirtable", "OB"),
				hotkey: {
					modifiers: ["Alt"],
					key: "A",
				},
			},
			{
				templatePath: this.createSyncTemplatePath(
					"FetchAirtable",
					"OB"
				),
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "A",
				},
			},
			{
				templatePath: this.createSyncTemplatePath("SyncVika", "OB"),
				hotkey: {
					modifiers: ["Alt"],
					key: "V",
				},
			},
			{
				templatePath: this.createSyncTemplatePath("FetchVika", "OB"),
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "V",
				},
			},
			{
				templatePath: this.createSyncTemplatePath("SyncFeishu", "OB"),
				hotkey: {
					modifiers: ["Alt"],
					key: "F",
				},
			},
			{
				templatePath: this.createSyncTemplatePath("FetchFeishu", "OB"),
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
		const missingTemplates: string[] = [];
		for (const mapping of hotkeyMappings) {
			if (!this.templateExists(mapping.templatePath)) {
				missingTemplates.push(mapping.templatePath);
			}
		}

		if (missingTemplates.length > 0) {
			new Notice(
				`${t("Templates do not exist:")}\n${missingTemplates.join(
					"\n"
				)}`
			);
			return;
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

	// 添加重置热键的方法
	async resetIOTOHotkeys() {
		const hotkeysPath = ".obsidian/hotkeys.json";
		let currentHotkeys: HotkeyConfig = {};

		try {
			const content = await this.app.vault.adapter.read(hotkeysPath);
			currentHotkeys = JSON.parse(content || "{}");

			// 获取所有IOTO相关的命令ID
			const iotoCommandIds = Object.keys(currentHotkeys).filter(
				(id) =>
					id.includes("templater-obsidian:") &&
					id.includes("/IOTO/Templates/Templater/OBIOTO/")
			);

			// 移除这些命令的热键
			let removedCount = 0;
			for (const id of iotoCommandIds) {
				delete currentHotkeys[id];
				removedCount++;
			}

			// 保存回文件
			await this.app.vault.adapter.write(
				hotkeysPath,
				JSON.stringify(currentHotkeys, null, 2)
			);

			new Notice(
				`${t("Successfully removed %removedCount% IOTO hotkeys", {
					removedCount: removedCount.toString(),
				})}`
			);
		} catch (e) {
			console.error(t("Reset hotkeys error:"), e);
			new Notice(t("Reset hotkeys failed"));
		}
	}

	// 检查热键冲突
	private checkHotkeyConflicts(mappings: HotkeyMapping[]): {
		conflicting: boolean;
		conflicts: string[];
	} {
		const hotkeyMap = new Map<string, string>();
		const conflicts: string[] = [];

		for (const mapping of mappings) {
			const hotkeyString = `${mapping.hotkey.modifiers
				.sort()
				.join("+")}+${mapping.hotkey.key}`;

			if (hotkeyMap.has(hotkeyString)) {
				conflicts.push(
					`${hotkeyString}: ${hotkeyMap.get(hotkeyString)} 和 ${
						mapping.templatePath
					}`
				);
			} else {
				hotkeyMap.set(hotkeyString, mapping.templatePath);
			}
		}

		return {
			conflicting: conflicts.length > 0,
			conflicts,
		};
	}
}
