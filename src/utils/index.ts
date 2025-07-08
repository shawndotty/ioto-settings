import {
	App,
	normalizePath,
	TAbstractFile,
	TFile,
	TFolder,
	Vault,
	moment,
} from "obsidian";

export function resolve_tfolder(app: App, folder_str: string): TFolder {
	folder_str = normalizePath(folder_str);

	const folder = app.vault.getAbstractFileByPath(folder_str);
	if (!folder) {
		throw new Error(`Folder "${folder_str}" doesn't exist`);
	}
	if (!(folder instanceof TFolder)) {
		throw new Error(`${folder_str} is a file, not a folder`);
	}

	return folder;
}

export function get_tfiles_from_folder(
	app: App,
	folder_str: string
): Array<TFile> {
	const folder = resolve_tfolder(app, folder_str);

	const files: Array<TFile> = [];
	Vault.recurseChildren(folder, (file: TAbstractFile) => {
		if (file instanceof TFile) {
			files.push(file);
		}
	});

	files.sort((a, b) => {
		return a.path.localeCompare(b.path);
	});

	return files;
}

export function getTimeStamp() {
	return moment().format("YYYYMMDDHHmmSS");
}
