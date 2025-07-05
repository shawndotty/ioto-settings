import { App, PluginSettingTab, Setting } from "obsidian";
import IOTO from "../../main";
import { TabbedSettings } from "./tabbed-settings";
import { t } from "../../lang/helpers";

export class IOTOSettingTab extends PluginSettingTab {
	plugin: IOTO;

	constructor(app: App, plugin: IOTO) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h1", { text: t("IOTO_Settings_Heading") });

		const tabbedSettings = new TabbedSettings(containerEl);

		tabbedSettings.addTab(t("IOTO_Basic_Settings"), (content) => {
			this.renderBasicSettings(content);
		});

		tabbedSettings.addTab(
			t("IOTO_PROJECT_AND_LTD_List_Settings"),
			(content) => {
				this.renderProjectSettings(content);
			}
		);

		tabbedSettings.addTab(t("IOTO_INPUT_SELECTOR_SETTINGS"), (content) => {
			this.renderInputSettings(content);
		});

		tabbedSettings.addTab(t("IOTO_OUTPUT_SELECTOR_SETTINGS"), (content) => {
			this.renderOutputSettings(content);
		});

		tabbedSettings.addTab(t("IOTO_TASK_SELECTOR_SETTINGS"), (content) => {
			this.renderTaskSettings(content);
		});

		tabbedSettings.addTab(
			t("IOTO_OUTCOME_SELECTOR_SETTINGS"),
			(content) => {
				this.renderOutcomeSettings(content);
			}
		);

		tabbedSettings.addTab(t("IOTO_SYNC_SETTINGS"), (content) => {
			this.renderSyncSettings(content);
		});

		tabbedSettings.addTab(t("IOTO_FETCH_SETTINGS"), (content) => {
			this.renderFetchSettings(content);
		});

