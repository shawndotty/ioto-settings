import { t } from "../lang/helpers";
import { InputModal } from "../ui/modals/input-modal";
import { App, normalizePath, TFile } from "obsidian";
import { IOTOSettings } from "../types";

export class FolderService {
	constructor(private app: App, private settings: IOTOSettings) {}

	async createPathIfNeeded(folderPath: string): Promise<void> {
		const { vault } = this.app;
		const directoryExists = await vault.adapter.exists(folderPath);
		if (!directoryExists) {
			await vault.createFolder(normalizePath(folderPath));
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
}
