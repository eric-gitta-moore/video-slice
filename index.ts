// 消息接口定义
interface MsgApi {
    /**
     * 画布宽度
     */
    width: number;
    /**
     * 画布高度
     */
    height: number;
    /**
     * 记录当前在切第几秒的图片
     */
    draw_time: number | string;
    /**
     * 视频的总时长
     */
    duration: number;
    [key: string]: any;
}

// 返回对象接口定义
export interface MyObject {
    /**
     * 当前的一些相关信息，如时长，宽高、上一次切片时间等
     */
    msg: MsgApi;
    start: () => void;
    /**
     * 快速切片
     * @param number 切片的间隔时间（毫秒）
     * @returns
     */
    fastStart: (number?: number) => void;
    /**
     * 销毁监听等
     * @returns
     */
    destroy: () => void;
    /**
     * 设置的间隔时间（毫秒）
     * @param t 间隔时间（毫秒）
     * @returns
     */
    setIntervalTime: (t: number) => void;
    /**
     * 切片第几秒的
     * @param t 切片的时间
     * @param isSetTime 是否为切指定时间的图片
     * @returns
     */
    setCurrentTime: (t: number, isSetTime?: Boolean) => void;
    /**
     * 返回视频地址
     * @param src
     * @returns
     */
    getSrc: () => string;
    /**
     * 获取切过的时间对应的图片对象
     * @returns {时间:base64图片}
     */
    getImgs: () => Record<string, string>;
    /**
     * 传入文件返回base64
     * @param file 视频文件
     * @returns
     */
    FileToBase64: (file?: any) => Promise<any>;
}

// 配置参数接口定义
export interface objMsgApi {
    /**
     * video：video节点;
     */
    video?: HTMLVideoElement;
    /**
     * video的宽度；
     */
    width?: number | string;
    /**
     * video的高度；
     */
    height?: number | string;
    /**
     * 当前播放的视频文件;
     */
    file?: File;
    /**
     * 当前视频切图的间隔毫秒，最小生效时间（毫秒）; 默认 1000
     */
    intervalTime?: number;
    /**
     * 是否静音，默认静音 true
     */
    muted?: Boolean;
    /**
     * 当视频加载完成触发
     * @returns
     */
    success?: () => void;
    /**
     * 报错时触发函数回调;
     * @param value 错误信息
     * @returns
     */
    fail?: (value: string) => void;
    /**
     * 每次切片都会触发的返回base64的图片
     * @param value 当时切的base64图片
     * @returns
     */
    backImgFn?: (value: string) => void;
    /**
     * finish：完成自动切片后触发
     * @returns
     */
    finish?: () => void;
}

/**
 * 视频切片主函数
 * @param options 配置选项
 * @returns MyObject 返回操作对象
 */