		tabbedSettings.addTab(t("IOTO_Other_Settings"), (content) => {
			this.renderOtherSettings(content);
		});
	}

	private renderBasicSettings(content: HTMLElement) {
		// 基本设置选项卡的内容
		new Setting(content)
			.setName(t("USE_USER_TEMPLATE"))
			.setDesc(t("TOGGLE_USE_USER_TEMPLATE"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.useUserTemplate)
					.onChange(async (useUT) => {
						this.plugin.settings.useUserTemplate = useUT;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("USER_TEMPLATE_PREFIX"))
			.setDesc(t("SET_USER_TEMPLATE_PREFIX"))
			.addText((cb) => {
				cb.setPlaceholder(t("USER_TEMPLATE_PREFIX_HINT"))
					.setValue(this.plugin.settings.userTemplatePrefix)
					.onChange(async (value) => {
						this.plugin.settings.userTemplatePrefix = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("INPUT_FOLDER"))
			.setDesc(t("SET_INPUT_FOLDER"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_INPUT_FOLDER_HINT"))
					.setValue(this.plugin.settings.inputFolder)
					.onChange(async (newFolder) => {
						const oldFolder = this.plugin.settings.inputFolder;
						if (newFolder) {
							this.plugin.settings.inputFolder = newFolder;
						}
						await this.plugin.saveSettings();

						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
		new Setting(content)
			.setName(t("OUTPUT_FOLDER"))
			.setDesc(t("SET_OUTPUT_FOLDER"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_OUTPUT_FOLDER_HINT"))
					.setValue(this.plugin.settings.outputFolder)
					.onChange(async (newFolder) => {
						const oldFolder = this.plugin.settings.outputFolder;
						if (newFolder) {
							this.plugin.settings.outputFolder = newFolder;
						}
						await this.plugin.saveSettings();
						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
		new Setting(content)
			.setName(t("TASK_FOLDER"))
			.setDesc(t("SET_TASK_FOLDER"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_TASK_FOLDER_HINT"))
					.setValue(this.plugin.settings.taskFolder)
					.onChange(async (newFolder) => {
						const oldFolder = this.plugin.settings.taskFolder;
						if (newFolder) {
							this.plugin.settings.taskFolder = newFolder;
						}
						await this.plugin.saveSettings();
						await this.plugin.rebuildTaskDashboard(
							newFolder ? newFolder : oldFolder
						);
						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
		new Setting(content)
			.setName(t("OUTCOME_FOLDER"))
			.setDesc(t("SET_OUTCOME_FOLDER"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_OUTCOME_FOLDER_HINT"))
					.setValue(this.plugin.settings.outcomeFolder)
					.onChange(async (newFolder) => {
						const oldFolder = this.plugin.settings.outcomeFolder;
						if (newFolder) {
							this.plugin.settings.outcomeFolder = newFolder;
						}
						await this.plugin.saveSettings();
						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
		new Setting(content)
			.setName(t("EXTRA_FOLDER"))
			.setDesc(t("SET_EXTRA_FOLDER"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_EXTRA_FOLDER_HINT"))
					.setValue(this.plugin.settings.extraFolder)
					.onChange(async (newFolder) => {
						const oldFolder = this.plugin.settings.extraFolder;
						if (newFolder) {
							this.plugin.settings.extraFolder = newFolder;
						}
						await this.plugin.saveSettings();
						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
		new Setting(content)
			.setName(t("IOTO_FRAMEWORK_PATH"))
			.setDesc(t("SET_IOTO_FRAMEWORK_PATH"))
			.addText((cb) => {
				//new FolderSuggest(cb.inputEl);
				cb.setPlaceholder(t("SET_IOTO_FRAMEWORK_PATH_HINT"))
					.setValue(this.plugin.settings.IOTOFrameworkPath)
					.onChange(async (newFolder) => {
						const oldFolder =
							this.plugin.settings.IOTOFrameworkPath;
						if (newFolder) {
							this.plugin.settings.IOTOFrameworkPath = newFolder;
						}
						await this.plugin.saveSettings();
						await this.plugin.changeIOTOBaseFolder(
							newFolder,
							oldFolder
						);
					});
			});
	}

	private renderProjectSettings(content: HTMLElement) {
		new Setting(content)
			.setName(t("Setup Your Default Porjects"))
			.setDesc(t("Please Input Your Default Projects"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.defaultProjects)
					.onChange(async (value) => {
						this.plugin.settings.defaultProjects = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("PROJECT_NAME_SOURCE"))
			.setDesc(t("PROJECT_NAME_SOURCE_HINT"))
			.addDropdown((cb) => {
				cb.addOption("first", t("PROJECT_NAME_SOURCE_1"))
					.addOption("last", t("PROJECT_NAME_SOURCE_2"))
					.setValue(this.plugin.settings.projectNameSource)
					.onChange(async (value) => {
						this.plugin.settings.projectNameSource = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("PROJECT_NAME_FORMAT"))
			.setDesc(t("PROJECT_NAME_FORMAT_HINT"))
			.addDropdown((cb) => {
				cb.addOption("lastDash", t("Project_NAME_FORMAT_1"))
					.addOption("firstDash", t("Project_NAME_FORMAT_2"))
					.addOption("wholeFolderName", t("Project_NAME_FORMAT_3"))
					.setValue(this.plugin.settings.projectNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.projectNameFormat = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("LTD_LIST_DATE_FORMAT"))
			.setDesc(t("LTD_LIST_DATE_FORMAT_HINT"))
			.addText((text) =>
				text
					.setPlaceholder(t("LTD_LIST_DATE_FORMAT_PLACE_HOLDER"))
					.setValue(this.plugin.settings.defaultTDLDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.defaultTDLDateFormat = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("LTD_LIST_INPUT_HEADING"))
			.setDesc(t("SET_LTD_LIST_INPUT_HEADING"))
			.addText((text) =>
				text
					.setPlaceholder(t("LTD_LIST_INPUT_HEADING_HINT"))
					.setValue(this.plugin.settings.LTDListInputSectionHeading)
					.onChange(async (value) => {
						this.plugin.settings.LTDListInputSectionHeading = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("LTD_LIST_OUTPUT_HEADING"))
			.setDesc(t("SET_LTD_LIST_OUTPUT_HEADING"))
			.addText((text) =>
				text
					.setPlaceholder(t("LTD_LIST_OUTPUT_HEADING_HINT"))
					.setValue(this.plugin.settings.LTDListOutputSectionHeading)
					.onChange(async (value) => {
						this.plugin.settings.LTDListOutputSectionHeading =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("LTD_LIST_OUTCOME_HEADING"))
			.setDesc(t("SET_LTD_LIST_OUTCOME_HEADING"))
			.addText((text) =>
				text
					.setPlaceholder(t("LTD_LIST_OUTCOME_HEADING_HINT"))
					.setValue(this.plugin.settings.LTDListOutcomeSectionHeading)
					.onChange(async (value) => {
						this.plugin.settings.LTDListOutcomeSectionHeading =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("DEFAULT_TDL_HEADING_LEVEL"))
			.setDesc(t("DEFAULT_TDL_HEADING_LEVEL_HINT"))
			.addDropdown((cb) =>
				cb
					.addOption("#", t("HEADING_LEVEL_1"))
					.addOption("##", t("HEADING_LEVEL_2"))
					.addOption("###", t("HEADING_LEVEL_3"))
					.setValue(this.plugin.settings.defaultTDLHeadingLevel)
					.onChange(async (value) => {
						this.plugin.settings.defaultTDLHeadingLevel = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("USE_CUSTOM_TDL_NAMES"))
			.setDesc(t("USE_CUSTOM_TDL_NAMES_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings.taskSelectorUseCustomTdlNames
					)
					.onChange(async (on) => {
						this.plugin.settings.taskSelectorUseCustomTdlNames = on;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("ADD_LINK_TO_CURRENT_TDL"))
			.setDesc(t("ADD_LINK_TO_CURRENT_TDL_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.addLinkToCurrentTDL)
					.onChange(async (addLToTDL) => {
						this.plugin.settings.addLinkToCurrentTDL = addLToTDL;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION"))
			.setDesc(t("DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT"))
			.addDropdown((cb) => {
				cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
					.addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1"))
					.addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2"))
					.setValue(
						this.plugin.settings
							.newInputNoteAddedToTDLFollowUpAction
					)
					.onChange(async (value) => {
						this.plugin.settings.newInputNoteAddedToTDLFollowUpAction =
							value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION"))
			.setDesc(
				t("DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT")
			)
			.addDropdown((cb) => {
				cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
					.addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1"))
					.addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2"))
					.setValue(
						this.plugin.settings
							.newOutputNoteAddedToTDLFollowUpAction
					)
					.onChange(async (value) => {
						this.plugin.settings.newOutputNoteAddedToTDLFollowUpAction =
							value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION"))
			.setDesc(
				t("DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT")
			)
			.addDropdown((cb) => {
				cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
					.addOption("1", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1"))
					.addOption("2", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2"))
					.setValue(
						this.plugin.settings
							.newOutcomeNoteAddedToTDLFollowUpAction
					)
					.onChange(async (value) => {
						this.plugin.settings.newOutcomeNoteAddedToTDLFollowUpAction =
							value;
						await this.plugin.saveSettings();
					});
			});
	}

	private renderInputSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_INPUT_SELECTOR_FOLDER_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("INPUT_SELECTOR_EXCLUDES_PATHS"))
			.setDesc(t("INPUT_SELECTOR_EXCLUDES_PATHS_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.inputSelectorExcludesPaths)
					.onChange(async (value) => {
						this.plugin.settings.inputSelectorExcludesPaths = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("SHOW_OPTION_ORDER"))
			.setDesc(t("SHOW_OPTION_ORDER_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.inputSelectorShowOptionOrder)
					.onChange(async (show) => {
						this.plugin.settings.inputSelectorShowOptionOrder =
							show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SHOW_BASE_PATH"))
			.setDesc(t("SHOW_BASE_PATH_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.inputSelectorShowBasePath)
					.onChange(async (show) => {
						this.plugin.settings.inputSelectorShowBasePath = show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE"))
			.setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.inputSelectorFolderOptionTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.inputSelectorFolderOptionTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
		content.createEl("h6", {
			text: t("IOTO_INPUT_SELECTOR_NOTE_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION"))
			.setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT"))
			.addDropdown((cb) => {
				cb.addOption("0", t("FOLLOW_UP_ACTION_0"))
					.addOption("1", t("FOLLOW_UP_ACTION_1"))
					.addOption("2", t("FOLLOW_UP_ACTION_2"))
					.addOption("3", t("FOLLOW_UP_ACTION_3"))
					.addOption("4", t("FOLLOW_UP_ACTION_4"))
					.setValue(this.plugin.settings.newInputNoteFollowUpAction)
					.onChange(async (value) => {
						this.plugin.settings.newInputNoteFollowUpAction = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("NOTE_NAME_PREFIX"))
			.setDesc(t("NOTE_NAME_PREFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.inputNoteNamePrefix)
					.onChange(async (value) => {
						this.plugin.settings.inputNoteNamePrefix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("NOTE_NAME_POSTFIX"))
			.setDesc(t("NOTE_NAME_POSTFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.inputNoteNamePostfix)
					.onChange(async (value) => {
						this.plugin.settings.inputNoteNamePostfix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("DEFAULT_EXCALIDRAW_TEMPLATE"))
			.setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.inputNoteDefaultExcalidrawTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.inputNoteDefaultExcalidrawTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);

		content.createEl("h6", {
			text: t("Default Input Sub Folders"),
		});

		new Setting(content)
			.setName(t("Setup Your Default Input Sub Folders"))
			.setDesc(t("Please Input Your Default Input Sub Folders"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.inputFolderDefaultSubFolders)
					.onChange(async (value) => {
						this.plugin.settings.inputFolderDefaultSubFolders =
							value;
						await this.plugin.saveSettings();
					})
			);
	}

	private renderOutputSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_OUTPUT_SELECTOR_FOLDER_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("OUTPUT_SELECTOR_EXCLUDES_PATHS"))
			.setDesc(t("OUTPUT_SELECTOR_EXCLUDES_PATHS_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.outputSelectorExcludesPaths)
					.onChange(async (value) => {
						this.plugin.settings.outputSelectorExcludesPaths =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("SHOW_OPTION_ORDER"))
			.setDesc(t("SHOW_OPTION_ORDER_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings.outputSelectorShowOptionOrder
					)
					.onChange(async (show) => {
						this.plugin.settings.outputSelectorShowOptionOrder =
							show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SHOW_BASE_PATH"))
			.setDesc(t("SHOW_BASE_PATH_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.outputSelectorShowBasePath)
					.onChange(async (show) => {
						this.plugin.settings.outputSelectorShowBasePath = show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE"))
			.setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.outputSelectorFolderOptionTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.outputSelectorFolderOptionTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
		content.createEl("h6", {
			text: t("IOTO_OUTPUT_SELECTOR_NOTE_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION"))
			.setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT"))
			.addDropdown((cb) => {
				cb.addOption("0", t("FOLLOW_UP_ACTION_0"))
					.addOption("1", t("FOLLOW_UP_ACTION_1"))
					.addOption("2", t("FOLLOW_UP_ACTION_2"))
					.addOption("3", t("FOLLOW_UP_ACTION_3"))
					.addOption("4", t("FOLLOW_UP_ACTION_4"))
					.setValue(this.plugin.settings.newOutputNoteFollowUpAction)
					.onChange(async (value) => {
						this.plugin.settings.newOutputNoteFollowUpAction =
							value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("NOTE_NAME_PREFIX"))
			.setDesc(t("NOTE_NAME_PREFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.outputNoteNamePrefix)
					.onChange(async (value) => {
						this.plugin.settings.outputNoteNamePrefix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("NOTE_NAME_POSTFIX"))
			.setDesc(t("NOTE_NAME_POSTFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.outputNoteNamePostfix)
					.onChange(async (value) => {
						this.plugin.settings.outputNoteNamePostfix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("DEFAULT_EXCALIDRAW_TEMPLATE"))
			.setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.outputNoteDefaultExcalidrawTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.outputNoteDefaultExcalidrawTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("FLEETING_NOTE_PREFIX"))
			.setDesc(t("FLEETING_NOTE_PREFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.fleetingNotePrefix)
					.onChange(async (value) => {
						this.plugin.settings.fleetingNotePrefix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("FLEETING_NOTE_DATE_FORMAT"))
			.setDesc(t("FLEETING_NOTE_DATE_FORMAT_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.fleetingNoteDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.fleetingNoteDateFormat = value;
						await this.plugin.saveSettings();
					})
			);

		content.createEl("h6", {
			text: t("Default Output Sub Folders"),
		});

		new Setting(content)
			.setName(t("Setup Your Default Output Sub Folders"))
			.setDesc(t("Please Input Your Default Output Sub Folders"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.outputFolderDefaultSubFolders
					)
					.onChange(async (value) => {
						this.plugin.settings.outputFolderDefaultSubFolders =
							value;
						await this.plugin.saveSettings();
					})
			);
	}

	private renderTaskSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_TASK_SELECTOR_FOLDER_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("TASK_SELECTOR_EXCLUDES_PATHS"))
			.setDesc(t("TASK_SELECTOR_EXCLUDES_PATHS_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.taskSelectorExcludesPaths)
					.onChange(async (value) => {
						this.plugin.settings.taskSelectorExcludesPaths = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("SHOW_OPTION_ORDER"))
			.setDesc(t("SHOW_OPTION_ORDER_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.taskSelectorShowOptionOrder)
					.onChange(async (show) => {
						this.plugin.settings.taskSelectorShowOptionOrder = show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SHOW_BASE_PATH"))
			.setDesc(t("SHOW_BASE_PATH_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.taskSelectorShowBasePath)
					.onChange(async (show) => {
						this.plugin.settings.taskSelectorShowBasePath = show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE"))
			.setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.taskSelectorFolderOptionTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.taskSelectorFolderOptionTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
		content.createEl("h6", {
			text: t("IOTO_TASK_SELECTOR_OTHER_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("ENABLE_FUTURE_DAYS_CHOICES"))
			.setDesc(t("ENABLE_FUTURE_DAYS_CHOICES_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings.taskSelectorEnableFutureDaysChoices
					)
					.onChange(async (on) => {
						this.plugin.settings.taskSelectorEnableFutureDaysChoices =
							on;
						await this.plugin.saveSettings();
					});
			});
	}

	private renderOutcomeSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_OUTCOME_SELECTOR_FOLDER_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("OUTCOME_SELECTOR_EXCLUDES_PATHS"))
			.setDesc(t("OUTCOME_SELECTOR_EXCLUDES_PATHS_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.outcomeSelectorExcludesPaths)
					.onChange(async (value) => {
						this.plugin.settings.outcomeSelectorExcludesPaths =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("SHOW_OPTION_ORDER"))
			.setDesc(t("SHOW_OPTION_ORDER_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings.outcomeSelectorShowOptionOrder
					)
					.onChange(async (show) => {
						this.plugin.settings.outcomeSelectorShowOptionOrder =
							show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SHOW_BASE_PATH"))
			.setDesc(t("SHOW_BASE_PATH_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.outcomeSelectorShowBasePath)
					.onChange(async (show) => {
						this.plugin.settings.outcomeSelectorShowBasePath = show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("SELECTOR_FOLDER_OPTION_TEMPLATE"))
			.setDesc(t("SELECTOR_FOLDER_OPTION_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.outcomeSelectorFolderOptionTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.outcomeSelectorFolderOptionTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("INCLUDE_PARENT_FOLDER"))
			.setDesc(t("INCLUDE_PARENT_FOLDER_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings.outcomeSelectorIncludeParentFolder
					)
					.onChange(async (show) => {
						this.plugin.settings.outcomeSelectorIncludeParentFolder =
							show;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("OUTCOME_PROJECT_DEFAULT_SUBFOLDERS"))
			.setDesc(t("OUTCOME_PROJECT_DEFAULT_SUBFOLDERS_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.outcomeProjectDefaultSubFolders
					)
					.onChange(async (value) => {
						this.plugin.settings.outcomeProjectDefaultSubFolders =
							value;
						await this.plugin.saveSettings();
					})
			);

		content.createEl("h6", {
			text: t("IOTO_OUTCOME_SELECTOR_NOTE_OPTION_SETTINGS"),
		});
		new Setting(content)
			.setName(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION"))
			.setDesc(t("DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT"))
			.addDropdown((cb) => {
				cb.addOption("0", t("FOLLOW_UP_ACTION_0"))
					.addOption("1", t("FOLLOW_UP_ACTION_1"))
					.addOption("2", t("FOLLOW_UP_ACTION_2"))
					.addOption("3", t("FOLLOW_UP_ACTION_3"))
					.addOption("4", t("FOLLOW_UP_ACTION_4"))
					.setValue(this.plugin.settings.newOutcomeNoteFollowUpAction)
					.onChange(async (value) => {
						this.plugin.settings.newOutcomeNoteFollowUpAction =
							value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("NOTE_NAME_PREFIX"))
			.setDesc(t("NOTE_NAME_PREFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.outcomeNoteNamePrefix)
					.onChange(async (value) => {
						this.plugin.settings.outcomeNoteNamePrefix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("NOTE_NAME_POSTFIX"))
			.setDesc(t("NOTE_NAME_POSTFIX_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.outcomeNoteNamePostfix)
					.onChange(async (value) => {
						this.plugin.settings.outcomeNoteNamePostfix = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(content)
			.setName(t("DEFAULT_EXCALIDRAW_TEMPLATE"))
			.setDesc(t("DEFAULT_EXCALIDRAW_TEMPLATE_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings
							.outcomeNoteDefaultExcalidrawTemplate
					)
					.onChange(async (value) => {
						this.plugin.settings.outcomeNoteDefaultExcalidrawTemplate =
							value;
						await this.plugin.saveSettings();
					})
			);
	}

	private renderSyncSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_SYNC_SETTINGS_Airtable"),
		});
		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Airtable_API_KEY"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Airtable_API_KEY_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableAPIKeyForSync)
					.onChange(async (value) => {
						this.plugin.settings.airtableAPIKeyForSync = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Airtable_BASE_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Airtable_BASE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableBaseIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.airtableBaseIDForSync = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Airtable_TABLE_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Airtable_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableTableIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.airtableTableIDForSync = value;
						await this.plugin.saveSettings();
					});
			});

		const airtableSyncInfo = content.createEl("div");
		const airtableSyncBaseLink = airtableSyncInfo.createEl("a", {
			text: t("YourAirtableSyncTable"),
			href: `https://airtable.com/${this.plugin.settings.airtableBaseIDForSync}/${this.plugin.settings.airtableTableIDForSync}`,
		});
		airtableSyncBaseLink.setAttr("target", "_blank");
		airtableSyncBaseLink.setAttr("rel", "noopener noreferrer");

		airtableSyncInfo.createEl("span", {
			text: " | ",
		});

		const airtableSyncTemplateLink = airtableSyncInfo.createEl("a", {
			text: t("AirtableSyncTemplate"),
			href: t("AirtableSyncTableTemplateURL"),
		});
		airtableSyncTemplateLink.setAttr("target", "_blank");
		airtableSyncTemplateLink.setAttr("rel", "noopener noreferrer");

		content.createEl("h6", {
			text: t("IOTO_SYNC_SETTINGS_Vika"),
		});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Vika_API_KEY"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Vika_API_KEY_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.vikaAPIKeyForSync)
					.onChange(async (value) => {
						this.plugin.settings.vikaAPIKeyForSync = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Vika_TABLE_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Vika_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.vikaTableIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.vikaTableIDForSync = value;
						await this.plugin.saveSettings();
					});
			});

		const vikaSyncInfo = content.createEl("div");
		const vikaSyncBaseLink = vikaSyncInfo.createEl("a", {
			text: t("YourVikaSyncTable"),
			href: `https://vika.cn/workbench/${this.plugin.settings.vikaTableIDForSync}`,
		});
		vikaSyncBaseLink.setAttr("target", "_blank");
		vikaSyncBaseLink.setAttr("rel", "noopener noreferrer");

		vikaSyncInfo.createEl("span", {
			text: " | ",
		});

		const vikaSyncTemplateLink = vikaSyncInfo.createEl("a", {
			text: t("VikaSyncTemplate"),
			href: t("VikaSyncTableTemplateURL"),
		});
		vikaSyncTemplateLink.setAttr("target", "_blank");
		vikaSyncTemplateLink.setAttr("rel", "noopener noreferrer");

		content.createEl("h6", {
			text: t("IOTO_SYNC_SETTINGS_Feishu"),
		});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Feishu_APP_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Feishu_APP_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuAppIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.feishuAppIDForSync = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Feishu_APP_SECRET"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Feishu_APP_SECRET_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuAppSecretForSync)
					.onChange(async (value) => {
						this.plugin.settings.feishuAppSecretForSync = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Feishu_BASE_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Feishu_BASE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuBaseIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.feishuBaseIDForSync = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_SYNC_SETTINGS_Feishu_TABLE_ID"))
			.setDesc(t("IOTO_SYNC_SETTINGS_Feishu_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuTableIDForSync)
					.onChange(async (value) => {
						this.plugin.settings.feishuTableIDForSync = value;
						await this.plugin.saveSettings();
					});
			});

		const feishuSyncInfo = content.createEl("div");
		const feishuSyncBaseLink = feishuSyncInfo.createEl("a", {
			text: t("YourFeishuSyncTable"),
			href: `https://feishu.cn/base/${this.plugin.settings.feishuBaseIDForSync}?table=${this.plugin.settings.feishuTableIDForSync}`,
		});
		feishuSyncBaseLink.setAttr("target", "_blank");
		feishuSyncBaseLink.setAttr("rel", "noopener noreferrer");

		feishuSyncInfo.createEl("span", {
			text: " | ",
		});

		const feishuSyncTemplateLink = feishuSyncInfo.createEl("a", {
			text: t("FeishuSyncTemplate"),
			href: t("FeishuSyncTableTempalteURL"),
		});
		feishuSyncTemplateLink.setAttr("target", "_blank");
		feishuSyncTemplateLink.setAttr("rel", "noopener noreferrer");
	}

	private renderFetchSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_FETCH_SETTINGS_Airtable"),
		});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Airtable_API_KEY"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Airtable_API_KEY_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableAPIKeyForFetch)
					.onChange(async (value) => {
						this.plugin.settings.airtableAPIKeyForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Airtable_BASE_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Airtable_BASE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableBaseIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.airtableBaseIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Airtable_TABLE_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Airtable_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.airtableTableIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.airtableTableIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		const airtableFetchInfo = content.createEl("div");
		const airtableFetchBaseLink = airtableFetchInfo.createEl("a", {
			text: t("YourAirtableFetchTable"),
			href: `https://airtable.com/${this.plugin.settings.airtableBaseIDForFetch}/${this.plugin.settings.airtableTableIDForFetch}`,
		});
		airtableFetchBaseLink.setAttr("target", "_blank");
		airtableFetchBaseLink.setAttr("rel", "noopener noreferrer");

		airtableFetchInfo.createEl("span", {
			text: " | ",
		});

		const airtableFetchTemplateLink = airtableFetchInfo.createEl("a", {
			text: t("AirtableFetchTemplate"),
			href: t("AirtableFetchTableTemplateURL"),
		});
		airtableFetchTemplateLink.setAttr("target", "_blank");
		airtableFetchTemplateLink.setAttr("rel", "noopener noreferrer");

		content.createEl("h6", {
			text: t("IOTO_FETCH_SETTINGS_Vika"),
		});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Vika_API_KEY"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Vika_API_KEY_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.vikaAPIKeyForFetch)
					.onChange(async (value) => {
						this.plugin.settings.vikaAPIKeyForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Vika_TABLE_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Vika_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.vikaTableIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.vikaTableIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		const vikaFetchInfo = content.createEl("div");
		const vikaFetchBaseLink = vikaFetchInfo.createEl("a", {
			text: t("YourVikaFetchTable"),
			href: `https://vika.cn/workbench/${this.plugin.settings.vikaTableIDForFetch}`,
		});
		vikaFetchBaseLink.setAttr("target", "_blank");
		vikaFetchBaseLink.setAttr("rel", "noopener noreferrer");

		vikaFetchInfo.createEl("span", {
			text: " | ",
		});

		const vikaFetchTemplateLink = vikaFetchInfo.createEl("a", {
			text: t("VikaFetchTemplate"),
			href: t("VikaFetchTableTemplateURL"),
		});
		vikaFetchTemplateLink.setAttr("target", "_blank");
		vikaFetchTemplateLink.setAttr("rel", "noopener noreferrer");

		content.createEl("h6", {
			text: t("IOTO_FETCH_SETTINGS_Feishu"),
		});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Feishu_APP_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Feishu_APP_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuAppIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.feishuAppIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Feishu_APP_SECRET"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Feishu_APP_SECRET_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuAppSecretForFetch)
					.onChange(async (value) => {
						this.plugin.settings.feishuAppSecretForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Feishu_BASE_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Feishu_BASE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuBaseIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.feishuBaseIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_FETCH_SETTINGS_Feishu_TABLE_ID"))
			.setDesc(t("IOTO_FETCH_SETTINGS_Feishu_TABLE_ID_HINT"))
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.feishuTableIDForFetch)
					.onChange(async (value) => {
						this.plugin.settings.feishuTableIDForFetch = value;
						await this.plugin.saveSettings();
					});
			});
		const feishuFetchInfo = content.createEl("div");
		const feishuFetchBaseLink = feishuFetchInfo.createEl("a", {
			text: t("YourFeishuFetchTable"),
			href: `https://feishu.cn/base/${this.plugin.settings.feishuBaseIDForFetch}?table=${this.plugin.settings.feishuTableIDForFetch}`,
		});
		feishuFetchBaseLink.setAttr("target", "_blank");
		feishuFetchBaseLink.setAttr("rel", "noopener noreferrer");

		feishuFetchInfo.createEl("span", {
			text: " | ",
		});

		const feishuFetchTemplateLink = feishuFetchInfo.createEl("a", {
			text: t("FeishuFetchTemplate"),
			href: t("FeishuFetchTableTemplateURL"),
		});
		feishuFetchTemplateLink.setAttr("target", "_blank");
		feishuFetchTemplateLink.setAttr("rel", "noopener noreferrer");
	}

	private renderOtherSettings(content: HTMLElement) {
		content.createEl("h6", {
			text: t("IOTO_Utils_Settings"),
		});

		new Setting(content)
			.setName(t("IOTO_Utils_SnRRulesFolder"))
			.setDesc(t("IOTO_Utils_SnRRulesFolder_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.iotoUtilsSnRRulesFolder)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsSnRRulesFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_TemplateSnippetFolder"))
			.setDesc(t("IOTO_Utils_TemplateSnippetFolder_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.iotoUtilsTemplateSnippetFolder
					)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsTemplateSnippetFolder =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_PropertyManagementFolder"))
			.setDesc(t("IOTO_Utils_PropertyManagementFolder_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.iotoUtilsPropertyManagementFolder
					)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsPropertyManagementFolder =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_QuickImageSize"))
			.setDesc(t("IOTO_Utils_QuickImageSize_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.iotoUtilsQuickImageSize)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsQuickImageSize = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_QuickImageMask"))
			.setDesc(t("IOTO_Utils_QuickImageMask_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.iotoUtilsQuickImageMask)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsQuickImageMask = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(content)
			.setName(t("IOTO_Utils_QuickBlockTypes"))
			.setDesc(t("IOTO_Utils_QuickBlockTypes_HINT"))
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("")
					.setValue(this.plugin.settings.iotoUtilsQuickBlockTypes)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsQuickBlockTypes = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_QuickBlockIdDateFormat"))
			.setDesc(t("IOTO_Utils_QuickBlockIdDateFormat_HINT"))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(
						this.plugin.settings.iotoUtilsQuickBlockIdDateFormat
					)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsQuickBlockIdDateFormat =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(content)
			.setName(t("IOTO_Utils_QuickBlockIdUseSingleLineAsSeparator"))
			.setDesc(t("IOTO_Utils_QuickBlockIdUseSingleLineAsSeparator_HINT"))
			.addToggle((toggle) => {
				toggle
					.setValue(
						this.plugin.settings
							.iotoUtilsQuickBlockIdUseSingleLineAsSeparator
					)
					.onChange(async (value) => {
						this.plugin.settings.iotoUtilsQuickBlockIdUseSingleLineAsSeparator =
							value;
						await this.plugin.saveSettings();
					});
			});

		content.createEl("h6", {
			text: t("IOTO_Movie_Time_Tags_Settings"),
		});
		new Setting(content)
			.setName(t("IOTO_MOVIE_TIME_TAGS"))
			.setDesc(t("SET_IOTO_MOVIE_TIME_TAGS"))
			.addText((text) =>
				text
					.setPlaceholder(t("IOTO_MOVIE_TIME_TAGS_HINT"))
					.setValue(this.plugin.settings.IOTOMovieTimeTags)
					.onChange(async (value) => {
						this.plugin.settings.IOTOMovieTimeTags = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
