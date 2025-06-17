import {
	App,
	TFile,
	Notice,
	normalizePath,
	Plugin,
	Modal,
	PluginSettingTab,
	Setting,
} from "obsidian";

import { t } from "./lang/helpers";

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
	}
}

interface IOTOSettings {
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
}

const DEFAULT_SETTINGS: IOTOSettings = {
	inputFolder: t("1-Inputs"),
	outputFolder: t("2-Outputs"),
	taskFolder: t("3-Tasks"),
	outcomeFolder: t("4-Outcomes"),
	extraFolder: t("0-Extras"),
	userTemplatePrefix: "My",
	IOTOFrameworkPath: t("0-Extras/IOTO"),
	LTDListInputSectionHeading: t("Input (LEARN)"),
	LTDListOutputSectionHeading: t("Output (THINK)"),
	LTDListOutcomeSectionHeading: t("Outcome (DO)"),
	useUserTemplate: true,
	IOTOMovieTimeTags: "MT1,MT2,MT3,MT4",
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
	inputSelectorFolderOptionTemplate: t("Create Input Notes In {{folder}}"),
	outputSelectorFolderOptionTemplate: t("Create Output Notes In {{folder}}"),
	taskSelectorFolderOptionTemplate: t("Create TDL In {{folder}}"),
	outcomeSelectorFolderOptionTemplate: t(
		"Create Outcome Notes In {{folder}}"
	),
	outcomeSelectorIncludeParentFolder: true,
	outcomeProjectDefaultSubFolders: t("Articles\nSummary"),
	newInputNoteFollowUpAction: "0",
	newOutputNoteFollowUpAction: "0",
	newOutcomeNoteFollowUpAction: "0",
	taskSelectorEnableFutureDaysChoices: false,
	taskSelectorUseCustomTdlNames: false,
	fleetingNotePrefix: t("Fleeting Notes"),
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
	inputFolderDefaultSubFolders: t("Resources\nQuickNotes"),
	outputFolderDefaultSubFolders: t("FleetingNotes\nCardNotes"),
	defaultProjects: t("LearnIOTO\nLearnAI"),
	iotoUtilsSnRRulesFolder: t("SearchAndReplaceRules"),
	iotoUtilsQuickImageSize: "1920x1080\n900x600\n600x400",
	iotoUtilsQuickImageMask: true,
	iotoUtilsTemplateSnippetFolder: t("TemplatesSnippets"),
	iotoUtilsPropertyManagementFolder: t("PropertyManagement"),
	iotoUtilsQuickBlockTypes: t("QuickBlockTypes"),
	iotoUtilsQuickBlockIdDateFormat: "YYYY-MM-DD",
	iotoUtilsQuickBlockIdUseSingleLineAsSeparator: true,
};

export class InputModal extends Modal {
	private resolve: (value: string | null) => void;
	private inputEl: HTMLInputElement;

	constructor(
		app: App,
		private promptText: string,
		private defaultValue?: string
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;

		// 添加模态框容器样式
		contentEl.addClass("ioto-input-modal");

		// 创建标题
		contentEl.createEl("h2", {
			text: this.promptText,
			cls: "ioto-input-modal-title",
		});

		// 创建输入框容器
		const inputContainer = contentEl.createEl("div", {
			cls: "ioto-input-container",
		});

		// 创建输入框
		this.inputEl = inputContainer.createEl("input", {
			type: "text",
			value: this.defaultValue || "",
			cls: "ioto-input",
		});

		// 添加键盘事件监听
		this.inputEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.resolve(this.inputEl.value);
				this.close();
			} else if (e.key === "Escape") {
				e.preventDefault();
				this.resolve(null);
				this.close();
			}
		});

		// 创建按钮容器
		const buttonContainer = contentEl.createEl("div", {
			cls: "ioto-button-container",
		});

		// 创建取消按钮
		buttonContainer.createEl(
			"button",
			{
				text: t("Cancel"),
				cls: "ioto-button ioto-button-cancel",
			},
			(btn) => {
				btn.addEventListener("click", () => {
					this.resolve(null);
					this.close();
				});
			}
		);

		// 创建确认按钮
		buttonContainer.createEl(
			"button",
			{
				text: t("Confirm"),
				cls: "ioto-button ioto-button-confirm",
			},
			(btn) => {
				btn.addEventListener("click", () => {
					this.resolve(this.inputEl.value);
					this.close();
				});
			}
		);

		// 自动聚焦输入框
		this.inputEl.focus();
	}

	onClose() {
		this.contentEl.empty();
	}

	async openAndGetValue(): Promise<string | null> {
		return new Promise((resolve) => {
			this.resolve = resolve;
			this.open();
		});
	}
}

