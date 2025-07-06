import { App, Plugin } from "obsidian";
import { IOTOSettings } from "../types";
import { FolderService } from "./folder-service";
import { TemplaterService } from "./templater-service";
import { HotkeyService } from "./hotkey-service";
import { CommandService } from "./commands-service";
import {
	DependencyContainer,
	SERVICE_TOKENS,
	createDependencyContainer,
} from "./dependency-container";

// 服务类型映射
type ServiceMap = {
	[SERVICE_TOKENS.FOLDER_SERVICE]: FolderService;
	[SERVICE_TOKENS.TEMPLATER_SERVICE]: TemplaterService;
	[SERVICE_TOKENS.HOTKEY_SERVICE]: HotkeyService;
	[SERVICE_TOKENS.COMMAND_SERVICE]: CommandService;
};

// 服务访问器映射
type ServiceAccessors = {
	folderService: FolderService;
	templaterService: TemplaterService;
	hotkeyService: HotkeyService;
	commandService: CommandService;
};

// 服务配置
const SERVICE_CONFIG = {
	folderService: SERVICE_TOKENS.FOLDER_SERVICE,
	templaterService: SERVICE_TOKENS.TEMPLATER_SERVICE,
	hotkeyService: SERVICE_TOKENS.HOTKEY_SERVICE,
	commandService: SERVICE_TOKENS.COMMAND_SERVICE,
} as const;

// 服务管理器类
export class ServiceManager {
	private container: DependencyContainer;
	private serviceCache = new Map<string, any>();

	// 动态属性声明
	declare folderService: FolderService;
	declare templaterService: TemplaterService;
	declare hotkeyService: HotkeyService;
	declare commandService: CommandService;

	constructor(app: App, plugin: Plugin, settings: IOTOSettings) {
		this.container = createDependencyContainer(app, plugin, settings);
		this.createServiceAccessors();
	}

	// 通用的服务获取方法
	private getService<T extends keyof ServiceMap>(token: T): ServiceMap[T] {
		if (!this.serviceCache.has(token)) {
			this.serviceCache.set(
				token,
				this.container.resolve<ServiceMap[T]>(token)
			);
		}
		return this.serviceCache.get(token);
	}

	// 动态创建服务访问器
	private createServiceAccessors(): void {
		Object.entries(SERVICE_CONFIG).forEach(([name, token]) => {
			Object.defineProperty(this, name, {
				get: () => this.getService(token as keyof ServiceMap),
				enumerable: true,
				configurable: true,
			});
		});
	}

	// 获取所有服务
	getAllServices(): ServiceAccessors {
		return {
			folderService: this.folderService,
			templaterService: this.templaterService,
			hotkeyService: this.hotkeyService,
			commandService: this.commandService,
		};
	}

	// 初始化所有服务
	async initialize(): Promise<void> {
		await this.container.initializeServices();
	}

	// 销毁所有服务
	async dispose(): Promise<void> {
		await this.container.disposeServices();
		this.serviceCache.clear();
	}

	// 获取已注册的服务列表
	getRegisteredServices(): string[] {
		return this.container.getRegisteredServices();
	}
}

// 创建服务管理器的工厂函数
export function createServiceManager(
	app: App,
	plugin: Plugin,
	settings: IOTOSettings
): ServiceManager {
	return new ServiceManager(app, plugin, settings);
}
