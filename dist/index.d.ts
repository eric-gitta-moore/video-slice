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
declare function videoSlice(options?: objMsgApi): MyObject;
declare const defaultExport: {
    videoSlice: typeof videoSlice;
};
export { videoSlice };
export default defaultExport;
//# sourceMappingURL=index.d.ts.map