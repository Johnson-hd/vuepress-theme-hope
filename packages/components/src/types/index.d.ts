import type { Langs } from "@mr-hope/vuepress-shared";

export interface ComponentI18nConfig {
  /** 返回顶部文字 */
  backToTop: string;
  /** 分页多语言配置 */
  pagination: {
    /** 上一页文字 */
    prev: string;
    /** 下一页文字 */
    next: string;
    /** 跳转文字 */
    navigate: string;
    /** 按钮文字 */
    button: string;
    /** 错误文字 */
    errorText: string;
  };
}

export interface ComponentOptions {
  /**
   * 主目录所对应的语言。
   *
   * The language of the home directory.
   *
   * @default 'en-US'
   */
  baseLang?: Langs;
}

declare global {
  const COMPONENT_I18N: Record<string, ComponentI18nConfig>;
}
