import type { LangPaths } from "@mr-hope/vuepress-shared";
import type { PWAI18NConfig } from "../types";

/** Muti language config for pwa popup */
export const i18n: Record<LangPaths, PWAI18NConfig> = {
  "/zh/": {
    install: "安装",
    iOSInstall: "点击分享按钮然后点击“添加到主屏幕”",
    cancel: "取消",
    desc: "详情",
    feature: "主要特色",
    explain:
      "该应用可以安装在您的 PC 或移动设备上。这将使该 Web 应用程序外观和行为与其他应用程序相同。它将在出现在应用程序列表中，并可以固定到主屏幕，开始菜单或任务栏。此 Web 应用程序还将能够与其他应用程序和您的操作系统安全地进行交互。",
    update: "发现新内容可用",
  },
  "/en/": {
    install: "Install",
    iOSInstall: "Tap the share button and then 'Add to Homescreen'",
    cancel: "Cancel",
    desc: "Description",
    feature: "Key Features",
    explain:
      "This app can be installed on your PC or mobile device.  This will allow this web app to look and behave like any other installed app.  You will find it in your app lists and be able to pin it to your home screen, start menus or task bars.  This installed web app will also be able to safely interact with other apps and your operating system. ",
    update: "New content is available.",
  },
  "/vi/": {
    install: "Tải về",
    iOSInstall: "Nhấn vào nút chia sẻ và sau đó 'Thêm vào Màn hình chính'",
    cancel: "Huỷ bỏ",
    desc: "Sự miêu tả",
    feature: "Các tính năng chính",
    explain:
      "Ứng dụng này có thể được cài đặt trên PC hoặc thiết bị di động của bạn. Điều này sẽ cho phép ứng dụng web này trông và hoạt động giống như bất kỳ ứng dụng đã cài đặt nào khác. Bạn sẽ tìm thấy nó trong danh sách ứng dụng của mình và có thể ghim nó vào màn hình chính, menu bắt đầu hoặc thanh tác vụ. Ứng dụng web đã cài đặt này cũng sẽ có thể tương tác an toàn với các ứng dụng khác và hệ điều hành của bạn.",
    update: "Đã có nội dung mới",
  },
};
