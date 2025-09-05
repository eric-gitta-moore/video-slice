/**
 * Video Slice 简单使用示例
 * 
 * 这个文件展示了如何在实际项目中使用 video-slice 库
 */

// 导入 video-slice 库
// 在实际项目中使用：import { videoSlice } from 'video-slice-reversed';
// 在本演示中使用相对路径：
import { videoSlice } from '../dist/index.mjs';

/**
 * 示例1: 基础视频切片
 */
async function basicVideoSlicing() {
    // 获取文件输入元素
    const fileInput = document.getElementById('videoFile');
    const videoFile = fileInput.files[0];
    
    if (!videoFile) {
        console.error('请先选择视频文件');
        return;
    }

    // 创建 video-slice 实例
    const slicer = videoSlice({
        file: videoFile,
        width: 640,
        height: 360,
        intervalTime: 1000, // 每秒切片一次
        muted: true,
        
        // 成功回调
        success: () => {
            console.log('视频加载成功，准备开始切片');
        },
        
        // 每次切片回调
        backImgFn: (base64Image) => {
            console.log('获取到新的切片图片');
            displayImage(base64Image);
        },
        
        // 完成回调
        finish: () => {
            console.log('所有切片完成！');
            alert('视频切片完成！');
        },
        
        // 错误回调
        fail: (errorMessage) => {
            console.error('切片失败:', errorMessage);
            alert('切片失败: ' + errorMessage);
        }
    });

    // 开始自动切片
    slicer.start();
    
    return slicer;
}

/**
 * 示例2: 快速切片模式
 */
async function fastVideoSlicing() {
    const fileInput = document.getElementById('videoFile');
    const videoFile = fileInput.files[0];
    
    if (!videoFile) {
        console.error('请先选择视频文件');
        return;
    }

    const slicer = videoSlice({
        file: videoFile,
        width: 800,
        height: 450,
        muted: true,
        
        success: () => {
            console.log('视频加载成功，开始快速切片');
        },
        
        backImgFn: (base64Image) => {
            displayImage(base64Image);
        },
        
        finish: () => {
            console.log('快速切片完成！');
        }
    });

    // 快速切片，每300毫秒切一次
    slicer.fastStart(300);
    
    return slicer;
}

/**
 * 示例3: 手动截取指定时间点
 */
async function captureSpecificTime() {
    const fileInput = document.getElementById('videoFile');
    const videoFile = fileInput.files[0];
    
    if (!videoFile) {
        console.error('请先选择视频文件');
        return;
    }

    const slicer = videoSlice({
        file: videoFile,
        width: 640,
        height: 360,
        
        success: () => {
            console.log('视频加载成功');
            
            // 截取第5秒的画面
            slicer.setCurrentTime(5, true);
            
            // 截取第10秒的画面
            setTimeout(() => {
                slicer.setCurrentTime(10, true);
            }, 1000);
            
            // 截取第15秒的画面
            setTimeout(() => {
                slicer.setCurrentTime(15, true);
            }, 2000);
        },
        
        backImgFn: (base64Image) => {
            console.log('截取到指定时间点的图片');
            displayImage(base64Image);
        }
    });
    
    return slicer;
}

/**
 * 示例4: 获取所有切片图片
 */
function getAllSlicedImages(slicer) {
    if (!slicer) {
        console.error('请先创建 slicer 实例');
        return;
    }
    
    // 获取所有切片图片
    const allImages = slicer.getImgs();
    
    console.log('所有切片图片:', allImages);
    
    // 遍历所有图片
    Object.keys(allImages).forEach(time => {
        console.log(`时间 ${time}s 的图片:`, allImages[time]);
    });
    
    return allImages;
}

/**
 * 示例5: 文件转Base64
 */
async function fileToBase64Example() {
    const fileInput = document.getElementById('videoFile');
    const videoFile = fileInput.files[0];
    
    if (!videoFile) {
        console.error('请先选择视频文件');
        return;
    }

    // 创建一个临时的 slicer 实例来使用 FileToBase64 方法
    const tempSlicer = videoSlice({});
    
    try {
        const base64Result = await tempSlicer.FileToBase64(videoFile);
        console.log('文件转换为Base64成功');
        console.log('Base64 数据长度:', base64Result.length);
        
        // 可以将这个 base64 用作视频源
        const videoElement = document.createElement('video');
        videoElement.src = base64Result;
        videoElement.controls = true;
        videoElement.style.maxWidth = '100%';
        
        document.body.appendChild(videoElement);
        
        return base64Result;
    } catch (error) {
        console.error('文件转Base64失败:', error);
    }
}