function videoSlice(options: objMsgApi = {}): MyObject {
    let video: HTMLVideoElement;
    let isSlicing = false;
    let timeUpdateHandler: () => void;
    let loadedMetadataHandler: () => void;

    // 默认静音设置
    const muted = options.hasOwnProperty('muted') ? !!options.muted : true;
    
    // 间隔时间（秒）
    let intervalSeconds = 1;

    // 创建画布用于截图
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 存储切片图片的对象
    const imageCache: Record<string, string> = {};

    // 消息对象
    const msg: MsgApi = {
        width: 0,
        height: 0,
        draw_time: '',
        duration: 0
    };

    // 返回的API对象
    const api: MyObject = {
        msg,
        
        start: function() {
            video.currentTime = 0;
            isSlicing = true;
            if (isPaused()) {
                play();
            }
        },

        fastStart: (interval?: number) => {
            isSlicing = true;
            if (!interval) interval = 200;
            if (interval < 30) interval = 30;

            let currentTime = 0;
            let intervalId: NodeJS.Timeout;

            const updateTime = () => {
                if (currentTime >= api.msg.duration) {
                    clearInterval(intervalId);
                    currentTime = api.msg.duration;
                }
                video.currentTime = currentTime;
            };

            updateTime();
            intervalId = setInterval(() => {
                currentTime += intervalSeconds;
                updateTime();
            }, interval);
        },

        destroy: function() {
            video.removeEventListener('timeupdate', timeUpdateHandler);
            if (loadedMetadataHandler) {
                video.removeEventListener('loadedmetadata', loadedMetadataHandler);
            }
            document.body.removeChild(video);
        },

        setIntervalTime: (time: number) => {
            if (time < 200) time = 200;
            intervalSeconds = time / 1000;
        },

        getSrc: () => video.src,

        getImgs: () => imageCache,

        setCurrentTime: function(time: number, isSetTime?: Boolean) {
            if (time > api.msg.duration) {
                time = api.msg.duration;
            }

            if (isSetTime) {
                isSlicing = false;
            }

            if (isSetTime && time !== video.currentTime) {
                api.msg.draw_time = '';
                video.currentTime = time;
                return;
            } else {
                api.msg.draw_time = time;
            }

            let imageData = '';
            if (imageCache[time]) {
                imageData = imageCache[time];
            } else {
                imageData = captureFrame();
            }
            
            imageCache[time] = imageData;

            if (options.backImgFn && isFunction(options.backImgFn)) {
                options.backImgFn(imageData);
            }

            if (time === api.msg.duration) {
                onFinish();
            }
        },

        FileToBase64: function(file?: File): Promise<any> {
            return new Promise((resolve, reject) => {
                if (!file) {
                    reject({ message: '暂无文件', code: 2 });
                    return;
                }

                try {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        resolve(event.target?.result);
                    };
                    reader.readAsDataURL(file);
                } catch (error: any) {
                    reject({ message: error.message, code: 1 });
                }
            });
        }
    };

    // 创建隐藏的video元素
    const createHiddenVideo = (): HTMLVideoElement => {
        const videoElement = document.createElement('video');
        
        if (typeof options.width === 'number') {
            videoElement.style.width = (options.width || 0) + 'px';
        } else {
            videoElement.style.width = options.width + '';
        }

        if (typeof options.height === 'number') {
            videoElement.style.height = (options.height || 0) + 'px';
        } else {
            videoElement.style.height = options.height + '';
        }

        videoElement.style.opacity = '0';
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0px';
        videoElement.style.left = '0px';
        videoElement.style.transform = 'translateX(-100%)';
        videoElement.style.zIndex = '-1';

        document.body.appendChild(videoElement);
        return videoElement;
    };

    // 工具函数：检查类型
    const isFunction = (obj: any): obj is Function => {
        return obj && Object.prototype.toString.call(obj) === '[object Function]';
    };

    // 检查是否暂停
    const isPaused = (): boolean => video.paused;

    // 播放视频
    const play = (): void => {
        video.play();
    };

    // 成功回调
    const onSuccess = (): void => {
        if (options.success && isFunction(options.success)) {
            options.success();
        }
    };

    // 失败回调
    const onFail = (message: string): void => {
        if (options.fail && isFunction(options.fail)) {
            options.fail(message);
        }
    };

    // 完成回调
    const onFinish = (): void => {
        if (!isSlicing) return;
        isSlicing = false;
        if (options.finish && isFunction(options.finish)) {
            options.finish();
        }
    };

    // 更新画布尺寸
    const updateCanvasSize = (): void => {
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
    };

    // 截取当前帧
    const captureFrame = (): string => {
        if (!ctx) return '';
        
        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );
        return canvas.toDataURL('image/png');
    };

    // 初始化配置
    const initializeConfig = (): void => {
        // 复制配置到msg对象
        if (isObject(options)) {
            for (const key in options) {
                const msgKey = key as keyof MsgApi;
                (msg as any)[key] = (options as any)[msgKey];
            }
        }

        const updateDimensions = (): void => {
            const dimensionMap = { width: 'offsetWidth', height: 'offsetHeight' };
            for (const dimension in dimensionMap) {
                if (!options.hasOwnProperty(dimension)) {
                    const property = dimensionMap[dimension as keyof typeof dimensionMap] as keyof HTMLVideoElement;
                    if (property in video) {
                        (msg as any)[dimension] = (video as any)[property];
                    }
                }
            }
            updateCanvasSize();
        };

        // 设置间隔时间
        if (options.intervalTime) {
            if (options.intervalTime < 200) {
                intervalSeconds = 200 / 1000;
            } else {
                intervalSeconds = options.intervalTime / 1000;
            }
        }

        video.muted = muted;

        if (video.readyState === 4) {
            updateDimensions();
            onSuccess();
        } else {
            loadedMetadataHandler = () => {
                msg.duration = video.duration;
                updateDimensions();
                
                if (isFunction(options.success)) {
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        onSuccess();
                    }, 200);
                }
                
                video.removeEventListener('loadedmetadata', loadedMetadataHandler);
            };
            video.addEventListener('loadedmetadata', loadedMetadataHandler);
        }
    };

    // 设置时间更新监听
    const setupTimeUpdateListener = (): void => {
        timeUpdateHandler = () => {
            const { duration, currentTime } = video;
            const { draw_time } = api.msg;

            if (!api.msg.duration) {
                api.msg.duration = duration;
            }

            if ((duration === currentTime && draw_time !== currentTime) || 
                draw_time === '' || 
                (+draw_time + intervalSeconds <= currentTime)) {
                api.setCurrentTime(video.currentTime);
            }
        };

        video.addEventListener('timeupdate', timeUpdateHandler);
    };

    // 检查是否为对象
    const isObject = (obj: any): obj is object => {
        return obj && Object.prototype.toString.call(obj) === '[object Object]';
    };

    // 异步初始化函数
    async function initialize(): Promise<void> {
        // 获取或创建video元素
        video = options.video || createHiddenVideo();

        // 设置视频源
        if (!video.src) {
            if (options?.file) {
                const base64Result = await api.FileToBase64(options.file);
                if (typeof base64Result === 'string') {
                    video.src = base64Result;
                } else {
                    onFail(base64Result.message);
                    return;
                }
            } else {
                onFail('暂无切片的视频');
                return;
            }
        }

        initializeConfig();
        setupTimeUpdateListener();
    }

    // 执行初始化
    initialize();

    return api;
}

// 导出默认对象和命名导出
const defaultExport = { videoSlice };

export { videoSlice };
export default defaultExport;