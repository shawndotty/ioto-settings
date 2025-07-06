import { App, Plugin, Notice } from "obsidian";
import { t } from "../lang/helpers";
import { IOTOSettings } from "../types";
import { FolderService } from "./folder-service";
import { HotkeyService } from "./hotkey-service";
import { TemplaterService } from "./templater-service";

interface CommandDefinition {
	id: string;
	name: string;
	callback: () => Promise<void>;
	reloadAfter?: boolean;
}

export class CommandService {
	constructor(
		private app: App,
		private plugin: Plugin,
		private settings: IOTOSettings,
		private folderService: FolderService,
		private templaterService: TemplaterService,
		private hotkeyService: HotkeyService
	) {}

	private async executeWithReload(
		callback: () => Promise<void>
	): Promise<void> {
		await callback();
		setTimeout(() => {
			this.app.commands.executeCommandById("app:reload");
		}, 1000);
	}

	registerCommands() {
		// 定义命令配置
		const commands: CommandDefinition[] = [
			{
				id: "ioto-init-setup",
				name: t("Initialize IOTO"),
				callback: async () => {
					await this.folderService.addIOTOFolders();
					await this.folderService.addIOTODefaultInputSubFolders();
					await this.folderService.addIOTODefaultOutputSubFolders();
					await this.folderService.addIOTODefaultProjects();
					await this.hotkeyService.addIOTOHotkeys();
					await this.templaterService.addTemplaterPaths();
				},
				reloadAfter: true,
			},
			{
				id: "ioto-create-ioto-folders",
				name: t("Create IOTO Folders"),
				callback: async () => {
					await this.folderService.addIOTOFolders();
				},
			},
			{
				id: "ioto-create-project",
				name: t("Create New Project"),
				callback: async () => {
					await this.folderService.addIOTOProject();
				},
			},
			{
				id: "ioto-create-default-projects",
				name: t("Create Default Projects"),
				callback: async () => {
					await this.folderService.addIOTODefaultProjects();
				},
			},
			{
				id: "ioto-create-default-input-sub-folders",
				name: t("Create Default Input Sub Folders"),
				callback: async () => {
					await this.folderService.addIOTODefaultInputSubFolders();
				},
			},
			{
				id: "ioto-create-default-output-sub-folders",
				name: t("Create Default Output Sub Folders"),
				callback: async () => {
					await this.folderService.addIOTODefaultOutputSubFolders();
				},
			},
			{
				id: "ioto-add-templater-hotkeys",
				name: t("Add IOTO Hotkeys"),
				callback: async () => {
					await this.hotkeyService.addIOTOHotkeys();
				},
				reloadAfter: true,
			},
			{
				id: "ioto-add-templater-paths",
				name: t(
					"Add IOTO Templates and Scripts Path to Templater Plugin Setting"
				),
				callback: async () => {
					await this.templaterService.addTemplaterPaths();
				},
				reloadAfter: true,
			},
		];

		// 注册所有命令
		for (const cmd of commands) {
			this.plugin.addCommand({
				id: cmd.id,
				name: cmd.name,
				// 在 registerCommands 方法中的回调函数内添加错误处理
				callback: async () => {
					try {
						if (cmd.reloadAfter) {
							await this.executeWithReload(cmd.callback);
						} else {
							await cmd.callback();
						}
					} catch (error) {
						console.error(`执行命令 ${cmd.id} 时出错:`, error);
						new Notice(`执行命令失败: ${cmd.name}`);
					}
				},
			});
		}
	}
}
