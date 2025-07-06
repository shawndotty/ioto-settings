# 依赖注入模式重构总结

## 重构概述

本次重构将 IOTO 插件从直接实例化服务的方式改为使用依赖注入（Dependency Injection）模式来管理所有服务。这种改变提供了更好的代码组织、测试性和可维护性。

## 重构内容

### 1. 新增文件

#### `services/dependency-container.ts`

-   **DependencyContainer 类**：核心依赖注入容器
    -   管理服务注册和解析
    -   处理服务依赖关系
    -   提供生命周期管理
-   **SERVICE_TOKENS 常量**：服务标识符
-   **SERVICE_CONFIGS 数组**：服务配置，简化注册过程
-   **createDependencyContainer 函数**：创建并配置容器

#### `services/service-manager.ts`

-   **ServiceManager 类**：服务管理器
    -   提供类型安全的服务访问
    -   实现懒加载模式
    -   使用动态属性生成，消除重复代码
-   **createServiceManager 函数**：创建服务管理器

#### `DEPENDENCY_INJECTION.md`

-   详细的使用指南和最佳实践
-   架构说明和示例代码
-   添加新服务的步骤说明

### 2. 修改文件

#### `main.ts`

-   移除了直接的服务实例化
-   引入 ServiceManager 来管理所有服务
-   更新了 onload 和 onunload 方法
-   简化了插件主类的结构

#### `ui/settings/settings-tab.ts`

-   更新了所有服务引用
-   从 `this.plugin.folderService` 改为 `this.plugin.serviceManager.folderService`
-   保持了所有功能的完整性

### 3. 代码简化亮点

#### 消除重复模式

-   **服务注册**：使用 `SERVICE_CONFIGS` 数组统一管理服务配置
-   **服务访问器**：使用动态属性生成，避免重复的 getter 方法
-   **类型安全**：通过 TypeScript 泛型和类型映射确保类型安全

#### 配置驱动

```typescript
// 服务配置数组 - 易于维护和扩展
const SERVICE_CONFIGS: ServiceConfig[] = [
	{
		token: SERVICE_TOKENS.FOLDER_SERVICE,
		factory: (container) =>
			new FolderService(container.app, container.settings),
	},
	// ... 其他服务配置
];
```

#### 动态属性生成

```typescript
// 自动生成服务访问器，无需重复代码
private createServiceAccessors(): void {
    Object.entries(SERVICE_CONFIG).forEach(([name, token]) => {
        Object.defineProperty(this, name, {
            get: () => this.getService(token as keyof ServiceMap),
            enumerable: true,
            configurable: true,
        });
    });
}
```

### 4. 服务依赖关系

重构后的服务依赖关系：

```
CommandService
├── FolderService
├── TemplaterService
└── HotkeyService
    └── TemplaterService
```

## 重构优势

### 1. 解耦

-   服务之间通过接口进行交互
-   降低了组件间的耦合度
-   提高了代码的模块化程度

### 2. 可测试性

-   可以轻松模拟服务进行单元测试
-   支持依赖注入的测试框架
-   提高了代码的测试覆盖率

### 3. 可维护性

-   服务职责清晰明确
-   易于添加新服务
-   统一的生命周期管理
-   **代码重复度大幅降低**

### 4. 类型安全

-   TypeScript 提供完整的类型检查
-   编译时错误检测
-   更好的 IDE 支持

### 5. 性能优化

-   懒加载服务实例
-   按需创建服务
-   减少不必要的资源消耗

### 6. 代码简洁性

-   **消除了重复的服务访问器代码**
-   **配置驱动的服务注册**
-   **动态属性生成**
-   **更少的维护成本**

## 使用方式

### 在插件主类中

```typescript
export default class IOTO extends Plugin {
	serviceManager: ServiceManager;

	async onload() {
		// 初始化服务管理器
		this.serviceManager = new ServiceManager(this.app, this, this.settings);
		await this.serviceManager.initialize();

		// 使用服务
		this.serviceManager.commandService.registerCommands();
	}

	async onunload() {
		// 清理服务
		await this.serviceManager.dispose();
	}
}
```

### 访问服务

```typescript
// 通过服务管理器访问
const folderService = this.serviceManager.folderService;
const templaterService = this.serviceManager.templaterService;
const hotkeyService = this.serviceManager.hotkeyService;
const commandService = this.serviceManager.commandService;
```

## 向后兼容性

-   所有现有的功能保持不变
-   服务接口保持一致
-   设置选项卡功能完全保留
-   命令注册和执行逻辑不变

## 未来扩展

### 添加新服务

1. 创建服务类并实现 IService 接口
2. 在 `SERVICE_CONFIGS` 数组中添加配置
3. 在 `SERVICE_CONFIG` 对象中添加访问器配置
4. 更新类型映射（如果需要）

### 服务配置

-   支持服务级别的配置管理
-   支持动态服务注册
-   支持服务生命周期钩子

## 代码质量改进

### 减少重复代码

-   **服务访问器**：从 4 个重复的 getter 方法减少到 1 个动态生成方法
-   **服务注册**：从 4 个重复的 register 调用减少到 1 个配置数组
-   **类型声明**：使用泛型和类型映射，提高类型安全性

### 提高可维护性

-   **配置驱动**：所有服务配置集中管理
-   **单一职责**：每个类和方法职责明确
-   **易于扩展**：添加新服务只需修改配置

## 总结

本次重构成功地将 IOTO 插件迁移到依赖注入模式，提供了更好的代码架构和开发体验。重构过程中保持了所有现有功能的完整性，同时为未来的扩展和维护奠定了良好的基础。

**重构后的代码更加模块化、可测试、可维护，并且大幅减少了重复代码，符合现代软件开发的最佳实践。**
