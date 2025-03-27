// 声明canvas-confetti模块
declare module 'canvas-confetti';

// 定义帧请求回调类型
type FrameRequestCallback = (time: number) => void;

// 确保全局对象在TypeScript中可用
interface Window {
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
} 