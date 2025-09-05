# Video Slice - 逆向工程版本

这是对 npm 包 `video-slice@2.1.4` 的逆向工程重建版本。

## 项目描述

video-slice 是一款面向 web 视频切片的插件，可以将视频切片获取多张图片或者指定时间的切片。

## 示例文件

- [示例汇总文档](./EXAMPLES_SUMMARY.md) - 包含所有示例的详细说明
- [在线示例](https://eric-gitta-moore.github.io/video-slice/example/index.html) - 完整的在线演示
- [简单演示](https://eric-gitta-moore.github.io/video-slice/example/simple-demo.html) - 基础功能演示

## 逆向工程说明

本项目通过分析原始包的编译输出文件 `dist/index.mjs` 和类型定义文件 `dist/index.d.ts`，重建了清晰可读的 TypeScript 源代码。

### 原始包信息
- 包名: video-slice
- 版本: 2.1.4
- 原始 tarball: https://registry.npmjs.org/video-slice/-/video-slice-2.1.4.tgz

### 逆向工程过程
1. 下载并提取原始 npm tarball
2. 分析编译后的 JavaScript 代码 (`dist/index.mjs`)
3. 结合类型定义文件 (`dist/index.d.ts`) 理解接口
4. 重建清晰的 TypeScript 源代码
5. 创建完整的项目结构和配置

## 功能特性

- 🎥 视频切片功能
- 📸 获取视频指定时间的截图
- 🔄 自动切片和手动切片
- 📁 文件转 Base64 支持
- 🎛️ 可配置的切片间隔
- 🔇 静音播放支持

## API 接口

### videoSlice(options?: objMsgApi): MyObject

主要的视频切片函数。

#### 参数 (objMsgApi)
- `video?: HTMLVideoElement` - 视频元素
- `width?: number | string` - 视频宽度
- `height?: number | string` - 视频高度
- `file?: File` - 视频文件
- `intervalTime?: number` - 切片间隔时间（毫秒）
- `muted?: boolean` - 是否静音（默认 true）
- `success?: () => void` - 加载成功回调
- `fail?: (message: string) => void` - 失败回调
- `backImgFn?: (base64: string) => void` - 切片回调
- `finish?: () => void` - 完成回调

#### 返回值 (MyObject)
- `msg` - 当前状态信息
- `start()` - 开始切片
- `fastStart(interval?: number)` - 快速切片
- `destroy()` - 销毁实例
- `setIntervalTime(time: number)` - 设置间隔时间
- `setCurrentTime(time: number, isSetTime?: boolean)` - 设置当前时间
- `getSrc()` - 获取视频源
- `getImgs()` - 获取切片图片缓存
- `FileToBase64(file?: File)` - 文件转 Base64

## 使用示例

```typescript
import { videoSlice } from './index';

// 基本使用
const slicer = videoSlice({
  file: videoFile,
  width: 640,
  height: 360,
  intervalTime: 1000,
  backImgFn: (base64Image) => {
    console.log('获取到切片:', base64Image);
  },
  finish: () => {
    console.log('切片完成');
  }
});

// 开始自动切片
slicer.start();

// 或者快速切片
slicer.fastStart(500);

// 获取指定时间的截图
slicer.setCurrentTime(10, true); // 获取第10秒的截图
```

## 构建

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式
npm run dev
```

## 技术栈

- TypeScript
- Vite
- Canvas API
- HTML5 Video API

## 许可证

ISC

## 逆向工程声明

本项目仅用于学习和研究目的，通过逆向工程重建了原始包的功能。所有功能和接口都基于对原始编译代码的分析和理解。