import { Plugin } from "obsidian";
import { IOTOSettings } from "./types";
import { SettingsManager } from "./models/settings";
import { IOTOSettingTab } from "./ui/settings/settings-tab";
import { FolderService } from "./services/folder-service";
import { TemplaterService } from "./services/templater-service";
import { HotkeyService } from "./services/hotkey-service";
import { addStyles } from "./ui/styles";
import { t } from "./lang/helpers";

export default class IOTO extends Plugin {
	settings: IOTOSettings;
	private settingsManager: SettingsManager;
	private folderService: FolderService;
	private templaterService: TemplaterService;
	private hotkeyService: HotkeyService;

	async onload() {
		addStyles();
		// 初始化设置管理器
		this.settingsManager = new SettingsManager(
			() => this.loadData(),
			(data) => this.saveData(data)
		);
		this.settings = await this.settingsManager.load();

		// 初始化服务
		this.folderService = new FolderService(this.app, this.settings);
		this.templaterService = new TemplaterService(this.app, this.settings);
		this.hotkeyService = new HotkeyService(this.app);

		// 注册命令
		this.registerCommands();

		// 添加设置选项卡
		this.addSettingTab(new IOTOSettingTab(this.app, this));
	}

	private registerCommands() {
		// 注册所有命令
		this.addCommand({
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

		this.addCommand({
			id: "ioto-create-ioto-folders",
			name: t("Create IOTO Folders"),
			callback: async () => {
				await this.folderService.addIOTOFolders();
			},
		});

		this.addCommand({
			id: "ioto-create-project",
			name: t("Create New Project"),
			callback: async () => {
				await this.folderService.addIOTOProject();
			},
		});

		this.addCommand({
			id: "ioto-create-default-projects",
			name: t("Create Default Projects"),
			callback: async () => {
				await this.folderService.addIOTODefaultProjects();
			},
		});

		this.addCommand({
			id: "ioto-create-default-input-sub-folders",
			name: t("Create Default Input Sub Folders"),
			callback: async () => {
				await this.folderService.addIOTODefaultInputSubFolders();
			},
		});

		this.addCommand({
			id: "ioto-create-default-output-sub-folders",
			name: t("Create Default Output Sub Folders"),
			callback: async () => {
				await this.folderService.addIOTODefaultOutputSubFolders();
			},
		});

		this.addCommand({
			id: "ioto-add-templater-hotkeys",
			name: t("Add IOTO Hotkeys"),
			callback: async () => {
				await this.hotkeyService.addIOTOHotkeys();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});

		this.addCommand({
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

	onunload() {}

	async loadSettings() {
		this.settings = await this.settingsManager.load();
	}

	async saveSettings() {
		this.settingsManager.update(this.settings);
		await this.settingsManager.save();
	}
}