export default class IOTO extends Plugin {
	settings: IOTOSettings;

	async onload() {
		this.addStyle();
		await this.loadSettings();

		this.addCommand({
			id: "ioto-init-setup",
			name: t("Initialize IOTO"),
			callback: async () => {
				await this.addIOTOFolders();
				await this.addIOTODefaultInputSubFolders();
				await this.addIOTODefaultOutputSubFolders();
				await this.addIOTODefaultProjects();
				await this.addIOTOHotkeys();
				await this.addTemplaterPaths();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});

		this.addCommand({
			id: "ioto-create-ioto-folders",
			name: t("Create IOTO Folders"),
			callback: async () => {
				await this.addIOTOFolders();
			},
		});

		this.addCommand({
			id: "ioto-create-project",
			name: t("Create New Project"),
			callback: async () => {
				await this.addIOTOProject();
			},
		});

		this.addCommand({
			id: "ioto-create-default-projects",
			name: t("Create Default Projects"),
			callback: async () => {
				await this.addIOTODefaultProjects();
			},
		});

		this.addCommand({
			id: "ioto-create-default-input-sub-folders",
			name: t("Create Default Input Sub Folders"),
			callback: async () => {
				await this.addIOTODefaultInputSubFolders();
			},
		});

		this.addCommand({
			id: "ioto-create-default-output-sub-folders",
			name: t("Create Default Output Sub Folders"),
			callback: async () => {
				await this.addIOTODefaultOutputSubFolders();
			},
		});

		this.addCommand({
			id: "ioto-add-templater-hotkeys",
			name: t("Add IOTO Hotkeys"),
			callback: async () => {
				await this.addIOTOHotkeys();
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
				await this.addTemplaterPaths();
				setTimeout(() => {
					this.app.commands.executeCommandById("app:reload");
				}, 1000);
			},
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IOTOSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async addIOTOFolders() {
		const {
			inputFolder,
			outputFolder,
			taskFolder,
			outcomeFolder,
			extraFolder,
			IOTOFrameworkPath,
		} = this.settings;
		await this.createPathIfNeeded(inputFolder);
		await this.createPathIfNeeded(outputFolder);
		await this.createPathIfNeeded(taskFolder);
		await this.createPathIfNeeded(outcomeFolder);
		await this.createPathIfNeeded(extraFolder);
		await this.createPathIfNeeded(IOTOFrameworkPath);
	}

	async addIOTOProject(projectName: string | null = "") {
		const { taskFolder, outcomeFolder, outcomeProjectDefaultSubFolders } =
			this.settings;
		if (!projectName) {
			// 弹出对话框让用户输入项目名称
			const modal = new InputModal(
				this.app,
				t("Please input project name"),
				""
			);
			projectName = await modal.openAndGetValue();
		}

		if (!projectName) return;

		// 在任务和成果文件夹下创建项目文件夹
		await this.createPathIfNeeded(`${taskFolder}/${projectName}`);
		await this.createPathIfNeeded(`${outcomeFolder}/${projectName}`);

		// 如果配置了子文件夹,则创建子文件夹
		if (outcomeProjectDefaultSubFolders) {
			const subFolders = outcomeProjectDefaultSubFolders.split("\n");
			for (const folder of subFolders) {
				if (folder.trim()) {
					await this.createPathIfNeeded(
						`${outcomeFolder}/${projectName}/${folder.trim()}`
					);
				}
			}
		}
	}

	async addIOTODefaultInputSubFolders() {
		const { inputFolder, inputFolderDefaultSubFolders } = this.settings;
		const subFolders = inputFolderDefaultSubFolders.trim().split("\n");
		for (const subFolder of subFolders) {
			await this.createPathIfNeeded(`${inputFolder}/${subFolder.trim()}`);
		}
	}

	async addIOTODefaultOutputSubFolders() {
		const { outputFolder, outputFolderDefaultSubFolders } = this.settings;
		const subFolders = outputFolderDefaultSubFolders.trim().split("\n");
		for (const subFolder of subFolders) {
			await this.createPathIfNeeded(
				`${outputFolder}/${subFolder.trim()}`
			);
		}
	}

	async addIOTODefaultProjects() {
		const { defaultProjects } = this.settings;
		const projects = defaultProjects.trim().split("\n");
		for (const project of projects) {
			await this.addIOTOProject(project.trim());
		}
	}

	async createPathIfNeeded(folderPath: string): Promise<void> {
		const { vault } = this.app;
		// 使用 vault.adapter.exists() 来检查文件夹是否存在
		const directoryExists = await vault.adapter.exists(folderPath);
		if (!directoryExists) {
			await vault.createFolder(normalizePath(folderPath));
		}
	}

	async rebuildTaskDashboard(taskFolder: string) {
		const { IOTOFrameworkPath } = this.settings;
		const taskDashboard = this.app.vault.getAbstractFileByPath(
			normalizePath(`${IOTOFrameworkPath}/Dashboard/Task-Dashboard.md`)
		);

		if (taskDashboard instanceof TFile) {
			let content = await this.app.vault.read(taskDashboard);
			content = content.replace(/from .+"\n/g, `from "${taskFolder}"\n`);
			await this.app.vault.modify(taskDashboard, content);
		}
	}

	async changeIOTOBaseFolder(newFolder: string, oldFolder: string) {
		const { templaterDataPath, hotkeysFile, workspacesFile } =
			this.settings;
		const configDir = this.app.vault.configDir;
		const files = [
			configDir + "/" + templaterDataPath,
			configDir + "/" + hotkeysFile,
			configDir + "/" + workspacesFile,
		];
		for (let index = 0; index < files.length; index++) {
			const filePath = files[index];
			if (
				(await this.app.vault.adapter.exists(filePath)) &&
				"" !== newFolder &&
				newFolder !== oldFolder
			) {
				let content = await this.app.vault.adapter.read(filePath);
				content = content
					.replace(":" + oldFolder + "/", ":" + newFolder + "/")
					.replace('"' + oldFolder + "/", '"' + newFolder + "/");
				await this.app.vault.adapter.write(filePath, content);
			}
		}
	}

	private getTemplater() {
		// 获取Templater插件实例
		// @ts-ignore
		const templater = this.app.plugins.getPlugin("templater-obsidian");

		if (!templater) {
			new Notice(t("Templater plugin not found or not enabled"));
			return;
		}

		// 获取当前配置
		return templater;
	}

	private async addTemplaterPaths() {
		// 获取当前配置
		const templater = this.getTemplater();
		const currentSettings = templater.settings || {};
		currentSettings.templates_folder = `${t(
			"0-Extras"
		)}/IOTO/Templates/Templater`;
		currentSettings.user_scripts_folder = `${t("0-Extras")}/IOTO/Scripts`;
		// 保存设置
		await templater.save_settings();
		new Notice(t("Successfully add Templater paths"));
	}

	private async addTemplaterHotkeys(templatePaths: Array<string> = []) {
		// 获取当前配置
		const templater = this.getTemplater();
		const currentSettings = templater.settings || {};

		// 初始化enabled_templates_hotkeys数组（如果不存在）
		if (!Array.isArray(currentSettings.enabled_templates_hotkeys)) {
			currentSettings.enabled_templates_hotkeys = [];
		}

		// 添加不存在的模板路径
		let addedCount = 0;
		for (const templatePath of templatePaths) {
			if (
				!currentSettings.enabled_templates_hotkeys.includes(
					templatePath
				)
			) {
				currentSettings.enabled_templates_hotkeys.push(templatePath);
				addedCount++;
			}
		}

		if (addedCount > 0) {
			// 保存设置
			await templater.save_settings();
			new Notice(
				`${t("Added")} ${addedCount} ${t(
					"template(s) to Templater hotkeys"
				)}`
			);
		} else {
			new Notice("All templates already exist in Templater hotkeys");
		}
	}

	private async addIOTOHotkeys() {
		// 定义要添加的热键映射
		const hotkeyMappings = [
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-选择器-创建输入.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "1",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-选择器-创建输出.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "2",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-选择器-创建任务.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "3",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-选择器-创建成果.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "4",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO-选择器-辅助工具.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "5",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBSyncAirtable.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "A",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBFetchAirtable.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "A",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBSyncVika.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "V",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBFetchVika.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "V",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBSyncFeishu.md`,
				hotkey: {
					modifiers: ["Alt"],
					key: "F",
				},
			},
			{
				templatePath: `${t(
					"0-Extras"
				)}/IOTO/Templates/Templater/OBIOTO/IOTO同步模板/IOTO-OBFetchFeishu.md`,
				hotkey: {
					modifiers: ["Alt", "Shift"],
					key: "F",
				},
			},
		];

		// 提取所有模板路径到一个数组中
		const templatePaths = hotkeyMappings.map(
			(mapping) => mapping.templatePath
		);

		await this.addTemplaterHotkeys(templatePaths);

		// 1. 确保模板存在
		for (const mapping of hotkeyMappings) {
			if (!this.templateExists(mapping.templatePath)) {
				new Notice(
					`${t("Template does not exist:")} ${mapping.templatePath}`
				);
				return;
			}
		}

		// 2. 获取当前热键配置
		const hotkeysPath = ".obsidian/hotkeys.json";
		interface HotkeyConfig {
			[key: string]: Array<{ modifiers: string[]; key: string }>;
		}
		let currentHotkeys: HotkeyConfig = {};

		try {
			const content = await this.app.vault.adapter.read(hotkeysPath);
			currentHotkeys = JSON.parse(content || "{}");
		} catch (e) {
			console.error(t("Read hotkeys.json error:"), e);
			// 如果文件不存在，创建空对象
			currentHotkeys = {};
		}

		// 3. 添加新热键
		let addedCount = 0;
		for (const mapping of hotkeyMappings) {
			const commandId = `templater-obsidian:${mapping.templatePath}`;
			const newHotkey = mapping.hotkey;

			// 初始化此命令的热键数组（如果不存在）
			if (!currentHotkeys[commandId]) {
				currentHotkeys[commandId] = [];
			}

			// 检查是否已存在相同的热键配置
			const exists = currentHotkeys[commandId].some((existingHotkey) => {
				return (
					existingHotkey.key === newHotkey.key &&
					JSON.stringify(existingHotkey.modifiers.sort()) ===
						JSON.stringify(newHotkey.modifiers.sort())
				);
			});

			if (!exists) {
				currentHotkeys[commandId].push(newHotkey);
				addedCount++;
			}
		}

		// 4. 保存回hotkeys.json
		try {
			await this.app.vault.adapter.write(
				hotkeysPath,
				JSON.stringify(currentHotkeys, null, 2)
			);
			new Notice(
				`${t("Successfully added")} ${addedCount} ${t(
					"hotkeys to Obsidian"
				)}`
			);
		} catch (e) {
			console.error(t("Write to hotkeys.json error:"), e);
			new Notice(t("Update hotkeys.json failed"));
		}
	}

	// 检查模板文件是否存在
	private templateExists(templatePath: string): boolean {
		const file = this.app.vault.getAbstractFileByPath(templatePath);
		return file instanceof TFile;
	}

	addStyle() {
		const style = document.createElement("style");
		style.textContent = `
            .settings-tabs {
                display: flex;
                border-bottom: 1px solid var(--background-modifier-border);
                margin-bottom: 1em;
            }
            
            .settings-tab {
                padding: 8px 16px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
            }
            
            .settings-tab.active {
                border-bottom-color: var(--interactive-accent);
                color: var(--interactive-accent);
            }
            
            .settings-tab:hover {
                color: var(--text-accent);
            }

            .ioto-input-modal {
                padding: 20px;
                border-radius: 8px;
                background: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .ioto-input-modal-title {
                margin: 0 0 20px 0;
                color: var(--text-normal);
                font-size: 1.2em;
                font-weight: 600;
            }

            .ioto-input-container {
                margin-bottom: 20px;
            }

            .ioto-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-primary);
                color: var(--text-normal);
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .ioto-input:focus {
                outline: none;
                border-color: var(--interactive-accent);
                box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
            }

            .ioto-button-container {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            .ioto-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .ioto-button-cancel {
                background: var(--background-modifier-border);
                color: var(--text-muted);
            }

            .ioto-button-cancel:hover {
                background: var(--background-modifier-border-hover);
            }

            .ioto-button-confirm {
                background: var(--interactive-accent);
                color: var(--text-on-accent);
            }

            .ioto-button-confirm:hover {
                background: var(--interactive-accent-hover);
            }
        `;
		document.head.appendChild(style);
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

		const tabbedSettings = new TabbedSettings(containerEl);

		tabbedSettings.addTab(t("IOTO_Basic_Settings"), (content) => {
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
							const oldFolder =
								this.plugin.settings.outcomeFolder;
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
								this.plugin.settings.IOTOFrameworkPath =
									newFolder;
							}
							await this.plugin.saveSettings();
							await this.plugin.changeIOTOBaseFolder(
								newFolder,
								oldFolder
							);
						});
				});
		});

		tabbedSettings.addTab(
			t("IOTO_PROJECT_AND_LTD_List_Settings"),
			(content) => {
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
							.addOption(
								"wholeFolderName",
								t("Project_NAME_FORMAT_3")
							)
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
							.setPlaceholder(
								t("LTD_LIST_DATE_FORMAT_PLACE_HOLDER")
							)
							.setValue(this.plugin.settings.defaultTDLDateFormat)
							.onChange(async (value) => {
								this.plugin.settings.defaultTDLDateFormat =
									value;
								await this.plugin.saveSettings();
							})
					);
				new Setting(content)
					.setName(t("LTD_LIST_INPUT_HEADING"))
					.setDesc(t("SET_LTD_LIST_INPUT_HEADING"))
					.addText((text) =>
						text
							.setPlaceholder(t("LTD_LIST_INPUT_HEADING_HINT"))
							.setValue(
								this.plugin.settings.LTDListInputSectionHeading
							)
							.onChange(async (value) => {
								this.plugin.settings.LTDListInputSectionHeading =
									value;
								await this.plugin.saveSettings();
							})
					);
				new Setting(content)
					.setName(t("LTD_LIST_OUTPUT_HEADING"))
					.setDesc(t("SET_LTD_LIST_OUTPUT_HEADING"))
					.addText((text) =>
						text
							.setPlaceholder(t("LTD_LIST_OUTPUT_HEADING_HINT"))
							.setValue(
								this.plugin.settings.LTDListOutputSectionHeading
							)
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
							.setValue(
								this.plugin.settings
									.LTDListOutcomeSectionHeading
							)
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
							.setValue(
								this.plugin.settings.defaultTDLHeadingLevel
							)
							.onChange(async (value) => {
								this.plugin.settings.defaultTDLHeadingLevel =
									value;
								await this.plugin.saveSettings();
							})
					);
				new Setting(content)
					.setName(t("USE_CUSTOM_TDL_NAMES"))
					.setDesc(t("USE_CUSTOM_TDL_NAMES_HINT"))
					.addToggle((toggle) => {
						toggle
							.setValue(
								this.plugin.settings
									.taskSelectorUseCustomTdlNames
							)
							.onChange(async (on) => {
								this.plugin.settings.taskSelectorUseCustomTdlNames =
									on;
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
								this.plugin.settings.addLinkToCurrentTDL =
									addLToTDL;
								await this.plugin.saveSettings();
							});
					});
				new Setting(content)
					.setName(
						t("DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")
					)
					.setDesc(
						t(
							"DEFAULT_INPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT"
						)
					)
					.addDropdown((cb) => {
						cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
							.addOption(
								"1",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")
							)
							.addOption(
								"2",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")
							)
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
					.setName(
						t("DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")
					)
					.setDesc(
						t(
							"DEFAULT_OUTPUT_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT"
						)
					)
					.addDropdown((cb) => {
						cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
							.addOption(
								"1",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")
							)
							.addOption(
								"2",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")
							)
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
					.setName(
						t("DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION")
					)
					.setDesc(
						t(
							"DEFAULT_OUTCOME_NOTE_ADDED_TO_TDL_FOLLOW_UP_ACTION_HINT"
						)
					)
					.addDropdown((cb) => {
						cb.addOption("0", t("ADDED_TO_TDL_FOLLOW_UP_ACTION_0"))
							.addOption(
								"1",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_1")
							)
							.addOption(
								"2",
								t("ADDED_TO_TDL_FOLLOW_UP_ACTION_2")
							)
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
		);

		tabbedSettings.addTab(t("IOTO_INPUT_SELECTOR_SETTINGS"), (content) => {
			content.createEl("h6", {
				text: t("IOTO_INPUT_SELECTOR_FOLDER_OPTION_SETTINGS"),
			});
			new Setting(content)
				.setName(t("INPUT_SELECTOR_EXCLUDES_PATHS"))
				.setDesc(t("INPUT_SELECTOR_EXCLUDES_PATHS_HINT"))
				.addTextArea((textArea) =>
					textArea
						.setPlaceholder("")
						.setValue(
							this.plugin.settings.inputSelectorExcludesPaths
						)
						.onChange(async (value) => {
							this.plugin.settings.inputSelectorExcludesPaths =
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
							this.plugin.settings.inputSelectorShowOptionOrder
						)
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
						.setValue(
							this.plugin.settings.inputSelectorShowBasePath
						)
						.onChange(async (show) => {
							this.plugin.settings.inputSelectorShowBasePath =
								show;
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
							this.plugin.settings
								.inputSelectorFolderOptionTemplate
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
						.setValue(
							this.plugin.settings.newInputNoteFollowUpAction
						)
						.onChange(async (value) => {
							this.plugin.settings.newInputNoteFollowUpAction =
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
							this.plugin.settings
								.inputNoteDefaultExcalidrawTemplate
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
						.setValue(
							this.plugin.settings.inputFolderDefaultSubFolders
						)
						.onChange(async (value) => {
							this.plugin.settings.inputFolderDefaultSubFolders =
								value;
							await this.plugin.saveSettings();
						})
				);
		});

		tabbedSettings.addTab(t("IOTO_OUTPUT_SELECTOR_SETTINGS"), (content) => {
			content.createEl("h6", {
				text: t("IOTO_OUTPUT_SELECTOR_FOLDER_OPTION_SETTINGS"),
			});
			new Setting(content)
				.setName(t("OUTPUT_SELECTOR_EXCLUDES_PATHS"))
				.setDesc(t("OUTPUT_SELECTOR_EXCLUDES_PATHS_HINT"))
				.addTextArea((textArea) =>
					textArea
						.setPlaceholder("")
						.setValue(
							this.plugin.settings.outputSelectorExcludesPaths
						)
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
						.setValue(
							this.plugin.settings.outputSelectorShowBasePath
						)
						.onChange(async (show) => {
							this.plugin.settings.outputSelectorShowBasePath =
								show;
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
							this.plugin.settings
								.outputSelectorFolderOptionTemplate
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
						.setValue(
							this.plugin.settings.newOutputNoteFollowUpAction
						)
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
							this.plugin.settings
								.outputNoteDefaultExcalidrawTemplate
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
		});

		tabbedSettings.addTab(t("IOTO_TASK_SELECTOR_SETTINGS"), (content) => {
			content.createEl("h6", {
				text: t("IOTO_TASK_SELECTOR_FOLDER_OPTION_SETTINGS"),
			});
			new Setting(content)
				.setName(t("TASK_SELECTOR_EXCLUDES_PATHS"))
				.setDesc(t("TASK_SELECTOR_EXCLUDES_PATHS_HINT"))
				.addTextArea((textArea) =>
					textArea
						.setPlaceholder("")
						.setValue(
							this.plugin.settings.taskSelectorExcludesPaths
						)
						.onChange(async (value) => {
							this.plugin.settings.taskSelectorExcludesPaths =
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
							this.plugin.settings.taskSelectorShowOptionOrder
						)
						.onChange(async (show) => {
							this.plugin.settings.taskSelectorShowOptionOrder =
								show;
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
							this.plugin.settings.taskSelectorShowBasePath =
								show;
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
							this.plugin.settings
								.taskSelectorFolderOptionTemplate
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
							this.plugin.settings
								.taskSelectorEnableFutureDaysChoices
						)
						.onChange(async (on) => {
							this.plugin.settings.taskSelectorEnableFutureDaysChoices =
								on;
							await this.plugin.saveSettings();
						});
				});
		});

		tabbedSettings.addTab(
			t("IOTO_OUTCOME_SELECTOR_SETTINGS"),
			(content) => {
				content.createEl("h6", {
					text: t("IOTO_OUTCOME_SELECTOR_FOLDER_OPTION_SETTINGS"),
				});
				new Setting(content)
					.setName(t("OUTCOME_SELECTOR_EXCLUDES_PATHS"))
					.setDesc(t("OUTCOME_SELECTOR_EXCLUDES_PATHS_HINT"))
					.addTextArea((textArea) =>
						textArea
							.setPlaceholder("")
							.setValue(
								this.plugin.settings
									.outcomeSelectorExcludesPaths
							)
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
								this.plugin.settings
									.outcomeSelectorShowOptionOrder
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
							.setValue(
								this.plugin.settings.outcomeSelectorShowBasePath
							)
							.onChange(async (show) => {
								this.plugin.settings.outcomeSelectorShowBasePath =
									show;
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
								this.plugin.settings
									.outcomeSelectorFolderOptionTemplate
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
								this.plugin.settings
									.outcomeSelectorIncludeParentFolder
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
								this.plugin.settings
									.outcomeProjectDefaultSubFolders
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
							.setValue(
								this.plugin.settings
									.newOutcomeNoteFollowUpAction
							)
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
							.setValue(
								this.plugin.settings.outcomeNoteNamePrefix
							)
							.onChange(async (value) => {
								this.plugin.settings.outcomeNoteNamePrefix =
									value;
								await this.plugin.saveSettings();
							})
					);
				new Setting(content)
					.setName(t("NOTE_NAME_POSTFIX"))
					.setDesc(t("NOTE_NAME_POSTFIX_HINT"))
					.addText((text) =>
						text
							.setPlaceholder("")
							.setValue(
								this.plugin.settings.outcomeNoteNamePostfix
							)
							.onChange(async (value) => {
								this.plugin.settings.outcomeNoteNamePostfix =
									value;
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
		);

		tabbedSettings.addTab(t("IOTO_Other_Settings"), (content) => {
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
							this.plugin.settings.iotoUtilsSnRRulesFolder =
								value;
							await this.plugin.saveSettings();
						})
				);

			new Setting(content)
				.setName(t("IOTO_Utils_QuickImageSize"))
				.setDesc(t("IOTO_Utils_QuickImageSize_HINT"))
				.addTextArea((text) =>
					text
						.setPlaceholder("")
						.setValue(this.plugin.settings.iotoUtilsQuickImageSize)
						.onChange(async (value) => {
							this.plugin.settings.iotoUtilsQuickImageSize =
								value;
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
							this.plugin.settings.iotoUtilsQuickImageMask =
								value;
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
							this.plugin.settings.iotoUtilsQuickBlockTypes =
								value;
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
				.setDesc(
					t("IOTO_Utils_QuickBlockIdUseSingleLineAsSeparator_HINT")
				)
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
							this.plugin.settings
								.iotoUtilsPropertyManagementFolder
						)
						.onChange(async (value) => {
							this.plugin.settings.iotoUtilsPropertyManagementFolder =
								value;
							await this.plugin.saveSettings();
						})
				);

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
		});
	}
}

class TabbedSettings {
	private tabs: HTMLElement;
	private content: HTMLElement;

	constructor(private container: HTMLElement) {
		this.tabs = container.createDiv("settings-tabs");
		this.content = container.createDiv("settings-content");
	}

	addTab(name: string, callback: (content: HTMLElement) => void) {
		const tab = this.tabs.createDiv("settings-tab");
		tab.setText(name);
		tab.onclick = () => {
			// 移除所有active类
			this.tabs
				.querySelectorAll(".settings-tab")
				.forEach((t) => t.removeClass("active"));
			this.content.empty();

			// 添加active类到当前tab
			tab.addClass("active");

			// 填充内容
			callback(this.content);
		};

		// 默认激活第一个tab
		if (this.tabs.children.length === 1) {
			tab.click();
		}
	}
}
