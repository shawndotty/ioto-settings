import { App, PluginSettingTab, Setting } from "obsidian";
import IOTO from "../../main";
import { TabbedSettings } from "./tabbed-settings";
import { t } from "../../lang/helpers";
import { SettingConfig, ThirdPartyServiceConfig } from "../../types";

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

		// 定义标签页配置
		const tabConfigs = [
			{
				title: "IOTO_Basic_Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderBasicSettings(content),
			},
			{
				title: "IOTO_PROJECT_AND_LTD_List_Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderProjectSettings(content),
			},
			{
				title: "IOTO_INPUT_SELECTOR_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderInputSettings(content),
			},
			{
				title: "IOTO_OUTPUT_SELECTOR_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderOutputSettings(content),
			},
			{
				title: "IOTO_TASK_SELECTOR_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderTaskSettings(content),
			},
			{
				title: "IOTO_OUTCOME_SELECTOR_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderOutcomeSettings(content),
			},
			{
				title: "IOTO_SYNC_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderSyncSettings(content),
			},
			{
				title: "IOTO_FETCH_SETTINGS",
				renderMethod: (content: HTMLElement) =>
					this.renderFetchSettings(content),
			},
			{
				title: "IOTO_Other_Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderOtherSettings(content),
			},
		];

		// 使用循环创建标签页
		tabConfigs.forEach((config) => {
			tabbedSettings.addTab(t(config.title as any), config.renderMethod);
		});
	}

	// 通用方法：创建文本设置项
	private createTextSetting(
		content: HTMLElement,
		config: SettingConfig
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addText((text) => {
				if (config.placeholder) {
					text.setPlaceholder(t(config.placeholder as any));
				}
				text.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建文本区域设置项
	private createTextAreaSetting(
		content: HTMLElement,
		config: SettingConfig
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addTextArea((textArea) => {
				if (config.placeholder) {
					textArea.setPlaceholder(t(config.placeholder as any));
				}
				textArea.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建切换设置项
	private createToggleSetting(
		content: HTMLElement,
		config: SettingConfig
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addToggle((toggle) => {
				toggle.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建下拉选择设置项
	private createDropdownSetting(
		content: HTMLElement,
		config: SettingConfig,
		options: Array<{ value: string; label: string }>
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addDropdown((dropdown) => {
				options.forEach((option) => {
					dropdown.addOption(option.value, t(option.label as any));
				});
				dropdown.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建文件夹设置项
	private createFolderSetting(
		content: HTMLElement,
		nameKey: string,
		descKey: string,
		placeholderKey: string,
		value: string,
		onChange: (newFolder: string, oldFolder: string) => Promise<void>
	): void {
		new Setting(content)
			.setName(t(nameKey as any))
			.setDesc(t(descKey as any))
			.addText((text) => {
				text.setPlaceholder(t(placeholderKey as any))
					.setValue(value)
					.onChange(async (newFolder) => {
						const oldFolder = value;
						if (newFolder) {
							await onChange(newFolder, oldFolder);
						}
					});
			});
	}

	// 通用方法：创建第三方服务设置
	private createThirdPartyServiceSettings(
		content: HTMLElement,
		config: ThirdPartyServiceConfig,
		settings: any
	): void {
		content.createEl("h6", {
			text: t(`IOTO_${config.serviceName.toUpperCase()}_SETTINGS` as any),
		});

		// API Key 设置
		this.createTextSetting(content, {
			name: `IOTO_${config.serviceName.toUpperCase()}_API_KEY`,
			desc: config.apiKeyHint,
			value: settings[config.apiKeySetting],
			onChange: async (value) => {
				settings[config.apiKeySetting] = value;
				await this.plugin.saveSettings();
			},
		});

		// App Secret 设置（如果存在）
		if (config.appSecretSetting && config.appSecretHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_APP_SECRET`,
				desc: config.appSecretHint,
				value: settings[config.appSecretSetting],
				onChange: async (value) => {
					(settings as any)[config.appSecretSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// Base ID 设置（如果存在）
		if (config.baseIdSetting && config.baseIdHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_BASE_ID`,
				desc: config.baseIdHint,
				value: settings[config.baseIdSetting],
				onChange: async (value) => {
					(settings as any)[config.baseIdSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// Table ID 设置
		this.createTextSetting(content, {
			name: `IOTO_${config.serviceName.toUpperCase()}_TABLE_ID`,
			desc: config.tableIdHint,
			value: settings[config.tableIdSetting],
			onChange: async (value) => {
				settings[config.tableIdSetting] = value;
				await this.plugin.saveSettings();
			},
		});

		// 创建链接信息
		this.createServiceLinks(content, config, settings);
	}

	// 通用方法：创建服务链接
	private createServiceLinks(
		content: HTMLElement,
		config: ThirdPartyServiceConfig,
		settings: any
	): void {
		const serviceInfo = content.createEl("div");

		// 构建链接URL
		let linkUrl = config.baseUrl;
		if (config.baseIdSetting && settings[config.baseIdSetting]) {
			linkUrl = linkUrl.replace(
				"{baseId}",
				settings[config.baseIdSetting]
			);
		}
		if (settings[config.tableIdSetting]) {
			linkUrl = linkUrl.replace(
				"{tableId}",
				settings[config.tableIdSetting]
			);
		}

		const baseLink = serviceInfo.createEl("a", {
			text: t(config.yourTableText as any),
			href: linkUrl,
		});
		baseLink.setAttr("target", "_blank");
		baseLink.setAttr("rel", "noopener noreferrer");

		serviceInfo.createEl("span", { text: " | " });

		const templateLink = serviceInfo.createEl("a", {
			text: t(config.templateText as any),
			href: t(config.templateUrl as any),
		});
		templateLink.setAttr("target", "_blank");
		templateLink.setAttr("rel", "noopener noreferrer");
	}

	// 通用方法：创建选择器设置
	private createSelectorSettings(
		content: HTMLElement,
		prefix: string,
		settings: any
	): void {
		content.createEl("h6", {
			text: t(
				`IOTO_${prefix.toUpperCase()}_SELECTOR_FOLDER_OPTION_SETTINGS` as any
			),
		});

		// 排除路径设置
		this.createTextAreaSetting(content, {
			name: `${prefix.toUpperCase()}_SELECTOR_EXCLUDES_PATHS`,
			desc: `${prefix.toUpperCase()}_SELECTOR_EXCLUDES_PATHS_HINT`,
			value: settings[`${prefix}SelectorExcludesPaths`],
			onChange: async (value) => {
				settings[`${prefix}SelectorExcludesPaths`] = value;
				await this.plugin.saveSettings();
			},
		});

		// 显示选项顺序设置
		this.createToggleSetting(content, {
			name: "SHOW_OPTION_ORDER",
			desc: "SHOW_OPTION_ORDER_HINT",
			value: settings[`${prefix}SelectorShowOptionOrder`],
			onChange: async (value) => {
				settings[`${prefix}SelectorShowOptionOrder`] = value;
				await this.plugin.saveSettings();
			},
		});

		// 显示基础路径设置
		this.createToggleSetting(content, {
			name: "SHOW_BASE_PATH",
			desc: "SHOW_BASE_PATH_HINT",
			value: settings[`${prefix}SelectorShowBasePath`],
			onChange: async (value) => {
				settings[`${prefix}SelectorShowBasePath`] = value;
				await this.plugin.saveSettings();
			},
		});

		// 文件夹选项模板设置
		this.createTextSetting(content, {
			name: "SELECTOR_FOLDER_OPTION_TEMPLATE",
			desc: "SELECTOR_FOLDER_OPTION_TEMPLATE_HINT",
			value: settings[`${prefix}SelectorFolderOptionTemplate`],
			onChange: async (value) => {
				settings[`${prefix}SelectorFolderOptionTemplate`] = value;
				await this.plugin.saveSettings();
			},
		});
	}

	// 通用方法：创建笔记选项设置
	private createNoteOptionSettings(
		content: HTMLElement,
		prefix: string,
		settings: any
	): void {
		content.createEl("h6", {
			text: t(
				`IOTO_${prefix.toUpperCase()}_SELECTOR_NOTE_OPTION_SETTINGS` as any
			),
		});

		// 默认新笔记后续操作
		this.createDropdownSetting(
			content,
			{
				name: "DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION",
				desc: "DEFAULT_NEW_NOTE_FOLLOW_UP_ACTION_HINT",
				value: settings[
					`new${
						prefix.charAt(0).toUpperCase() + prefix.slice(1)
					}NoteFollowUpAction`
				],
				onChange: async (value) => {
					settings[
						`new${
							prefix.charAt(0).toUpperCase() + prefix.slice(1)
						}NoteFollowUpAction`
					] = value;
					await this.plugin.saveSettings();
				},
			},
			[
				{ value: "0", label: "FOLLOW_UP_ACTION_0" },
				{ value: "1", label: "FOLLOW_UP_ACTION_1" },
				{ value: "2", label: "FOLLOW_UP_ACTION_2" },
				{ value: "3", label: "FOLLOW_UP_ACTION_3" },
				{ value: "4", label: "FOLLOW_UP_ACTION_4" },
			]
		);

		// 笔记名称前缀
		this.createTextSetting(content, {
			name: "NOTE_NAME_PREFIX",
			desc: "NOTE_NAME_PREFIX_HINT",
			value: settings[`${prefix}NoteNamePrefix`],
			onChange: async (value) => {
				settings[`${prefix}NoteNamePrefix`] = value;
				await this.plugin.saveSettings();
			},
		});

		// 笔记名称后缀
		this.createTextSetting(content, {
			name: "NOTE_NAME_POSTFIX",
			desc: "NOTE_NAME_POSTFIX_HINT",
			value: settings[`${prefix}NoteNamePostfix`],
			onChange: async (value) => {
				settings[`${prefix}NoteNamePostfix`] = value;
				await this.plugin.saveSettings();
			},
		});

		// 默认Excalidraw模板
		this.createTextSetting(content, {
			name: "DEFAULT_EXCALIDRAW_TEMPLATE",
			desc: "DEFAULT_EXCALIDRAW_TEMPLATE_HINT",
			value: settings[`${prefix}NoteDefaultExcalidrawTemplate`],
			onChange: async (value) => {
				settings[`${prefix}NoteDefaultExcalidrawTemplate`] = value;
				await this.plugin.saveSettings();
			},
		});
	}

	private renderBasicSettings(content: HTMLElement) {
		// 用户模板设置
		this.createToggleSetting(content, {
			name: "USE_USER_TEMPLATE",
			desc: "TOGGLE_USE_USER_TEMPLATE",
			value: this.plugin.settings.useUserTemplate,
			onChange: async (value) => {
				this.plugin.settings.useUserTemplate = value;
				await this.plugin.saveSettings();
			},
		});

		this.createTextSetting(content, {
			name: "USER_TEMPLATE_PREFIX",
			desc: "SET_USER_TEMPLATE_PREFIX",
			placeholder: "USER_TEMPLATE_PREFIX_HINT",
			value: this.plugin.settings.userTemplatePrefix,
			onChange: async (value) => {
				this.plugin.settings.userTemplatePrefix = value;
				await this.plugin.saveSettings();
			},
		});

		// 文件夹设置
		const folderSettings = [
			{
				nameKey: "INPUT_FOLDER",
				descKey: "SET_INPUT_FOLDER",
				placeholderKey: "SET_INPUT_FOLDER_HINT",
				value: this.plugin.settings.inputFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.inputFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
			{
				nameKey: "OUTPUT_FOLDER",
				descKey: "SET_OUTPUT_FOLDER",
				placeholderKey: "SET_OUTPUT_FOLDER_HINT",
				value: this.plugin.settings.outputFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.outputFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
			{
				nameKey: "TASK_FOLDER",
				descKey: "SET_TASK_FOLDER",
				placeholderKey: "SET_TASK_FOLDER_HINT",
				value: this.plugin.settings.taskFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.taskFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.rebuildTaskDashboard(
						newFolder || oldFolder
					);
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
			{
				nameKey: "OUTCOME_FOLDER",
				descKey: "SET_OUTCOME_FOLDER",
				placeholderKey: "SET_OUTCOME_FOLDER_HINT",
				value: this.plugin.settings.outcomeFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.outcomeFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
			{
				nameKey: "EXTRA_FOLDER",
				descKey: "SET_EXTRA_FOLDER",
				placeholderKey: "SET_EXTRA_FOLDER_HINT",
				value: this.plugin.settings.extraFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.extraFolder = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
			{
				nameKey: "IOTO_FRAMEWORK_PATH",
				descKey: "SET_IOTO_FRAMEWORK_PATH",
				placeholderKey: "SET_IOTO_FRAMEWORK_PATH_HINT",
				value: this.plugin.settings.IOTOFrameworkPath,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.IOTOFrameworkPath = newFolder;
					await this.plugin.saveSettings();
					await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
						newFolder,
						oldFolder
					);
				},
			},
		];

		folderSettings.forEach((setting) => {
			this.createFolderSetting(
				content,
				setting.nameKey,
				setting.descKey,
				setting.placeholderKey,
				setting.value,
				setting.onChange
			);
		});
	}

	private renderProjectSettings(content: HTMLElement) {
		// 默认项目设置
		this.createTextAreaSetting(content, {
			name: "Setup Your Default Porjects",
			desc: "Please Input Your Default Projects",
			value: this.plugin.settings.defaultProjects,
			onChange: async (value) => {
				this.plugin.settings.defaultProjects = value;
				await this.plugin.saveSettings();
			},
		});

		// 项目名称来源
		this.createDropdownSetting(
			content,
			{
				name: "PROJECT_NAME_SOURCE",
				desc: "PROJECT_NAME_SOURCE_HINT",
				value: this.plugin.settings.projectNameSource,
				onChange: async (value) => {
					this.plugin.settings.projectNameSource = value;
					await this.plugin.saveSettings();
				},
			},
			[
				{ value: "first", label: "PROJECT_NAME_SOURCE_1" },
				{ value: "last", label: "PROJECT_NAME_SOURCE_2" },
			]
		);

		// 项目名称格式
		this.createDropdownSetting(
			content,
			{
				name: "PROJECT_NAME_FORMAT",
				desc: "PROJECT_NAME_FORMAT_HINT",
				value: this.plugin.settings.projectNameFormat,
				onChange: async (value) => {
					this.plugin.settings.projectNameFormat = value;
					await this.plugin.saveSettings();
				},
			},
			[
				{ value: "lastDash", label: "Project_NAME_FORMAT_1" },
				{ value: "firstDash", label: "Project_NAME_FORMAT_2" },
				{ value: "wholeFolderName", label: "Project_NAME_FORMAT_3" },
			]
		);

		// LTD列表设置
		this.createTextSetting(content, {
			name: "LTD_LIST_DATE_FORMAT",
			desc: "LTD_LIST_DATE_FORMAT_HINT",
			placeholder: "LTD_LIST_DATE_FORMAT_PLACE_HOLDER",
			value: this.plugin.settings.defaultTDLDateFormat,
			onChange: async (value) => {
				this.plugin.settings.defaultTDLDateFormat = value;
				await this.plugin.saveSettings();
			},
		});

		// LTD列表标题设置
		const ltdHeadings = [
			{
				key: "LTDListInputSectionHeading",
				name: "LTD_LIST_INPUT_HEADING",
				desc: "SET_LTD_LIST_INPUT_HEADING",
				hint: "LTD_LIST_INPUT_HEADING_HINT",
			},
			{
				key: "LTDListOutputSectionHeading",
				name: "LTD_LIST_OUTPUT_HEADING",
				desc: "SET_LTD_LIST_OUTPUT_HEADING",
				hint: "LTD_LIST_OUTPUT_HEADING_HINT",
			},
			{
				key: "LTDListOutcomeSectionHeading",
				name: "LTD_LIST_OUTCOME_HEADING",
				desc: "SET_LTD_LIST_OUTCOME_HEADING",
				hint: "LTD_LIST_OUTCOME_HEADING_HINT",
			},
		];

		ltdHeadings.forEach((heading) => {
			this.createTextSetting(content, {
				name: heading.name,
				desc: heading.desc,
				placeholder: heading.hint,
				value: (this.plugin.settings as any)[heading.key],
				onChange: async (value) => {
					(this.plugin.settings as any)[heading.key] = value;
					await this.plugin.saveSettings();
				},
			});
		});

		// 默认TDL标题级别
		this.createDropdownSetting(
			content,
			{
				name: "DEFAULT_TDL_HEADING_LEVEL",
				desc: "DEFAULT_TDL_HEADING_LEVEL_HINT",
				value: this.plugin.settings.defaultTDLHeadingLevel,
				onChange: async (value) => {
					this.plugin.settings.defaultTDLHeadingLevel = value;
					await this.plugin.saveSettings();
				},
			},
			[
				{ value: "#", label: "HEADING_LEVEL_1" },
				{ value: "##", label: "HEADING_LEVEL_2" },
				{ value: "###", label: "HEADING_LEVEL_3" },
			]
		);

		// 自定义TDL名称
		this.createToggleSetting(content, {
			name: "USE_CUSTOM_TDL_NAMES",
			desc: "USE_CUSTOM_TDL_NAMES_HINT",
			value: this.plugin.settings.taskSelectorUseCustomTdlNames,
			onChange: async (value) => {
				this.plugin.settings.taskSelectorUseCustomTdlNames = value;
				await this.plugin.saveSettings();
			},
		});

		// 添加当前TDL链接
		this.createToggleSetting(content, {
			name: "ADD_LINK_TO_CURRENT_TDL",
			desc: "ADD_LINK_TO_CURRENT_TDL_HINT",
			value: this.plugin.settings.addLinkToCurrentTDL,
			onChange: async (value) => {
				this.plugin.settings.addLinkToCurrentTDL = value;
				await this.plugin.saveSettings();
			},
		});

		// 后续操作设置
		const followUpActions = [
			{
				key: "newInputNoteAddedToTDLFollowUpAction",
				name: "DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION",
				desc: "DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT",
			},
			{
				key: "newOutputNoteAddedToTDLFollowUpAction",
				name: "DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION",
				desc: "DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT",
			},
			{
				key: "newOutcomeNoteAddedToTDLFollowUpAction",
				name: "DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION",
				desc: "DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT",
			},
		];

		followUpActions.forEach((action) => {
			this.createDropdownSetting(
				content,
				{
					name: action.name,
					desc: action.desc,
					value: (this.plugin.settings as any)[action.key],
					onChange: async (value) => {
						(this.plugin.settings as any)[action.key] = value;
						await this.plugin.saveSettings();
					},
				},
				[
					{ value: "0", label: "ADDED_TO_TDL_FOLLOW_UP_ACTION_0" },
					{ value: "1", label: "ADDED_TO_TDL_FOLLOW_UP_ACTION_1" },
					{ value: "2", label: "ADDED_TO_TDL_FOLLOW_UP_ACTION_2" },
				]
			);
		});
	}

	private renderInputSettings(content: HTMLElement) {
		// 选择器设置
		this.createSelectorSettings(content, "input", this.plugin.settings);

		// 笔记选项设置
		this.createNoteOptionSettings(content, "input", this.plugin.settings);

		// 默认输入子文件夹
		content.createEl("h6", { text: t("Default Input Sub Folders") });

		this.createTextAreaSetting(content, {
			name: "Setup Your Default Input Sub Folders",
			desc: "Please Input Your Default Input Sub Folders",
			value: this.plugin.settings.inputFolderDefaultSubFolders,
			onChange: async (value) => {
				this.plugin.settings.inputFolderDefaultSubFolders = value;
				await this.plugin.saveSettings();
			},
		});
	}

	private renderOutputSettings(content: HTMLElement) {
		// 选择器设置
		this.createSelectorSettings(content, "output", this.plugin.settings);

		// 笔记选项设置
		this.createNoteOptionSettings(content, "output", this.plugin.settings);

		// 闪念笔记设置
		this.createTextSetting(content, {
			name: "FLEETING_NOTE_PREFIX",
			desc: "FLEETING_NOTE_PREFIX_HINT",
			value: this.plugin.settings.fleetingNotePrefix,
			onChange: async (value) => {
				this.plugin.settings.fleetingNotePrefix = value;
				await this.plugin.saveSettings();
			},
		});

		this.createTextSetting(content, {
			name: "FLEETING_NOTE_DATE_FORMAT",
			desc: "FLEETING_NOTE_DATE_FORMAT_HINT",
			value: this.plugin.settings.fleetingNoteDateFormat,
			onChange: async (value) => {
				this.plugin.settings.fleetingNoteDateFormat = value;
				await this.plugin.saveSettings();
			},
		});

		// 默认输出子文件夹
		content.createEl("h6", { text: t("Default Output Sub Folders") });

		this.createTextAreaSetting(content, {
			name: "Setup Your Default Output Sub Folders",
			desc: "Please Input Your Default Output Sub Folders",
			value: this.plugin.settings.outputFolderDefaultSubFolders,
			onChange: async (value) => {
				this.plugin.settings.outputFolderDefaultSubFolders = value;
				await this.plugin.saveSettings();
			},
		});
	}

	private renderTaskSettings(content: HTMLElement) {
		// 选择器设置
		this.createSelectorSettings(content, "task", this.plugin.settings);

		// 其他选项设置
		content.createEl("h6", {
			text: t("IOTO_TASK_SELECTOR_OTHER_OPTION_SETTINGS"),
		});

		this.createToggleSetting(content, {
			name: "ENABLE_FUTURE_DAYS_CHOICES",
			desc: "ENABLE_FUTURE_DAYS_CHOICES_HINT",
			value: this.plugin.settings.taskSelectorEnableFutureDaysChoices,
			onChange: async (value) => {
				this.plugin.settings.taskSelectorEnableFutureDaysChoices =
					value;
				await this.plugin.saveSettings();
			},
		});
	}

	private renderOutcomeSettings(content: HTMLElement) {
		// 选择器设置
		this.createSelectorSettings(content, "outcome", this.plugin.settings);

		// 包含父文件夹设置
		this.createToggleSetting(content, {
			name: "INCLUDE_PARENT_FOLDER",
			desc: "INCLUDE_PARENT_FOLDER_HINT",
			value: this.plugin.settings.outcomeSelectorIncludeParentFolder,
			onChange: async (value) => {
				this.plugin.settings.outcomeSelectorIncludeParentFolder = value;
				await this.plugin.saveSettings();
			},
		});

		// 结果项目默认子文件夹
		this.createTextAreaSetting(content, {
			name: "OUTCOME_PROJECT_DEFAULT_SUBFOLDERS",
			desc: "OUTCOME_PROJECT_DEFAULT_SUBFOLDERS_HINT",
			value: this.plugin.settings.outcomeProjectDefaultSubFolders,
			onChange: async (value) => {
				this.plugin.settings.outcomeProjectDefaultSubFolders = value;
				await this.plugin.saveSettings();
			},
		});

		// 笔记选项设置
		this.createNoteOptionSettings(content, "outcome", this.plugin.settings);
	}

	private renderSyncSettings(content: HTMLElement) {
		// 第三方服务配置
		const syncServices: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Airtable",
				apiKeySetting: "airtableAPIKeyForSync",
				apiKeyHint: "IOTO_AIRTABLE_API_KEY_HINT",
				baseIdSetting: "airtableBaseIDForSync",
				baseIdHint: "IOTO_AIRTABLE_BASE_ID_HINT",
				tableIdSetting: "airtableTableIDForSync",
				tableIdHint: "IOTO_AIRTABLE_TABLE_ID_HINT",
				baseUrl: "https://airtable.com/{baseId}/{tableId}",
				templateUrl: "AirtableSyncTableTemplateURL",
				yourTableText: "YourAirtableSyncTable",
				templateText: "AirtableSyncTemplate",
			},
			{
				serviceName: "Vika",
				apiKeySetting: "vikaAPIKeyForSync",
				apiKeyHint: "IOTO_VIKA_API_KEY_HINT",
				tableIdSetting: "vikaTableIDForSync",
				tableIdHint: "IOTO_VIKA_TABLE_ID_HINT",
				baseUrl: "https://vika.cn/workbench/{tableId}",
				templateUrl: "VikaSyncTableTemplateURL",
				yourTableText: "YourVikaSyncTable",
				templateText: "VikaSyncTemplate",
			},
			{
				serviceName: "Feishu",
				apiKeySetting: "feishuAppIDForSync",
				apiKeyHint: "IOTO_FEISHU_APP_ID_HINT",
				appSecretSetting: "feishuAppSecretForSync",
				appSecretHint: "IOTO_FEISHU_APP_SECRET_HINT",
				baseIdSetting: "feishuBaseIDForSync",
				baseIdHint: "IOTO_FEISHU_BASE_ID_HINT",
				tableIdSetting: "feishuTableIDForSync",
				tableIdHint: "IOTO_FEISHU_TABLE_ID_HINT",
				baseUrl: "https://feishu.cn/base/{baseId}?table={tableId}",
				templateUrl: "FeishuSyncTableTempalteURL",
				yourTableText: "YourFeishuSyncTable",
				templateText: "FeishuSyncTemplate",
			},
		];

		syncServices.forEach((service) => {
			this.createThirdPartyServiceSettings(
				content,
				service,
				this.plugin.settings
			);
		});
	}

	private renderFetchSettings(content: HTMLElement) {
		// 第三方服务配置
		const fetchServices: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Airtable",
				apiKeySetting: "airtableAPIKeyForFetch",
				apiKeyHint: "IOTO_AIRTABLE_API_KEY_HINT",
				baseIdSetting: "airtableBaseIDForFetch",
				baseIdHint: "IOTO_AIRTABLE_BASE_ID_HINT",
				tableIdSetting: "airtableTableIDForFetch",
				tableIdHint: "IOTO_AIRTABLE_TABLE_ID_HINT",
				baseUrl: "https://airtable.com/{baseId}/{tableId}",
				templateUrl: "AirtableFetchTableTemplateURL",
				yourTableText: "YourAirtableFetchTable",
				templateText: "AirtableFetchTemplate",
			},
			{
				serviceName: "Vika",
				apiKeySetting: "vikaAPIKeyForFetch",
				apiKeyHint: "IOTO_VIKA_API_KEY_HINT",
				tableIdSetting: "vikaTableIDForFetch",
				tableIdHint: "IOTO_VIKA_TABLE_ID_HINT",
				baseUrl: "https://vika.cn/workbench/{tableId}",
				templateUrl: "VikaFetchTableTemplateURL",
				yourTableText: "YourVikaFetchTable",
				templateText: "VikaFetchTemplate",
			},
			{
				serviceName: "Feishu",
				apiKeySetting: "feishuAppIDForFetch",
				apiKeyHint: "IOTO_FEISHU_APP_ID_HINT",
				appSecretSetting: "feishuAppSecretForFetch",
				appSecretHint: "IOTO_FEISHU_APP_SECRET_HINT",
				baseIdSetting: "feishuBaseIDForFetch",
				baseIdHint: "IOTO_FEISHU_BASE_ID_HINT",
				tableIdSetting: "feishuTableIDForFetch",
				tableIdHint: "IOTO_FEISHU_TABLE_ID_HINT",
				baseUrl: "https://feishu.cn/base/{baseId}?table={tableId}",
				templateUrl: "FeishuFetchTableTemplateURL",
				yourTableText: "YourFeishuFetchTable",
				templateText: "FeishuFetchTemplate",
			},
		];

		fetchServices.forEach((service) => {
			this.createThirdPartyServiceSettings(
				content,
				service,
				this.plugin.settings
			);
		});
	}

	private renderOtherSettings(content: HTMLElement) {
		// IOTO工具设置
		content.createEl("h6", { text: t("IOTO_Utils_Settings") });

		const utilsSettings = [
			{
				key: "iotoUtilsSnRRulesFolder",
				name: "IOTO_Utils_SnRRulesFolder",
				desc: "IOTO_Utils_SnRRulesFolder_HINT",
			},
			{
				key: "iotoUtilsTemplateSnippetFolder",
				name: "IOTO_Utils_TemplateSnippetFolder",
				desc: "IOTO_Utils_TemplateSnippetFolder_HINT",
			},
			{
				key: "iotoUtilsPropertyManagementFolder",
				name: "IOTO_Utils_PropertyManagementFolder",
				desc: "IOTO_Utils_PropertyManagementFolder_HINT",
			},
		];

		utilsSettings.forEach((setting) => {
			this.createTextSetting(content, {
				name: setting.name,
				desc: setting.desc,
				value: (this.plugin.settings as any)[setting.key],
				onChange: async (value) => {
					(this.plugin.settings as any)[setting.key] = value;
					await this.plugin.saveSettings();
				},
			});
		});

		// 快速图片设置
		this.createTextAreaSetting(content, {
			name: "IOTO_Utils_QuickImageSize",
			desc: "IOTO_Utils_QuickImageSize_HINT",
			value: this.plugin.settings.iotoUtilsQuickImageSize,
			onChange: async (value) => {
				this.plugin.settings.iotoUtilsQuickImageSize = value;
				await this.plugin.saveSettings();
			},
		});

		this.createToggleSetting(content, {
			name: "IOTO_Utils_QuickImageMask",
			desc: "IOTO_Utils_QuickImageMask_HINT",
			value: this.plugin.settings.iotoUtilsQuickImageMask,
			onChange: async (value) => {
				this.plugin.settings.iotoUtilsQuickImageMask = value;
				await this.plugin.saveSettings();
			},
		});

		// 快速块设置
		this.createTextAreaSetting(content, {
			name: "IOTO_Utils_QuickBlockTypes",
			desc: "IOTO_Utils_QuickBlockTypes_HINT",
			value: this.plugin.settings.iotoUtilsQuickBlockTypes,
			onChange: async (value) => {
				this.plugin.settings.iotoUtilsQuickBlockTypes = value;
				await this.plugin.saveSettings();
			},
		});

		this.createTextSetting(content, {
			name: "IOTO_Utils_QuickBlockIdDateFormat",
			desc: "IOTO_Utils_QuickBlockIdDateFormat_HINT",
			value: this.plugin.settings.iotoUtilsQuickBlockIdDateFormat,
			onChange: async (value) => {
				this.plugin.settings.iotoUtilsQuickBlockIdDateFormat = value;
				await this.plugin.saveSettings();
			},
		});

		this.createToggleSetting(content, {
			name: "IOTO_Utils_QuickBlockIdUseSingleLineAsSeparator",
			desc: "IOTO_Utils_QuickBlockIdUseSingleLineAsSeparator_HINT",
			value: this.plugin.settings
				.iotoUtilsQuickBlockIdUseSingleLineAsSeparator,
			onChange: async (value) => {
				this.plugin.settings.iotoUtilsQuickBlockIdUseSingleLineAsSeparator =
					value;
				await this.plugin.saveSettings();
			},
		});

		// 电影时间标签设置
		content.createEl("h6", { text: t("IOTO_Movie_Time_Tags_Settings") });

		this.createTextSetting(content, {
			name: "IOTO_MOVIE_TIME_TAGS",
			desc: "SET_IOTO_MOVIE_TIME_TAGS",
			placeholder: "IOTO_MOVIE_TIME_TAGS_HINT",
			value: this.plugin.settings.IOTOMovieTimeTags,
			onChange: async (value) => {
				this.plugin.settings.IOTOMovieTimeTags = value;
				await this.plugin.saveSettings();
			},
		});
	}
}
