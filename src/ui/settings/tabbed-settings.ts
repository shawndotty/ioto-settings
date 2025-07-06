export class TabbedSettings {
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
