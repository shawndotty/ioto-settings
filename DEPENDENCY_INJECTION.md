# 依赖注入模式使用指南

## 概述

本项目现在使用依赖注入（Dependency Injection）模式来管理所有服务。这种模式提供了更好的代码组织、测试性和可维护性。

## 架构组件

### 1. DependencyContainer（依赖注入容器）

`services/dependency-container.ts` 中的 `DependencyContainer` 类负责：

-   注册服务工厂函数
-   解析服务依赖关系
-   管理服务生命周期

### 2. ServiceManager（服务管理器）

`services/service-manager.ts` 中的 `ServiceManager` 类提供：

-   类型安全的服务访问
-   懒加载服务实例
-   简化的服务管理接口

### 3. 服务接口

所有服务都可以实现 `IService` 接口：

```typescript
export interface IService {
	initialize?(): Promise<void>;
	dispose?(): Promise<void>;
}
```

## 使用方法

### 在插件主类中使用

```typescript
export default class IOTO extends Plugin {
	settings: IOTOSettings;
	settingsManager: SettingsManager;
	serviceManager: ServiceManager;

	async onload() {
		// 初始化设置管理器
		this.settingsManager = new SettingsManager(
			() => this.loadData(),
			(data) => this.saveData(data)
		);
		this.settings = await this.settingsManager.load();

		// 初始化服务管理器（使用依赖注入）
		this.serviceManager = new ServiceManager(this.app, this, this.settings);
		await this.serviceManager.initialize();

		// 注册命令
		this.serviceManager.commandService.registerCommands();

		// 添加设置选项卡
		this.addSettingTab(new IOTOSettingTab(this.app, this));
	}

	async onunload() {
		// 清理服务
		if (this.serviceManager) {
			await this.serviceManager.dispose();
		}
	}
}
```

### 访问服务

```typescript
// 通过服务管理器访问服务
const folderService = this.serviceManager.folderService;
const templaterService = this.serviceManager.templaterService;
const hotkeyService = this.serviceManager.hotkeyService;
const commandService = this.serviceManager.commandService;

// 或者获取所有服务
const allServices = this.serviceManager.getAllServices();
```

### 在设置选项卡中使用

```typescript
// 在设置选项卡中调用服务方法
await this.plugin.serviceManager.folderService.changeIOTOBaseFolder(
	newFolder,
	oldFolder
);
```

## 服务依赖关系

当前的服务依赖关系如下：

```
CommandService
├── FolderService
├── TemplaterService
└── HotkeyService
    └── TemplaterService
```

## 添加新服务

要添加新服务，请按以下步骤操作：

1. 创建服务类：

```typescript
export class NewService implements IService {
	constructor(private app: App, private settings: IOTOSettings) {}

	async initialize(): Promise<void> {
		// 初始化逻辑
	}

	async dispose(): Promise<void> {
		// 清理逻辑
	}
}
```

2. 在 `dependency-container.ts` 中注册服务：

```typescript
export const SERVICE_TOKENS = {
	// ... 现有服务
	NEW_SERVICE: "NewService",
} as const;

// 在 createDependencyContainer 函数中注册
container.register(SERVICE_TOKENS.NEW_SERVICE, () => {
	return new NewService(app, settings);
});
```

3. 在 `service-manager.ts` 中添加访问器：

```typescript
export class ServiceManager {
	private _newService: NewService | null = null;

	get newService(): NewService {
		if (!this._newService) {
			this._newService = this.container.resolve<NewService>(
				SERVICE_TOKENS.NEW_SERVICE
			);
		}
		return this._newService;
	}
}
```

## 优势

1. **解耦**：服务之间通过接口进行交互，降低了耦合度
2. **可测试性**：可以轻松模拟服务进行单元测试
3. **可维护性**：服务职责清晰，易于维护和扩展
4. **生命周期管理**：统一的初始化和清理机制
5. **类型安全**：TypeScript 提供完整的类型检查

## 注意事项

1. 服务管理器使用懒加载，只有在首次访问时才会创建服务实例
2. 所有服务都应该实现 `IService` 接口以支持生命周期管理
3. 在插件卸载时会自动清理所有服务资源
4. 服务依赖关系在容器中明确定义，避免循环依赖
