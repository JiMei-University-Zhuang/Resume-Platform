/**
 * 防抖函数 (Debounce)
 * 概念：在一定时间内，多次触发同一个函数，只执行最后一次
 * 场景：
 * 1. 搜索框输入，等用户输入完成后才发送请求
 * 2. 窗口大小改变，只在改变完成后执行回调
 * 3. 表单提交按钮，防止多次点击
 */
/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，单位毫秒
 * @returns 返回一个防抖后的函数
 */
export function debounce(fn: Function, delay: number) {
  let timer = null;

  return function (this: any, ...args: any[]) {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数 (Throttle)
 * 概念：在一定时间内，只执行一次函数，无论触发多少次
 * 场景：
 * 1. 滚动事件处理
 * 2. 页面resize处理
 * 3. 按钮快速点击
 * 4. 游戏中的射击
 */
/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param interval 间隔时间，单位毫秒
 * @returns 返回一个节流后的函数
 */
// export function throttle<T extends (...args: any[]) => any>(fn: T, interval: number): (...args: Parameters<T>) => void {
//     let lastTime = 0;
    
//     return function (this: any, ...args: Parameters<T>) {
//         const currentTime = Date.now();
        
//         if (currentTime - lastTime >= interval) {
//             fn.apply(this, args);
//             lastTime = currentTime;
//         }
//     };
// }
function throttle<T extends (...args: any[]) => any>(
  fn: T, 
  interval: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: any,...args: Parameters<T>) {
    const now = Date.now();
    if(now - lastTime >= interval) {
      fn.apply(this, args)
      lastTime = now
    }
  };
}

// 使用示例：
/*
import { debounce, throttle } from '@/utils/optimization'

// 防抖示例：搜索输入
const handleSearch = debounce((value: string) => {
  // 发送搜索请求
  console.log('Searching for:', value)
}, 500)

// 节流示例：滚动处理
const handleScroll = throttle(() => {
  // 处理滚动事件
  console.log('Scroll event handled')
}, 200)

// 在组件中使用
const searchInput = ref('')
watch(searchInput, (newValue) => {
  handleSearch(newValue)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
*/
