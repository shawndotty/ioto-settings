import { App, Plugin } from "obsidian";
import { IOTOSettings } from "../types";
import { FolderService } from "./folder-service";
import { TemplaterService } from "./templater-service";
import { HotkeyService } from "./hotkey-service";
import { CommandService } from "./commands-service";

// 服务接口定义
export interface IService {
	initialize?(): Promise<void>;
	dispose?(): Promise<void>;
}

// 服务配置接口
interface ServiceConfig {
	token: string;
	factory: (container: DependencyContainer) => any;
}

// 依赖注入容器
export class DependencyContainer {
	private services = new Map<string, any>();
	private _app: App;
	private _plugin: Plugin;
	private _settings: IOTOSettings;

	constructor(app: App, plugin: Plugin, settings: IOTOSettings) {
		this._app = app;
		this._plugin = plugin;
		this._settings = settings;
	}

	// 公共访问器
	get app(): App {
		return this._app;
	}

	get plugin(): Plugin {
		return this._plugin;
	}

	get settings(): IOTOSettings {
		return this._settings;
	}

	// 注册服务
	register<T>(token: string, factory: () => T): void {
		this.services.set(token, factory);
	}

	// 解析服务
	resolve<T>(token: string): T {
		const factory = this.services.get(token);
		if (!factory) {
			throw new Error(`服务未注册: ${token}`);
		}
		return factory();
	}

	// 获取所有已注册的服务
	getRegisteredServices(): string[] {
		return Array.from(this.services.keys());
	}

	// 初始化所有服务
	async initializeServices(): Promise<void> {
		for (const [token, factory] of this.services.entries()) {
			const service = factory();
			if (service && typeof service.initialize === "function") {
				try {
					await service.initialize();
				} catch (error) {
					console.error(`初始化服务失败 ${token}:`, error);
				}
			}
		}
	}

	// 销毁所有服务
	async disposeServices(): Promise<void> {
		for (const [token, factory] of this.services.entries()) {
			const service = factory();
			if (service && typeof service.dispose === "function") {
				try {
					await service.dispose();
				} catch (error) {
					console.error(`销毁服务失败 ${token}:`, error);
				}
			}
		}
		this.services.clear();
	}
}

// 服务令牌常量
export const SERVICE_TOKENS = {
	FOLDER_SERVICE: "FolderService",
	TEMPLATER_SERVICE: "TemplaterService",
	HOTKEY_SERVICE: "HotkeyService",
	COMMAND_SERVICE: "CommandService",
} as const;

// 服务配置
const SERVICE_CONFIGS: ServiceConfig[] = [
	{
		token: SERVICE_TOKENS.FOLDER_SERVICE,
		factory: (container) =>
			new FolderService(container.app, container.settings),
	},
	{
		token: SERVICE_TOKENS.TEMPLATER_SERVICE,
		factory: (container) =>
			new TemplaterService(container.app, container.settings),
	},
	{
		token: SERVICE_TOKENS.HOTKEY_SERVICE,
		factory: (container) => {
			const templaterService = container.resolve<TemplaterService>(
				SERVICE_TOKENS.TEMPLATER_SERVICE
			);
			return new HotkeyService(container.app, templaterService);
		},
	},
	{
		token: SERVICE_TOKENS.COMMAND_SERVICE,
		factory: (container) => {
			const folderService = container.resolve<FolderService>(
				SERVICE_TOKENS.FOLDER_SERVICE
			);
			const templaterService = container.resolve<TemplaterService>(
				SERVICE_TOKENS.TEMPLATER_SERVICE
			);
			const hotkeyService = container.resolve<HotkeyService>(
				SERVICE_TOKENS.HOTKEY_SERVICE
			);

			return new CommandService(
				container.app,
				container.plugin,
				container.settings,
				folderService,
				templaterService,
				hotkeyService
			);
		},
	},
];

// 创建并配置依赖注入容器
export function createDependencyContainer(
	app: App,
	plugin: Plugin,
	settings: IOTOSettings
): DependencyContainer {
	const container = new DependencyContainer(app, plugin, settings);

	// 批量注册服务
	SERVICE_CONFIGS.forEach((config) => {
		container.register(config.token, () => config.factory(container));
	});

	return container;
}
