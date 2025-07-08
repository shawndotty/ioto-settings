import { Notice } from "obsidian";
import { IOTOError } from "./error";

export function log_update(msg: string): void {
	const notice = new Notice("", 15000);
	// TODO: Find better way for this
	// @ts-ignore
	notice.messageEl.innerHTML = `<b>Templater update</b>:<br/>${msg}`;
}

export function log_error(e: Error | IOTOError): void {
	const notice = new Notice("", 8000);
	if (e instanceof IOTOError && e.console_msg) {
		// TODO: Find a better way for this
		// @ts-ignore
		notice.messageEl.innerHTML = `<b>IOTO Error</b>:<br/>${e.message}<br/>Check console for more information`;
		console.error(`IOTO Error:`, e.message, "\n", e.console_msg);
	} else {
		// @ts-ignore
		notice.messageEl.innerHTML = `<b>IOTO Error</b>:<br/>${e.message}`;
	}
}
