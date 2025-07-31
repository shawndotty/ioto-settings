import { App, Notice, TFile } from "obsidian";
import { t } from "../lang/helpers";
import { HotkeyConfig, HotkeyMapping } from "../types";
import { TemplaterService } from "./templater-service";

// 热键配置接口
interface HotkeyDefinition {
	templatePath: string;
	hotkey: {
		modifiers: string[];
		key: string;
	};
}

// 同步服务配置
interface SyncServiceConfig {
	name: string;
	key: string;
}

export class HotkeyService {
	private readonly HOTKEYS_PATH = ".obsidian/hotkeys.json";
	private readonly IOTO_TEMPLATE_PREFIX = "/IOTO/Templates/Templater/OBIOTO/";

	// 热键配置数据
	private readonly HOTKEY_DEFINITIONS: HotkeyDefinition[] = [
		// 基础模板热键
		...this.createBasicTemplateHotkeys(),
		// 同步服务热键
		...this.createSyncServiceHotkeys(),
	];

	constructor(private app: App, private templaterService: TemplaterService) {}

	/**
	 * 创建基础模板热键配置
	 */
	private createBasicTemplateHotkeys(): HotkeyDefinition[] {
		const basicTemplates = [
			{ name: t("CreateInput"), key: "1" },
			{ name: t("CreateOutput"), key: "2" },
			{ name: t("CreateTask"), key: "3" },
			{ name: t("CreateOutcome"), key: "4" },
			{ name: t("Auxiliaries"), key: "5" },
		];

		return basicTemplates.map(({ name, key }) => ({
			templatePath: this.createTemplatePath(t("Selector"), name),
			hotkey: {
				modifiers: ["Alt"],
				key,
			},
		}));
	}

	/**
	 * 创建同步服务热键配置
	 */
	private createSyncServiceHotkeys(): HotkeyDefinition[] {
		const syncServices: SyncServiceConfig[] = [
			{ name: "Airtable", key: "A" },
			{ name: "Vika", key: "V" },
			{ name: "Feishu", key: "F" },
		];

		const hotkeys: HotkeyDefinition[] = [];

		syncServices.forEach(({ name, key }) => {
			// 同步热键
			hotkeys.push({
				templatePath: this.createSyncTemplatePath("Sync", name),
				hotkey: {
					modifiers: ["Alt"],
					key,
				},
			});

			// 获取热键
			hotkeys.push({
				templatePath: this.createSyncTemplatePath("Fetch", name),
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key,
				},
			});
		});