/**
 * 示例6: 完整的工作流程
 */
async function completeWorkflow() {
    const fileInput = document.getElementById('videoFile');
    const videoFile = fileInput.files[0];
    
    if (!videoFile) {
        console.error('请先选择视频文件');
        return;
    }

    console.log('开始完整的视频处理工作流程...');
    
    // 步骤1: 创建 slicer 实例
    const slicer = videoSlice({
        file: videoFile,
        width: 640,
        height: 360,
        intervalTime: 2000, // 每2秒切片一次
        muted: true,
        
        success: () => {
            console.log('✅ 步骤1: 视频加载成功');
            
            // 步骤2: 获取视频信息
            console.log('📹 视频源:', slicer.getSrc());
            console.log('📊 视频信息:', slicer.msg);
        },
        
        backImgFn: (base64Image) => {
            console.log('📸 步骤3: 获取到新切片');
            displayImage(base64Image);
        },
        
        finish: () => {
            console.log('✅ 步骤4: 自动切片完成');
            
            // 步骤5: 获取所有图片
            const allImages = slicer.getImgs();
            console.log('📁 步骤5: 获取到', Object.keys(allImages).length, '张图片');
            
            // 步骤6: 手动截取一些特定时间点
            console.log('🎯 步骤6: 手动截取特定时间点');
            slicer.setCurrentTime(1, true); // 截取第1秒
            
            setTimeout(() => {
                slicer.setCurrentTime(slicer.msg.duration / 2, true); // 截取中间时间点
            }, 1000);
            
            setTimeout(() => {
                slicer.setCurrentTime(slicer.msg.duration - 1, true); // 截取倒数第1秒
            }, 2000);
            
            // 步骤7: 3秒后清理资源
            setTimeout(() => {
                console.log('🧹 步骤7: 清理资源');
                slicer.destroy();
                console.log('✅ 工作流程完成！');
            }, 5000);
        },
        
        fail: (error) => {
            console.error('❌ 工作流程失败:', error);
        }
    });

    // 开始处理
    slicer.start();
    
    return slicer;
}

/**
 * 辅助函数: 显示图片
 */
function displayImage(base64Image) {
    const img = document.createElement('img');
    img.src = base64Image;
    img.style.maxWidth = '200px';
    img.style.margin = '10px';
    img.style.border = '2px solid #ddd';
    img.style.borderRadius = '8px';
    
    const container = document.getElementById('imagesContainer') || document.body;
    container.appendChild(img);
}

/**
 * 辅助函数: 创建控制按钮
 */
function createControlButtons() {
    const container = document.createElement('div');
    container.style.margin = '20px 0';
    
    const buttons = [
        { text: '基础切片', onclick: basicVideoSlicing },
        { text: '快速切片', onclick: fastVideoSlicing },
        { text: '指定时间截图', onclick: captureSpecificTime },
        { text: '文件转Base64', onclick: fileToBase64Example },
        { text: '完整工作流程', onclick: completeWorkflow }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.onclick = btn.onclick;
        button.style.margin = '5px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        container.appendChild(button);
    });
    
    return container;
}

// 导出函数供外部使用
export {
    basicVideoSlicing,
    fastVideoSlicing,
    captureSpecificTime,
    getAllSlicedImages,
    fileToBase64Example,
    completeWorkflow,
    displayImage,
    createControlButtons
};

// 如果在浏览器环境中直接运行
if (typeof window !== 'undefined') {
    // 将函数添加到全局作用域
    window.videoSliceExamples = {
        basicVideoSlicing,
        fastVideoSlicing,
        captureSpecificTime,
        getAllSlicedImages,
        fileToBase64Example,
        completeWorkflow,
        displayImage,
        createControlButtons
    };
    
    console.log('Video Slice 示例已加载！使用 window.videoSliceExamples 访问所有示例函数。');
}