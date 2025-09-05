# Video Slice 使用示例

这个目录包含了 video-slice 库的完整使用示例和演示页面。

## 📁 文件说明

### 演示页面
- **`index.html`** - 完整的交互式演示页面，包含所有功能展示
- **`simple-demo.html`** - 简化版演示页面，适合快速上手

### 代码示例
- **`simple-example.js`** - JavaScript 使用示例代码
- **`README.md`** - 本说明文件

## 🚀 快速开始

### 1. 在线演示

直接打开演示页面即可体验：

```bash
# 使用简单演示页面
open simple-demo.html

# 使用完整演示页面
open index.html
```

### 2. 本地开发服务器

为了避免跨域问题，建议使用本地服务器运行：

```bash
# 使用 Python (如果已安装)
python -m http.server 8000

# 使用 Node.js (如果已安装)
npx serve .

# 使用 Live Server (VS Code 插件)
# 右键点击 HTML 文件 -> "Open with Live Server"
```

然后访问：
- 简单演示：http://localhost:8000/simple-demo.html
- 完整演示：http://localhost:8000/index.html

## 📹 示例视频

### 获取测试视频

你可以使用以下方式获取测试视频：

#### 1. 在线视频资源
- **Big Buck Bunny** (开源测试视频)
  - 下载链接：https://sample-videos.com/
  - 格式：MP4, WebM
  - 时长：10秒 - 10分钟不等

#### 2. 自己录制
- 使用手机或摄像头录制短视频
- 建议时长：10-60秒
- 推荐格式：MP4
- 推荐分辨率：720p 或 1080p

#### 3. 浏览器录屏
```javascript
// 使用浏览器 API 录制屏幕
navigator.mediaDevices.getDisplayMedia({ video: true })
  .then(stream => {
    const recorder = new MediaRecorder(stream);
    // 录制逻辑...
  });
```

#### 4. 创建简单测试视频
```html
<!-- 使用 Canvas 创建动画视频 -->
<canvas id="canvas" width="640" height="360"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stream = canvas.captureStream(30); // 30 FPS

// 绘制动画...
const recorder = new MediaRecorder(stream);
// 录制并保存...
</script>
```

## 🛠️ 功能演示

### 基础功能

1. **文件上传**
   - 拖拽上传
   - 点击选择
   - 支持多种视频格式

2. **自动切片**
   - 设置切片间隔
   - 实时进度显示
   - 批量生成图片

3. **手动截图**
   - 指定时间点截图
   - 当前播放位置截图
   - 高质量图片输出

### 高级功能

1. **快速切片模式**
   - 更短的间隔时间
   - 快速处理大量帧

2. **参数配置**
   - 自定义输出尺寸
   - 静音播放控制
   - 灵活的时间间隔

3. **批量操作**
   - 导出所有图片
   - 清空图片缓存
   - 获取视频信息

## 💻 代码示例

### 基础使用

```javascript
import { videoSlice } from 'video-slice-reversed';

// 创建切片实例
const slicer = videoSlice({
    file: videoFile,           // 视频文件对象
    width: 640,               // 输出宽度
    height: 360,              // 输出高度
    intervalTime: 1000,       // 切片间隔 (毫秒)
    muted: true,              // 静音播放
    
    // 回调函数
    success: () => console.log('加载成功'),
    backImgFn: (base64) => console.log('新切片:', base64),
    finish: () => console.log('切片完成'),
    fail: (error) => console.error('失败:', error)
});

// 开始切片
slicer.start();
```

### 高级用法

```javascript
// 快速切片
slicer.fastStart(300); // 300ms 间隔

// 手动截图
slicer.setCurrentTime(10, true); // 截取第10秒

// 获取所有图片
const images = slicer.getImgs();
console.log('共生成', Object.keys(images).length, '张图片');

// 文件转 Base64
const base64 = await slicer.FileToBase64(videoFile);

// 清理资源
slicer.destroy();
```

### 完整工作流程

```javascript
async function processVideo(videoFile) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        const slicer = videoSlice({
            file: videoFile,
            width: 800,
            height: 450,
            intervalTime: 2000,
            
            success: () => {
                console.log('开始处理视频...');
                slicer.start();
            },
            
            backImgFn: (base64) => {
                results.push(base64);
                console.log(`已生成 ${results.length} 张图片`);
            },
            
            finish: () => {
                console.log('处理完成！');
                slicer.destroy();
                resolve(results);
            },
            
            fail: (error) => {
                slicer.destroy();
                reject(error);
            }
        });
    });
}

// 使用
try {
    const images = await processVideo(myVideoFile);
    console.log('成功生成', images.length, '张图片');
} catch (error) {
    console.error('处理失败:', error);
}
```

## 🎯 实际应用场景

### 1. 视频预览缩略图
```javascript
// 生成视频预览图
const generateThumbnails = (videoFile) => {
    return videoSlice({
        file: videoFile,
        width: 320,
        height: 180,
        intervalTime: 5000, // 每5秒一张
        backImgFn: (base64) => {
            // 显示缩略图
            displayThumbnail(base64);
        }
    });
};
```

### 2. 视频关键帧提取
```javascript
// 提取关键帧
const extractKeyFrames = (videoFile, timePoints) => {
    const slicer = videoSlice({
        file: videoFile,
        width: 1280,
        height: 720,
        success: () => {
            // 提取指定时间点的帧
            timePoints.forEach(time => {
                slicer.setCurrentTime(time, true);
            });
        }
    });
};
```

### 3. 视频质量检测
```javascript
// 检测视频质量
const checkVideoQuality = (videoFile) => {
    const frames = [];
    
    videoSlice({
        file: videoFile,
        intervalTime: 1000,
        backImgFn: (base64) => {
            frames.push(base64);
        },
        finish: () => {
            // 分析帧质量
            analyzeFrameQuality(frames);
        }
    }).fastStart(500);
};
```

## 🔧 故障排除

### 常见问题

1. **视频无法加载**
   - 检查文件格式是否支持
   - 确认文件没有损坏
   - 尝试转换为 MP4 格式

2. **切片速度慢**
   - 减小输出尺寸
   - 增加切片间隔
   - 使用快速切片模式

3. **内存占用过高**
   - 及时清理图片缓存
   - 控制同时处理的帧数
   - 使用 `destroy()` 释放资源

4. **跨域问题**
   - 使用本地服务器
   - 配置正确的 CORS 头
   - 避免直接打开 HTML 文件

### 性能优化

```javascript
// 优化大视频处理
const optimizedProcessing = (videoFile) => {
    const slicer = videoSlice({
        file: videoFile,
        width: 640,  // 适中的尺寸
        height: 360,
        intervalTime: 3000, // 较大的间隔
        
        backImgFn: (base64) => {
            // 立即处理，避免积累
            processImageImmediately(base64);
        }
    });
    
    // 使用快速模式但控制间隔
    slicer.fastStart(1000);
};
```

## 📚 更多资源

- [主项目 README](../README.md)
- [API 文档](../dist/index.d.ts)
- [源代码](../index.ts)
- [构建配置](../vite.config.ts)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License