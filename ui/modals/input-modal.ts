import { App, Modal } from "obsidian";
import { t } from "../../lang/helpers";

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