		return hotkeys;
	}

	/**
	 * 创建模板路径
	 */
	private createTemplatePath(type: string, name: string): string {
		return `${t(
			"0-Extras"
		)}/IOTO/Templates/Templater/OBIOTO/IOTO-${type}-${name}.md`;
	}

	/**
	 * 创建同步模板路径
	 */
	private createSyncTemplatePath(action: string, platform: string): string {
		return `${t("0-Extras")}/IOTO/Templates/Templater/OBIOTO/IOTO${t(
			"SyncTemplates"
		)}/IOTO-OB${action}${platform}.md`;
	}

	/**
	 * 添加IOTO热键
	 */
	async addIOTOHotkeys(): Promise<void> {
		try {
			// 验证模板存在性
			await this.validateTemplates();

			// 添加Templater热键
			await this.addTemplaterHotkeys();

			// 更新Obsidian热键配置
			await this.updateObsidianHotkeys();
		} catch (error) {
			console.error("添加热键时发生错误:", error);
			new Notice(t("Update hotkeys.json failed"));
		}
	}

	/**
	 * 验证所有模板是否存在
	 */
	private async validateTemplates(): Promise<void> {
		const missingTemplates = this.HOTKEY_DEFINITIONS.map(
			(def) => def.templatePath
		).filter((path) => !this.templateExists(path));

		if (missingTemplates.length > 0) {
			throw new Error(
				`${t("Templates do not exist:")}\n${missingTemplates.join(
					"\n"
				)}`
			);
		}
	}

	/**
	 * 添加Templater热键
	 */
	private async addTemplaterHotkeys(): Promise<void> {
		const templatePaths = this.HOTKEY_DEFINITIONS.map(
			(def) => def.templatePath
		);
		await this.templaterService.addTemplaterHotkeys(templatePaths);
	}

	/**
	 * 更新Obsidian热键配置
	 */
	private async updateObsidianHotkeys(): Promise<void> {
		const currentHotkeys = await this.loadHotkeysConfig();
		const addedCount = this.addHotkeysToConfig(currentHotkeys);
		await this.saveHotkeysConfig(currentHotkeys);

		new Notice(
			`${t("Successfully added")} ${addedCount} ${t(
				"hotkeys to Obsidian"
			)}`
		);
	}

	/**
	 * 加载热键配置
	 */
	private async loadHotkeysConfig(): Promise<HotkeyConfig> {
		try {
			const content = await this.app.vault.adapter.read(
				this.HOTKEYS_PATH
			);
			return JSON.parse(content || "{}");
		} catch (error) {
			console.error(t("Read hotkeys.json error:"), error);
			return {};
		}
	}

	/**
	 * 保存热键配置
	 */
	private async saveHotkeysConfig(hotkeys: HotkeyConfig): Promise<void> {
		try {
			await this.app.vault.adapter.write(
				this.HOTKEYS_PATH,
				JSON.stringify(hotkeys, null, 2)
			);
		} catch (error) {
			console.error(t("Write to hotkeys.json error:"), error);
			throw new Error(t("Update hotkeys.json failed"));
		}
	}

	/**
	 * 将热键添加到配置中
	 */
	private addHotkeysToConfig(currentHotkeys: HotkeyConfig): number {
		let addedCount = 0;

		for (const definition of this.HOTKEY_DEFINITIONS) {
			const commandId = `templater-obsidian:${definition.templatePath}`;

			if (!currentHotkeys[commandId]) {
				currentHotkeys[commandId] = [];
			}

			if (
				!this.hotkeyExists(currentHotkeys[commandId], definition.hotkey)
			) {
				currentHotkeys[commandId].push(definition.hotkey);
				addedCount++;
			}
		}

		return addedCount;
	}

	/**
	 * 检查热键是否已存在
	 */
	private hotkeyExists(existingHotkeys: any[], newHotkey: any): boolean {
		return existingHotkeys.some(
			(existing) =>
				existing.key === newHotkey.key &&
				JSON.stringify(existing.modifiers.sort()) ===
					JSON.stringify(newHotkey.modifiers.sort())
		);
	}

	/**
	 * 检查模板文件是否存在
	 */
	templateExists(templatePath: string): boolean {
		const file = this.app.vault.getAbstractFileByPath(templatePath);
		return file instanceof TFile;
	}

	/**
	 * 重置IOTO热键
	 */
	async resetIOTOHotkeys(): Promise<void> {
		try {
			const currentHotkeys = await this.loadHotkeysConfig();
			const removedCount = this.removeIOTOHotkeys(currentHotkeys);
			await this.saveHotkeysConfig(currentHotkeys);

			new Notice(
				`${t("Successfully removed %removedCount% IOTO hotkeys", {
					removedCount: removedCount.toString(),
				})}`
			);
		} catch (error) {
			console.error(t("Reset hotkeys error:"), error);
			new Notice(t("Reset hotkeys failed"));
		}
	}

	/**
	 * 移除IOTO热键
	 */
	private removeIOTOHotkeys(currentHotkeys: HotkeyConfig): number {
		const iotoCommandIds = Object.keys(currentHotkeys).filter(
			(id) =>
				id.includes("templater-obsidian:") &&
				id.includes(this.IOTO_TEMPLATE_PREFIX)
		);

		let removedCount = 0;
		for (const id of iotoCommandIds) {
			delete currentHotkeys[id];
			removedCount++;
		}

		return removedCount;
	}

	/**
	 * 检查热键冲突
	 */
	private checkHotkeyConflicts(mappings: HotkeyMapping[]): {
		conflicting: boolean;
		conflicts: string[];
	} {
		const hotkeyMap = new Map<string, string>();
		const conflicts: string[] = [];

		for (const mapping of mappings) {
			const hotkeyString = this.createHotkeyString(mapping.hotkey);

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

	/**
	 * 创建热键字符串表示
	 */
	private createHotkeyString(hotkey: {
		modifiers: string[];
		key: string;
	}): string {
		return `${hotkey.modifiers.sort().join("+")}+${hotkey.key}`;
	}
}
