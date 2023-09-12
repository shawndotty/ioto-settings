import { App, TFile, normalizePath, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { t } from "./lang/helpers";

interface IOTOSettings {
	inputFolder: string;
	outputFolder: string;
	taskFolder: string;
	outcomeFolder: string;
	extraFolder: string;
	IOTOFrameworkPath: string;
	LTDListInputSectionHeading: string;
	LTDListOutputSectionHeading: string;
	LTDListOutcomeSectionHeading: string;
}

const DEFAULT_SETTINGS: IOTOSettings = {
	inputFolder: '1-输入',
	outputFolder: '2-输出',
	taskFolder: '3-任务',
	outcomeFolder: '4-成果',
	extraFolder: '0-辅助',
	IOTOFrameworkPath: '0-辅助/IOTO',
	LTDListInputSectionHeading: '输入 LEARN',
	LTDListOutputSectionHeading: '输出 THINK',
	LTDListOutcomeSectionHeading: '成果 DO',
}

export default class IOTO extends Plugin {
	settings: IOTOSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IOTOSettingTab(this.app, this));


		this.addCommand({
			id: 'ioto-rebuild-dataview-dashboard',
			name: t("REBUILD_DATAVIEW_QUERY"),
			callback: () => {
				console.log("here");
			}
		});

		
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async rebuildTaskDashboard(taskFolder: string) {
		const {IOTOFrameworkPath} = this.settings;
		const taskDashboard = this.app.vault.getAbstractFileByPath(normalizePath(`${IOTOFrameworkPath}/Dashboard/Task-Dashboard.md`));

		if (taskDashboard instanceof TFile) {
			let content = await this.app.vault.read(taskDashboard);
			content = content.replace(/(calendar file\.day\nfrom )".+"/g, `$1"${taskFolder}"`);
			await this.app.vault.modify(taskDashboard, content);
		}
	}
}

class IOTOModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class IOTOSettingTab extends PluginSettingTab {
	plugin: IOTO;

	constructor(app: App, plugin: IOTO) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h1", {text: t("IOTO_Settings_Heading")});

		new Setting(containerEl)
			.setName(t("INPUT_FOLDER"))
			.setDesc(t("SET_INPUT_FOLDER"))
			.addText(text => text
				.setPlaceholder(t("SET_INPUT_FOLDER_HINT"))
				.setValue(this.plugin.settings.inputFolder)
				.onChange(async (value) => {
					this.plugin.settings.inputFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
		.setName(t("OUTPUT_FOLDER"))
		.setDesc(t("SET_OUTPUT_FOLDER"))
		.addText(text => text
			.setPlaceholder(t("SET_OUTPUT_FOLDER_HINT"))
			.setValue(this.plugin.settings.outputFolder)
			.onChange(async (value) => {
				this.plugin.settings.outputFolder = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName(t("TASK_FOLDER"))
		.setDesc(t("SET_TASK_FOLDER"))
		.addText(text => text
			.setPlaceholder(t("SET_TASK_FOLDER_HINT"))
			.setValue(this.plugin.settings.taskFolder)
			.onChange(async (value) => {
				this.plugin.settings.taskFolder = value;
				await this.plugin.saveSettings();
				await this.plugin.rebuildTaskDashboard(value);
			}));

		new Setting(containerEl)
		.setName(t("OUTCOME_FOLDER"))
		.setDesc(t("SET_OUTCOME_FOLDER"))
		.addText(text => text
			.setPlaceholder(t("SET_OUTCOME_FOLDER_HINT"))
			.setValue(this.plugin.settings.outcomeFolder)
			.onChange(async (value) => {
				this.plugin.settings.outcomeFolder = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName(t("EXTRA_FOLDER"))
		.setDesc(t("SET_EXTRA_FOLDER"))
		.addText(text => text
			.setPlaceholder(t("SET_EXTRA_FOLDER_HINT"))
			.setValue(this.plugin.settings.extraFolder)
			.onChange(async (value) => {
				this.plugin.settings.extraFolder = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName(t("IOTO_FRAMEWORK_PATH"))
		.setDesc(t("SET_IOTO_FRAMEWORK_PATH"))
		.addText(text => text
			.setPlaceholder(t("SET_IOTO_FRAMEWORK_PATH_HINT"))
			.setValue(this.plugin.settings.IOTOFrameworkPath)
			.onChange(async (value) => {
				this.plugin.settings.IOTOFrameworkPath = value;
				await this.plugin.saveSettings();
			}));
		
		new Setting(containerEl)
		.setName(t("LTD_LIST_INPUT_HEADING"))
		.setDesc(t("SET_LTD_LIST_INPUT_HEADING"))
		.addText(text => text
			.setPlaceholder(t("LTD_LIST_INPUT_HEADING_HINT"))
			.setValue(this.plugin.settings.LTDListInputSectionHeading)
			.onChange(async (value) => {
				this.plugin.settings.LTDListInputSectionHeading = value;
				await this.plugin.saveSettings();
			}));
		
		new Setting(containerEl)
		.setName(t("LTD_LIST_OUTPUT_HEADING"))
		.setDesc(t("SET_LTD_LIST_OUTPUT_HEADING"))
		.addText(text => text
			.setPlaceholder(t("LTD_LIST_OUTPUT_HEADING_HINT"))
			.setValue(this.plugin.settings.LTDListOutputSectionHeading)
			.onChange(async (value) => {
				this.plugin.settings.LTDListOutputSectionHeading = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName(t("LTD_LIST_OUTCOME_HEADING"))
		.setDesc(t("SET_LTD_LIST_OUTCOME_HEADING"))
		.addText(text => text
			.setPlaceholder(t("LTD_LIST_OUTCOME_HEADING_HINT"))
			.setValue(this.plugin.settings.LTDListOutcomeSectionHeading)
			.onChange(async (value) => {
				this.plugin.settings.LTDListOutcomeSectionHeading = value;
				await this.plugin.saveSettings();
			}));
	}
}
