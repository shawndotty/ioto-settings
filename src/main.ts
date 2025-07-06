import { Plugin } from "obsidian";
import { IOTOSettings } from "./types";
import { SettingsManager } from "./models/settings";
import { IOTOSettingTab } from "./ui/settings/settings-tab";
import { ServiceManager } from "./services/service-manager";

export default class IOTO extends Plugin {
	settings: IOTOSettings;
	settingsManager: SettingsManager;
	serviceManager: ServiceManager;

	async onload() {
		// 初始化设置管理器
		this.settingsManager = new SettingsManager(
			() => this.loadData(),
			(data) => this.saveData(data)
		);
		await this.loadSettings();

		// 初始化服务管理器（使用依赖注入）
		this.serviceManager = new ServiceManager(this.app, this, this.settings);
		await this.serviceManager.initialize();

		// 注册命令
		this.serviceManager.commandService.registerCommands();

		// 添加设置选项卡
		this.addSettingTab(new IOTOSettingTab(this.app, this));
	}

	async onunload() {
		// 清理服务
		if (this.serviceManager) {
			await this.serviceManager.dispose();
		}
	}

	async loadSettings() {
		this.settings = await this.settingsManager.load();
	}

	async saveSettings() {
		this.settingsManager.update(this.settings);
		await this.settingsManager.save();
	}
}
