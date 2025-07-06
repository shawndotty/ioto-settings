import { t } from "../lang/helpers";
import { InputModal } from "../ui/modals/input-modal";
import { App, normalizePath, TFile } from "obsidian";
import { IOTOSettings } from "../types";

export class FolderService {
	constructor(private app: App, private settings: IOTOSettings) {}

	async createPathIfNeeded(folderPath: string): Promise<void> {
		const { vault } = this.app;
		try {
			const directoryExists = await vault.adapter.exists(folderPath);
			if (!directoryExists) {
				await vault.createFolder(normalizePath(folderPath));
			}
		} catch (error) {
			console.error(`创建文件夹失败: ${folderPath}`, error);
			throw new Error(`无法创建文件夹: ${folderPath}`);
		}
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

	async addIOTOProject(projectName: string | null = ""): Promise<void> {
		const { taskFolder, outcomeFolder, outcomeProjectDefaultSubFolders } =
			this.settings;

		if (!projectName) {
			const modal = new InputModal(
				this.app,
				t("Please input project name"),
				""
			);
			projectName = await modal.openAndGetValue();
		}

		if (!projectName?.trim()) return;

		const sanitizedProjectName = projectName.trim();
		await this.createPathIfNeeded(`${taskFolder}/${sanitizedProjectName}`);
		await this.createPathIfNeeded(
			`${outcomeFolder}/${sanitizedProjectName}`
		);

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

	async createSubFolders(
		baseFolder: string,
		subFoldersString: string
	): Promise<void> {
		if (!subFoldersString?.trim()) return;

		const subFolders = subFoldersString.trim().split("\n");
		for (const folder of subFolders) {
			const trimmedFolder = folder.trim();
			if (trimmedFolder) {
				await this.createPathIfNeeded(`${baseFolder}/${trimmedFolder}`);
			}
		}
	}

	async addIOTODefaultInputSubFolders() {
		const { inputFolder, inputFolderDefaultSubFolders } = this.settings;
		await this.createSubFolders(inputFolder, inputFolderDefaultSubFolders);
	}

	async addIOTODefaultOutputSubFolders() {
		const { outputFolder, outputFolderDefaultSubFolders } = this.settings;
		await this.createSubFolders(
			outputFolder,
			outputFolderDefaultSubFolders
		);
	}

	async addIOTODefaultProjects() {
		const { defaultProjects } = this.settings;
		const projects = defaultProjects.trim().split("\n");
		for (const project of projects) {
			await this.addIOTOProject(project.trim());
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

	async changeIOTOBaseFolder(
		newFolder: string,
		oldFolder: string
	): Promise<void> {
		if ("" === newFolder || newFolder === oldFolder) return;

		const { templaterDataPath, hotkeysFile, workspacesFile } =
			this.settings;
		const configDir = this.app.vault.configDir;
		const files = [
			normalizePath(`${configDir}/${templaterDataPath}`),
			normalizePath(`${configDir}/${hotkeysFile}`),
			normalizePath(`${configDir}/${workspacesFile}`),
		];

		const fileOperations = files.map(async (filePath) => {
			if (await this.app.vault.adapter.exists(filePath)) {
				let content = await this.app.vault.adapter.read(filePath);
				content = content
					.replace(`:${oldFolder}/`, `:${newFolder}/`)
					.replace(`"${oldFolder}/`, `"${newFolder}/`);
				await this.app.vault.adapter.write(filePath, content);
			}
		});

		await Promise.all(fileOperations);
	}
}
