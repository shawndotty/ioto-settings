import { App, TFile, normalizePath, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { t } from "./lang/helpers";

import { FolderSuggest } from "./suggesters/FolderSuggester";

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
	useUserTemplate: boolean;
	IOTOMovieTimeTags: string;
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
	useUserTemplate: true,
	IOTOMovieTimeTags: 'MT1,MT2,MT3,MT4',
}

export default class IOTO extends Plugin {
	settings: IOTOSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IOTOSettingTab(this.app, this));
		
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

		containerEl.createEl("h2", {text: t("IOTO_Basic_Settings")});
		
		new Setting(containerEl)
		.setName(t("INPUT_FOLDER"))
		.setDesc(t("SET_INPUT_FOLDER"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_INPUT_FOLDER_HINT"))
				.setValue(this.plugin.settings.inputFolder)
				.onChange(async (newFolder) => {
					this.plugin.settings.inputFolder = newFolder;
					await this.plugin.saveSettings();
				})
			
		});

		new Setting(containerEl)
		.setName(t("OUTPUT_FOLDER"))
		.setDesc(t("SET_OUTPUT_FOLDER"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_OUTPUT_FOLDER_HINT"))
				.setValue(this.plugin.settings.outputFolder)
				.onChange(async (newFolder) => {
					this.plugin.settings.outputFolder = newFolder;
					await this.plugin.saveSettings();
				})
			
		});

		new Setting(containerEl)
		.setName(t("TASK_FOLDER"))
		.setDesc(t("SET_TASK_FOLDER"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_TASK_FOLDER_HINT"))
				.setValue(this.plugin.settings.taskFolder)
				.onChange(async (newFolder) => {
					this.plugin.settings.taskFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.rebuildTaskDashboard(newFolder);
				})
				
			});

		new Setting(containerEl)
		.setName(t("OUTCOME_FOLDER"))
		.setDesc(t("SET_OUTCOME_FOLDER"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_OUTCOME_FOLDER_HINT"))
				.setValue(this.plugin.settings.outcomeFolder)
				.onChange(async (newFolder) => {
					this.plugin.settings.outcomeFolder = newFolder;
					await this.plugin.saveSettings();
				})
			
		});

		new Setting(containerEl)
		.setName(t("EXTRA_FOLDER"))
		.setDesc(t("SET_EXTRA_FOLDER"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_EXTRA_FOLDER_HINT"))
				.setValue(this.plugin.settings.extraFolder)
				.onChange(async (newFolder) => {
					this.plugin.settings.extraFolder = newFolder;
					await this.plugin.saveSettings();
				})
			
		});

		new Setting(containerEl)
		.setName(t("IOTO_FRAMEWORK_PATH"))
		.setDesc(t("SET_IOTO_FRAMEWORK_PATH"))
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl, this.app);
			cb.setPlaceholder(t("SET_IOTO_FRAMEWORK_PATH_HINT"))
				.setValue(this.plugin.settings.IOTOFrameworkPath)
				.onChange(async (newFolder) => {
					this.plugin.settings.IOTOFrameworkPath = newFolder;
					await this.plugin.saveSettings();
				})
			
		});

		new Setting(containerEl)
		.setName(t("USE_USER_TEMPLATE"))
		.setDesc(t("TOGGLE_USE_USER_TEMPLATE"))
		.addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.useUserTemplate)
                .onChange(async (useUT) => {
					this.plugin.settings.useUserTemplate = useUT;
					await this.plugin.saveSettings();
				});
		});
		
		containerEl.createEl("h2", {text: t("IOTO_LTD_List_Headings_Settings")});

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

		containerEl.createEl("h2", {text: t("IOTO_Movie_Time_Tags_Settings")});

		new Setting(containerEl)
		.setName(t("IOTO_MOVIE_TIME_TAGS"))
		.setDesc(t("SET_IOTO_MOVIE_TIME_TAGS"))
		.addText(text => text
			.setPlaceholder(t("IOTO_MOVIE_TIME_TAGS_HINT"))
			.setValue(this.plugin.settings.IOTOMovieTimeTags)
			.onChange(async (value) => {
				this.plugin.settings.IOTOMovieTimeTags = value;
				await this.plugin.saveSettings();
			}));

	}
}
