import { App, Plugin } from "obsidian";
import { t } from "../lang/helpers";
import { IOTOSettings } from "../types";
import { FolderService } from "./folder-service";
import { HotkeyService } from "./hotkey-service";
import { TemplaterService } from "./templater-service";

export class CommandService {
	constructor(
		private app: App,
		private plugin: Plugin,
		private settings: IOTOSettings,
		private folderService: FolderService,
		private templaterService: TemplaterService,
		private hotkeyService: HotkeyService
	) {}

	registerCommands() {
		// 注册所有命令
		this.plugin.addCommand({
			id: "ioto-init-setup",
			name: t("Initialize IOTO"),
			callback: async () => {
				await this.folderService.addIOTOFolders();
				await this.folderService.addIOTODefaultInputSubFolders();
				await this.folderService.addIOTODefaultOutputSubFolders();
				await this.folderService.addIOTODefaultProjects();
				await this.hotkeyService.addIOTOHotkeys();
				await this.templaterService.addTemplaterPaths();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});

		this.plugin.addCommand({
			id: "ioto-create-ioto-folders",
			name: t("Create IOTO Folders"),
			callback: async () => {
				await this.folderService.addIOTOFolders();
			},
		});

		this.plugin.addCommand({
			id: "ioto-create-project",
			name: t("Create New Project"),
			callback: async () => {
				await this.folderService.addIOTOProject();
			},
		});

		this.plugin.addCommand({
			id: "ioto-create-default-projects",
			name: t("Create Default Projects"),
			callback: async () => {
				await this.folderService.addIOTODefaultProjects();
			},
		});

		this.plugin.addCommand({
			id: "ioto-create-default-input-sub-folders",
			name: t("Create Default Input Sub Folders"),
			callback: async () => {
				await this.folderService.addIOTODefaultInputSubFolders();
			},
		});

		this.plugin.addCommand({
			id: "ioto-create-default-output-sub-folders",
			name: t("Create Default Output Sub Folders"),
			callback: async () => {
				await this.folderService.addIOTODefaultOutputSubFolders();
			},
		});

		this.plugin.addCommand({
			id: "ioto-add-templater-hotkeys",
			name: t("Add IOTO Hotkeys"),
			callback: async () => {
				await this.hotkeyService.addIOTOHotkeys();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});

		this.plugin.addCommand({
			id: "ioto-add-templater-paths",
			name: t(
				"Add IOTO Templates and Scripts Path to Templater Plugin Setting"
			),
			callback: async () => {
				await this.templaterService.addTemplaterPaths();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});
	}
}
