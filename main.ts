import { App, TFile, normalizePath, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
	templaterDataPath: string;
	hotkeysFile: string;
	workspacesFile: string;
	projectNameSource: string;
	newInputNoteAddedToTDLFollowUpAction: string;
	newOutputNoteAddedToTDLFollowUpAction: string;
	newOutcomeNoteAddedToTDLFollowUpAction: string;
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
	defaultTDLHeadingLevel: "##",
	templaterDataPath: "plugins/templater-obsidian/data.json",
	hotkeysFile: "hotkeys.json",
	workspacesFile: "workspaces.json",
	projectNameSource: "first",
	newInputNoteAddedToTDLFollowUpAction: "0",
	newOutputNoteAddedToTDLFollowUpAction: "0",
	newOutcomeNoteAddedToTDLFollowUpAction: "0",
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
		const { IOTOFrameworkPath } = this.settings;
		const taskDashboard = this.app.vault.getAbstractFileByPath(normalizePath(`${IOTOFrameworkPath}/Dashboard/Task-Dashboard.md`));

		if (taskDashboard instanceof TFile) {
			let content = await this.app.vault.read(taskDashboard);
			content = content.replace(/from .+"\n/g, `from "${taskFolder}"\n`);
			await this.app.vault.modify(taskDashboard, content);
		}
	}

	async changeIOTOBaseFolder(newFolder: string, oldFolder: string) {
		const {templaterDataPath, hotkeysFile, workspacesFile} = this.settings;
		const configDir = this.app.vault.configDir;
		const files = [
			configDir + "/" + templaterDataPath,
			configDir + "/" + hotkeysFile,
			configDir + "/" + workspacesFile,
		]
		for (let index = 0; index < files.length; index++) {
			const filePath = files[index];
			if(await this.app.vault.adapter.exists(filePath) && "" !== newFolder && newFolder !== oldFolder) {
				let content = await this.app.vault.adapter.read(filePath);
				content = content.replace(":"+oldFolder + "/", ":"+newFolder + "/").replace('"'+oldFolder + "/", '"'+newFolder + "/");
				await this.app.vault.adapter.write(filePath, content);
			}
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
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: t("IOTO_Settings_Heading") });

		containerEl.createEl("h3", { text: t("IOTO_Basic_Settings") });

		new Setting(containerEl).setName(t("USE_USER_TEMPLATE")).setDesc(t("TOGGLE_USE_USER_TEMPLATE")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.useUserTemplate).onChange(async (useUT) => {
				this.plugin.settings.useUserTemplate = useUT;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("INPUT_FOLDER")).setDesc(t("SET_INPUT_FOLDER")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_INPUT_FOLDER_HINT")).setValue(this.plugin.settings.inputFolder).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.inputFolder;
				if (newFolder) {
					this.plugin.settings.inputFolder = newFolder;
				}
				await this.plugin.saveSettings();
				
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
				
			});
		});
		new Setting(containerEl).setName(t("OUTPUT_FOLDER")).setDesc(t("SET_OUTPUT_FOLDER")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_OUTPUT_FOLDER_HINT")).setValue(this.plugin.settings.outputFolder).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.outputFolder;
				if (newFolder) {
				this.plugin.settings.outputFolder = newFolder;
				}
				await this.plugin.saveSettings();
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
			});
		});
		new Setting(containerEl).setName(t("TASK_FOLDER")).setDesc(t("SET_TASK_FOLDER")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_TASK_FOLDER_HINT")).setValue(this.plugin.settings.taskFolder).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.taskFolder;
				if (newFolder) {
					this.plugin.settings.taskFolder = newFolder;
				}
				await this.plugin.saveSettings();
				await this.plugin.rebuildTaskDashboard(newFolder ? newFolder : oldFolder);
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
			});
		});
		new Setting(containerEl).setName(t("OUTCOME_FOLDER")).setDesc(t("SET_OUTCOME_FOLDER")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_OUTCOME_FOLDER_HINT")).setValue(this.plugin.settings.outcomeFolder).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.outcomeFolder;
				if (newFolder) {
					this.plugin.settings.outcomeFolder = newFolder;
				}
				await this.plugin.saveSettings();
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
			});
		});
		new Setting(containerEl).setName(t("EXTRA_FOLDER")).setDesc(t("SET_EXTRA_FOLDER")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_EXTRA_FOLDER_HINT")).setValue(this.plugin.settings.extraFolder).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.extraFolder;
				if (newFolder) {
					this.plugin.settings.extraFolder = newFolder;
				}
				await this.plugin.saveSettings();
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
			});
		});
		new Setting(containerEl).setName(t("IOTO_FRAMEWORK_PATH")).setDesc(t("SET_IOTO_FRAMEWORK_PATH")).addText((cb) => {
			//new FolderSuggest(cb.inputEl);
			cb.setPlaceholder(t("SET_IOTO_FRAMEWORK_PATH_HINT")).setValue(this.plugin.settings.IOTOFrameworkPath).onChange(async (newFolder) => {
				const oldFolder = this.plugin.settings.IOTOFrameworkPath;
				if (newFolder) {
					this.plugin.settings.IOTOFrameworkPath = newFolder;
				}
				await this.plugin.saveSettings();
				await this.plugin.changeIOTOBaseFolder(newFolder, oldFolder);
			});
		});
		containerEl.createEl("h3", { text: t("IOTO_PROJECT_AND_LTD_List_Settings") });
		
		new Setting(containerEl).setName(t("PROJECT_NAME_SOURCE")).setDesc(t("PROJECT_NAME_SOURCE_HINT")).addDropdown((cb) => {
			cb.addOption("first", t("PROJECT_NAME_SOURCE_1")).addOption("last", t("PROJECT_NAME_SOURCE_2")).setValue(this.plugin.settings.projectNameSource).onChange(async (value) => {
				this.plugin.settings.projectNameSource = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("PROJECT_NAME_FORMAT")).setDesc(t("PROJECT_NAME_FORMAT_HINT")).addDropdown((cb) => {
			cb.addOption("lastDash", t("Project_NAME_FORMAT_1")).addOption("firstDash", t("Project_NAME_FORMAT_2")).addOption("wholeFolderName", t("Project_NAME_FORMAT_3")).setValue(this.plugin.settings.projectNameFormat).onChange(async (value) => {
				this.plugin.settings.projectNameFormat = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("LTD_LIST_DATE_FORMAT")).setDesc(t("LTD_LIST_DATE_FORMAT_HINT")).addText(
			(text) => text.setPlaceholder(t("LTD_LIST_DATE_FORMAT_PLACE_HOLDER")).setValue(this.plugin.settings.defaultTDLDateFormat).onChange(async (value) => {
				this.plugin.settings.defaultTDLDateFormat = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("LTD_LIST_INPUT_HEADING")).setDesc(t("SET_LTD_LIST_INPUT_HEADING")).addText(
			(text) => text.setPlaceholder(t("LTD_LIST_INPUT_HEADING_HINT")).setValue(this.plugin.settings.LTDListInputSectionHeading).onChange(async (value) => {
				this.plugin.settings.LTDListInputSectionHeading = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("LTD_LIST_OUTPUT_HEADING")).setDesc(t("SET_LTD_LIST_OUTPUT_HEADING")).addText((text) => text.setPlaceholder(t("LTD_LIST_OUTPUT_HEADING_HINT")).setValue(this.plugin.settings.LTDListOutputSectionHeading).onChange(async (value) => {
			this.plugin.settings.LTDListOutputSectionHeading = value;
			await this.plugin.saveSettings();
		}));
		new Setting(containerEl).setName(t("LTD_LIST_OUTCOME_HEADING")).setDesc(t("SET_LTD_LIST_OUTCOME_HEADING")).addText(
			(text) => text.setPlaceholder(t("LTD_LIST_OUTCOME_HEADING_HINT")).setValue(this.plugin.settings.LTDListOutcomeSectionHeading).onChange(async (value) => {
				this.plugin.settings.LTDListOutcomeSectionHeading = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("DEFAULT_TDL_HEADING_LEVEL")).setDesc(t("DEFAULT_TDL_HEADING_LEVEL_HINT"))
		.addDropdown(
			(cb) => cb.addOption("#", t("HEADING_LEVEL_1"))
			.addOption("##", t("HEADING_LEVEL_2"))
			.addOption("###", t("HEADING_LEVEL_3"))
			.setValue(this.plugin.settings.defaultTDLHeadingLevel)
			.onChange(async (value) => {
				this.plugin.settings.defaultTDLHeadingLevel = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("USE_CUSTOM_TDL_NAMES")).setDesc(t("USE_CUSTOM_TDL_NAMES_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.taskSelectorUseCustomTdlNames).onChange(async (on) => {
				this.plugin.settings.taskSelectorUseCustomTdlNames = on;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("ADD_LINK_TO_CURRENT_TDL")).setDesc(t("ADD_LINK_TO_CURRENT_TDL_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.addLinkToCurrentTDL).onChange(async (addLToTDL) => {
				this.plugin.settings.addLinkToCurrentTDL = addLToTDL;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0")).addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")).addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")).setValue(this.plugin.settings.newInputNoteAddedToTDLFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newInputNoteAddedToTDLFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0")).addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")).addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")).setValue(this.plugin.settings.newOutputNoteAddedToTDLFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newOutputNoteAddedToTDLFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0")).addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")).addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")).setValue(this.plugin.settings.newOutcomeNoteAddedToTDLFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newOutcomeNoteAddedToTDLFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});


		containerEl.createEl("h3", { text: t("IOTO_INPUT_SELECTOR_SETTINGS") });
		containerEl.createEl("h4", { text: t("IOTO_INPUT_SELECTOR_FOLDER_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("INPUT_SELECTOR_EXCLUDES_PATHS")).setDesc(t("INPUT_SELECTOR_EXCLUDES_PATHS_HINT")).addTextArea(
			(textArea) => textArea.setPlaceholder("").setValue(this.plugin.settings.inputSelectorExcludesPaths).onChange(async (value) => {
				this.plugin.settings.inputSelectorExcludesPaths = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("SHOW_OPTION_ORDER")).setDesc(t("SHOW_OPTION_ORDER_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.inputSelectorShowOptionOrder).onChange(async (show) => {
				this.plugin.settings.inputSelectorShowOptionOrder = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SHOW_BASE_PATH")).setDesc(t("SHOW_BASE_PATH_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.inputSelectorShowBasePath).onChange(async (show) => {
				this.plugin.settings.inputSelectorShowBasePath = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE")).setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.inputSelectorFolderOptionTemplate).onChange(async (value) => {
				this.plugin.settings.inputSelectorFolderOptionTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h4", { text: t("IOTO_INPUT_SELECTOR_NOTE_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("FOLLOW_UP_ACTION_0")).addOption("1", t("FOLLOW_UP_ACTION_1")).addOption("2", t("FOLLOW_UP_ACTION_2")).addOption("3", t("FOLLOW_UP_ACTION_3")).addOption("4", t("FOLLOW_UP_ACTION_4")).setValue(this.plugin.settings.newInputNoteFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newInputNoteFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("NOTE_NAME_PREFIX")).setDesc(t("NOTE_NAME_PREFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.inputNoteNamePrefix).onChange(async (value) => {
				this.plugin.settings.inputNoteNamePrefix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("NOTE_NAME_POSTFIX")).setDesc(t("NOTE_NAME_POSTFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.inputNoteNamePostfix).onChange(async (value) => {
				this.plugin.settings.inputNoteNamePostfix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("DEFAULT_EXCALIDRAW_TEMPLATE")).setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.inputNoteDefaultExcalidrawTemplate).onChange(async (value) => {
				this.plugin.settings.inputNoteDefaultExcalidrawTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h3", { text: t("IOTO_OUTPUT_SELECTOR_SETTINGS") });
		containerEl.createEl("h4", { text: t("IOTO_OUTPUT_SELECTOR_FOLDER_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("OUTPUT_SELECTOR_EXCLUDES_PATHS")).setDesc(t("OUTPUT_SELECTOR_EXCLUDES_PATHS_HINT")).addTextArea(
			(textArea) => textArea.setPlaceholder("").setValue(this.plugin.settings.outputSelectorExcludesPaths).onChange(async (value) => {
				this.plugin.settings.outputSelectorExcludesPaths = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("SHOW_OPTION_ORDER")).setDesc(t("SHOW_OPTION_ORDER_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.outputSelectorShowOptionOrder).onChange(async (show) => {
				this.plugin.settings.outputSelectorShowOptionOrder = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SHOW_BASE_PATH")).setDesc(t("SHOW_BASE_PATH_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.outputSelectorShowBasePath).onChange(async (show) => {
				this.plugin.settings.outputSelectorShowBasePath = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE")).setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outputSelectorFolderOptionTemplate).onChange(async (value) => {
				this.plugin.settings.outputSelectorFolderOptionTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h4", { text: t("IOTO_OUTPUT_SELECTOR_NOTE_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("FOLLOW_UP_ACTION_0")).addOption("1", t("FOLLOW_UP_ACTION_1")).addOption("2", t("FOLLOW_UP_ACTION_2")).addOption("3", t("FOLLOW_UP_ACTION_3")).addOption("4", t("FOLLOW_UP_ACTION_4")).setValue(this.plugin.settings.newOutputNoteFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newOutputNoteFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("NOTE_NAME_PREFIX")).setDesc(t("NOTE_NAME_PREFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outputNoteNamePrefix).onChange(async (value) => {
				this.plugin.settings.outputNoteNamePrefix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("NOTE_NAME_POSTFIX")).setDesc(t("NOTE_NAME_POSTFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outputNoteNamePostfix).onChange(async (value) => {
				this.plugin.settings.outputNoteNamePostfix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("DEFAULT_EXCALIDRAW_TEMPLATE")).setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outputNoteDefaultExcalidrawTemplate).onChange(async (value) => {
				this.plugin.settings.outputNoteDefaultExcalidrawTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("FLEETING_NOTE_PREFIX")).setDesc(t("FLEETING_NOTE_PREFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.fleetingNotePrefix).onChange(async (value) => {
				this.plugin.settings.fleetingNotePrefix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("FLEETING_NOTE_DATE_FORMAT")).setDesc(t("FLEETING_NOTE_DATE_FORMAT_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.fleetingNoteDateFormat).onChange(async (value) => {
				this.plugin.settings.fleetingNoteDateFormat = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h3", { text: t("IOTO_TASK_SELECTOR_SETTINGS") });
		containerEl.createEl("h4", { text: t("IOTO_TASK_SELECTOR_FOLDER_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("TASK_SELECTOR_EXCLUDES_PATHS")).setDesc(t("TASK_SELECTOR_EXCLUDES_PATHS_HINT")).addTextArea(
			(textArea) => textArea.setPlaceholder("").setValue(this.plugin.settings.taskSelectorExcludesPaths).onChange(async (value) => {
				this.plugin.settings.taskSelectorExcludesPaths = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("SHOW_OPTION_ORDER")).setDesc(t("SHOW_OPTION_ORDER_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.taskSelectorShowOptionOrder).onChange(async (show) => {
				this.plugin.settings.taskSelectorShowOptionOrder = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SHOW_BASE_PATH")).setDesc(t("SHOW_BASE_PATH_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.taskSelectorShowBasePath).onChange(async (show) => {
				this.plugin.settings.taskSelectorShowBasePath = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE")).setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.taskSelectorFolderOptionTemplate).onChange(async (value) => {
				this.plugin.settings.taskSelectorFolderOptionTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h4", { text: t("IOTO_TASK_SELECTOR_OTHER_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("ENABLE_FUTURE_DAYS_CHOICES")).setDesc(t("ENABLE_FUTURE_DAYS_CHOICES_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.taskSelectorEnableFutureDaysChoices).onChange(async (on) => {
				this.plugin.settings.taskSelectorEnableFutureDaysChoices = on;
				await this.plugin.saveSettings();
			});
		});
		containerEl.createEl("h3", { text: t("IOTO_OUTCOME_SELECTOR_SETTINGS") });
		containerEl.createEl("h4", { text: t("IOTO_OUTCOME_SELECTOR_FOLDER_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("OUTCOME_SELECTOR_EXCLUDES_PATHS")).setDesc(t("OUTCOME_SELECTOR_EXCLUDES_PATHS_HINT")).addTextArea(
			(textArea) => textArea.setPlaceholder("").setValue(this.plugin.settings.outcomeSelectorExcludesPaths).onChange(async (value) => {
				this.plugin.settings.outcomeSelectorExcludesPaths = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("SHOW_OPTION_ORDER")).setDesc(t("SHOW_OPTION_ORDER_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.outcomeSelectorShowOptionOrder).onChange(async (show) => {
				this.plugin.settings.outcomeSelectorShowOptionOrder = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SHOW_BASE_PATH")).setDesc(t("SHOW_BASE_PATH_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.outcomeSelectorShowBasePath).onChange(async (show) => {
				this.plugin.settings.outcomeSelectorShowBasePath = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE")).setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outcomeSelectorFolderOptionTemplate).onChange(async (value) => {
				this.plugin.settings.outcomeSelectorFolderOptionTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("INCLUDE_PARENT_FOLDER")).setDesc(t("INCLUDE_PARENT_FOLDER_HINT")).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.outcomeSelectorIncludeParentFolder).onChange(async (show) => {
				this.plugin.settings.outcomeSelectorIncludeParentFolder = show;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("OUTCOME_PROJECT_DEFAULT_SUBFOLDERS")).setDesc(t("OUTCOME_PROJECT_DEFAULT_SUBFOLDERS_HINT")).addTextArea(
			(textArea) => textArea.setPlaceholder("").setValue(this.plugin.settings.outcomeProjectDefaultSubFolders).onChange(async (value) => {
				this.plugin.settings.outcomeProjectDefaultSubFolders = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h4", { text: t("IOTO_OUTCOME_SELECTOR_NOTE_OPTION_SETTINGS") });
		new Setting(containerEl).setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION")).setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT")).addDropdown((cb) => {
			cb.addOption("0", t("FOLLOW_UP_ACTION_0")).addOption("1", t("FOLLOW_UP_ACTION_1")).addOption("2", t("FOLLOW_UP_ACTION_2")).addOption("3", t("FOLLOW_UP_ACTION_3")).addOption("4", t("FOLLOW_UP_ACTION_4")).setValue(this.plugin.settings.newOutcomeNoteFollowUpAction).onChange(async (value) => {
				this.plugin.settings.newOutcomeNoteFollowUpAction = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName(t("NOTE_NAME_PREFIX")).setDesc(t("NOTE_NAME_PREFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outcomeNoteNamePrefix).onChange(async (value) => {
				this.plugin.settings.outcomeNoteNamePrefix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("NOTE_NAME_POSTFIX")).setDesc(t("NOTE_NAME_POSTFIX_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outcomeNoteNamePostfix).onChange(async (value) => {
				this.plugin.settings.outcomeNoteNamePostfix = value;
				await this.plugin.saveSettings();
			})
		);
		new Setting(containerEl).setName(t("DEFAULT_EXCALIDRAW_TEMPLATE")).setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT")).addText(
			(text) => text.setPlaceholder("").setValue(this.plugin.settings.outcomeNoteDefaultExcalidrawTemplate).onChange(async (value) => {
				this.plugin.settings.outcomeNoteDefaultExcalidrawTemplate = value;
				await this.plugin.saveSettings();
			})
		);
		containerEl.createEl("h3", { text: t("IOTO_Movie_Time_Tags_Settings") });
		new Setting(containerEl).setName(t("IOTO_MOVIE_TIME_TAGS")).setDesc(t("SET_IOTO_MOVIE_TIME_TAGS")).addText(
			(text) => text.setPlaceholder(t("IOTO_MOVIE_TIME_TAGS_HINT")).setValue(this.plugin.settings.IOTOMovieTimeTags).onChange(async (value) => {
				this.plugin.settings.IOTOMovieTimeTags = value;
				await this.plugin.saveSettings();
			})
		);

	}
}
