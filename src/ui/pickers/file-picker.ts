// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { TAbstractFile, TFile } from "obsidian";
import { TextInputSuggest } from "./suggest";
import { get_tfiles_from_folder } from "src/utils";
import OBASAssistant from "src/main";
import { errorWrapperSync } from "src/utils/error";

export enum FileSuggestMode {
	InputFiles,
	OutputFiles,
}

export class FileSuggest extends TextInputSuggest<TFile> {
	constructor(
		public inputEl: HTMLInputElement,
		private plugin: OBASAssistant,
		private mode: FileSuggestMode
	) {
		super(plugin.app, inputEl);
	}

	get_folder(mode: FileSuggestMode): string {
		switch (mode) {
			case FileSuggestMode.InputFiles:
				return this.plugin.settings.inputFolder;
			case FileSuggestMode.OutputFiles:
				return this.plugin.settings.outputFolder;
		}
	}

	get_error_msg(mode: FileSuggestMode): string {
		switch (mode) {
			case FileSuggestMode.InputFiles:
				return `Input Folder doesn't exist`;
			case FileSuggestMode.OutputFiles:
				return `Output folder doesn't exist`;
		}
	}

	getSuggestions(input_str: string): TFile[] {
		const all_files = errorWrapperSync(
			() =>
				get_tfiles_from_folder(
					this.plugin.app,
					this.get_folder(this.mode)
				),
			this.get_error_msg(this.mode)
		);
		if (!all_files) {
			return [];
		}

		const files: TFile[] = [];
		const lower_input_str = input_str.toLowerCase();

		all_files.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile &&
				file.extension === "md" &&
				file.path.toLowerCase().contains(lower_input_str)
			) {
				files.push(file);
			}
		});

		return files.slice(0, 1000);
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.inputEl.value = file.path;
		this.inputEl.trigger("input");
		this.close();
	}
}
