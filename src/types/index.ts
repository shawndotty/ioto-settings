import { App } from "obsidian";

declare module "obsidian" {
	interface App {
		commands: {
			executeCommandById(id: string): void;
		};
		plugins: {
			plugins: {
				[key: string]: any;
			};
		};
		dom: {
			appContainerEl: HTMLElement;
		};
	}
}

export interface IOTOSettings {
	inputFolder: string;
	outputFolder: string;
	taskFolder: string;
	outcomeFolder: string;
	extraFolder: string;
	IOTOFrameworkPath: string;
	userTemplatePrefix: string;
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
	inputFolderDefaultSubFolders: string;
	outputFolderDefaultSubFolders: string;
	defaultProjects: string;
	// 辅助工具设置
	iotoUtilsSnRRulesFolder: string;
	iotoUtilsQuickImageSize: string;
	iotoUtilsQuickImageMask: boolean;
	iotoUtilsTemplateSnippetFolder: string;
	iotoUtilsPropertyManagementFolder: string;
	iotoUtilsQuickBlockTypes: string;
	iotoUtilsQuickBlockIdDateFormat: string;
	iotoUtilsQuickBlockIdUseSingleLineAsSeparator: boolean;
	// 同步设置
	airtableAPIKeyForSync: string;
	airtableBaseIDForSync: string;
	airtableTableIDForSync: string;

	airtableAPIKeyForFetch: string;
	airtableBaseIDForFetch: string;
	airtableTableIDForFetch: string;

	vikaAPIKeyForSync: string;
	vikaTableIDForSync: string;

	vikaAPIKeyForFetch: string;
	vikaTableIDForFetch: string;

	feishuAppIDForSync: string;
	feishuAppSecretForSync: string;
	feishuBaseIDForSync: string;
	feishuTableIDForSync: string;

	feishuAppIDForFetch: string;
	feishuAppSecretForFetch: string;
	feishuBaseIDForFetch: string;
	feishuTableIDForFetch: string;
}

export interface HotkeyMapping {
	templatePath: string;
	hotkey: {
		modifiers: string[];
		key: string;
	};
}

export interface HotkeyConfig {
	[key: string]: Array<{ modifiers: string[]; key: string }>;
}

// 设置项配置接口
export interface SettingConfig {
	name: string;
	desc: string;
	placeholder?: string;
	value: any;
	onChange: (value: any) => Promise<void>;
}

// 第三方服务配置接口
export interface ThirdPartyServiceConfig {
	serviceName: string;
	apiKeySetting: string;
	apiKeyHint: string;
	baseIdSetting?: string;
	baseIdHint?: string;
	tableIdSetting: string;
	tableIdHint: string;
	appSecretSetting?: string;
	appSecretHint?: string;
	baseUrl: string;
	templateUrl: string;
	yourTableText: string;
	templateText: string;
}
