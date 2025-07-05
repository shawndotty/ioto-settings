import { Plugin } from "obsidian";
import { IOTOSettings } from "./types";
import { SettingsManager } from "./models/settings";
import { IOTOSettingTab } from "./ui/settings/settings-tab";
import { FolderService } from "./services/folder-service";
import { TemplaterService } from "./services/templater-service";
import { HotkeyService } from "./services/hotkey-service";
import { CommandService } from "./services/commands-service";

export default class IOTO extends Plugin {
	settings: IOTOSettings;
	settingsManager: SettingsManager;
	folderService: FolderService;
	templaterService: TemplaterService;
	hotkeyService: HotkeyService;
	commandService: CommandService;

	async onload() {
		// 初始化设置管理器
		this.settingsManager = new SettingsManager(
			() => this.loadData(),
			(data) => this.saveData(data)
		);
		this.settings = await this.settingsManager.load();

		// 初始化服务
		this.folderService = new FolderService(this.app, this.settings);
		this.templaterService = new TemplaterService(this.app, this.settings);
		this.hotkeyService = new HotkeyService(this.app, this.templaterService);
		this.commandService = new CommandService(
			this.app,
			this,
			this.settings,
			this.folderService,
			this.templaterService,
			this.hotkeyService
		);

		// 注册命令
		this.commandService.registerCommands();

		// 添加设置选项卡
		this.addSettingTab(new IOTOSettingTab(this.app, this));
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
