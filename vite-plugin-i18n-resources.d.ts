/**
 * i18n 资源处理插件的类型声明
 */
declare module './vite-plugin-i18n-resources' {
  export default function i18nResourcesPlugin(): {
    name: string;
    closeBundle(): void;
  };
} 