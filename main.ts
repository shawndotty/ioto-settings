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
	addLinkToCurrentTDL: boolean;
	defaultTDLDateFormat: string;
	projectNameFormat: string;
	inputSelectorExcludesPaths: string;
	outputSelectorExcludesPaths: string;
	taskSelectorExcludesPaths: string;
	outcomeSelectorExcludesPaths: string;
	inputSelectorShowOptionOrder: boolean;
	outputSelectorShowOptionOrder: boolean;
	taskSelectorShowOptionOrder: boolean;
	outcomeSelectorShowOptionOrder: boolean;
	inputSelectorShowBasePath: boolean;
	outputSelectorShowBasePath: boolean;
	taskSelectorShowBasePath: boolean;
	outcomeSelectorShowBasePath: boolean;
	inputSelectorFolderOptionTemplate: string;
	outputSelectorFolderOptionTemplate: string;
	taskSelectorFolderOptionTemplate: string;
	outcomeSelectorFolderOptionTemplate: string;
	outcomeSelectorIncludeParentFolder: boolean;
	outcomeProjectDefaultSubFolders: string;
	newInputNoteFollowUpAction: string;
	newOutputNoteFollowUpAction: string;
	newOutcomeNoteFollowUpAction: string;
	taskSelectorEnableFutureDaysChoices: boolean;
	taskSelectorUseCustomTdlNames: boolean;
	fleetingNotePrefix: string;
	fleetingNoteDateFormat: string;
	inputNoteNamePrefix: string;
	inputNoteNamePostfix: string;
	inputNoteDefaultExcalidrawTemplate: string;
	outputNoteNamePrefix: string;
	outputNoteNamePostfix: string;
	outputNoteDefaultExcalidrawTemplate: string;
	outcomeNoteNamePrefix: string;
	outcomeNoteNamePostfix: string;
	outcomeNoteDefaultExcalidrawTemplate: string;
	defaultTDLHeadingLevel: string;
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
	addLinkToCurrentTDL: true,
	defaultTDLDateFormat: "YYYY-MM-DD",
	projectNameFormat: "lastDash",
	inputSelectorExcludesPaths: "",
	outputSelectorExcludesPaths: "",
	taskSelectorExcludesPaths: "",
	outcomeSelectorExcludesPaths: "",
	inputSelectorShowOptionOrder: true,
	outputSelectorShowOptionOrder: true,
	taskSelectorShowOptionOrder: true,
	outcomeSelectorShowOptionOrder: true,
	inputSelectorShowBasePath: false,
	outputSelectorShowBasePath: false,
	taskSelectorShowBasePath: false,
	outcomeSelectorShowBasePath: false,
	inputSelectorFolderOptionTemplate: "在 {{folder}} 创建输入笔记",
	outputSelectorFolderOptionTemplate: "在 {{folder}} 创建输出笔记",
	taskSelectorFolderOptionTemplate: "在 {{folder}} 创建任务列表",
	outcomeSelectorFolderOptionTemplate: "在 {{folder}} 创建成果笔记",
	outcomeSelectorIncludeParentFolder: true,
	outcomeProjectDefaultSubFolders: "文章\n总结",
	newInputNoteFollowUpAction: "0",
	newOutputNoteFollowUpAction: "0",
	newOutcomeNoteFollowUpAction: "0",
	taskSelectorEnableFutureDaysChoices: false,
	taskSelectorUseCustomTdlNames: false,
	fleetingNotePrefix: "闪念",
	fleetingNoteDateFormat: "YYYY-MM-DD",
	inputNoteNamePrefix: "",
	inputNoteNamePostfix: "",
	inputNoteDefaultExcalidrawTemplate: "",
	outputNoteNamePrefix: "",
	outputNoteNamePostfix: "",
	outputNoteDefaultExcalidrawTemplate: "",
	outcomeNoteNamePrefix: "",
	outcomeNoteNamePostfix: "",
	outcomeNoteDefaultExcalidrawTemplate: "",
	defaultTDLHeadingLevel: "##"
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
			content = content.replace(/from .+"\n/g, `from "${taskFolder}"\n`);
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

		new Setting(containerEl)
		.setName(t("ADD_LINK_TO_CURRENT_TDL"))
		.setDesc(t("ADD_LINK_TO_CURRENT_TDL_HINT"))
		.addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.addLinkToCurrentTDL)
                .onChange(async (addLToTDL) => {
					this.plugin.settings.addLinkToCurrentTDL = addLToTDL;
					await this.plugin.saveSettings();
				});
		});
		
		containerEl.createEl("h2", {text: t("IOTO_PROJECT_AND_LTD_List_Settings")});

		new Setting(containerEl)
		.setName(t("PROJECT_NAME_FORMAT"))
		.setDesc(t("PROJECT_NAME_FORMAT_HINT"))
		.addDropdown(cb => {
			cb.addOption("lastDash", t("Project_NAME_FORMAT_1"))
				.addOption("firstDash", t("Project_NAME_FORMAT_2"))
				.addOption("wholeFolderName", t("Project_NAME_FORMAT_3"))
				.setValue(this.plugin.settings.projectNameFormat)
				.onChange(async (value) => {
					console.dir(value);
					this.plugin.settings.projectNameFormat = value;
					await this.plugin.saveSettings();
				})
		});

		new Setting(containerEl)
		.setName(t("LTD_LIST_DATE_FORMAT"))
		.setDesc(t("LTD_LIST_DATE_FORMAT_HINT"))
		.addText(text => text
			.setPlaceholder(t("LTD_LIST_DATE_FORMAT_PLACE_HOLDER"))
			.setValue(this.plugin.settings.defaultTDLDateFormat)
			.onChange(async (value) => {
				this.plugin.settings.defaultTDLDateFormat = value;
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
