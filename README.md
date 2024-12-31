# Emby 高清图片优化脚本

## 功能简介
这是一个用于优化 Emby 网页端图片显示质量的油猴脚本。它通过移除图片 URL 中的尺寸限制参数（maxWidth 和 maxHeight），使图片以原始分辨率显示，从而提供更好的观看体验。

## 原理说明
默认情况下，Emby 网页端会对图片添加尺寸限制参数，例如：
http://your-emby-server/emby/Items/123/Images/Primary?maxHeight=375&maxWidth=250&tag=xxx&quality=90
本脚本会自动移除这些限制参数，转换为：
http://your-emby-server/emby/Items/123/Images/Primary?tag=xxx&quality=90
## Emby 网页端 油猴脚本使用方法
1. 安装 Tampermonkey 浏览器扩展
   - [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 附加组件](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. 点击[本页面](https://greasyfork.org/zh-CN/scripts/522379-emby-高清图片优化)的"安装此脚本"按钮

3. 打开 Emby 网页端，脚本会自动生效

## Emby 客户端 Emby.CustomCssJS插件的js脚本
1. 安装 Emby.CustomCssJS插件
   `https://github.com/Shurelol/Emby.CustomCssJS`

2. 复制粘贴如下代码：emby-image-enhancer.dll.js

3. 启用，重载

## 兼容性
- 适用于所有使用标准 Web 界面的 Emby 服务器
- 支持主流浏览器（Chrome、Firefox、Edge 等）
- 支持自定义域名的 Emby 服务器

## 更新日志
### v1.0 (2024-12-31)
- 首次发布
- 实现基础的图片优化功能
- 支持动态加载的图片处理

## 注意事项
- 由于显示原始分辨率图片，可能会增加带宽使用量
- 如果遇到性能问题，建议在网络较好的环境下使用
- 本脚本不会修改 Emby 服务器上的原始文件

## 反馈与建议
如果你在使用过程中遇到问题或有改进建议，请通过以下方式反馈：
1. 在 Greasy Fork 的脚本页面留言
2. 在 GitHub 提交 Issue（如果有）

## 许可证
MIT License

## 致谢
感谢所有提供反馈和建议的用户。

## 免责声明
本脚本仅供学习交流使用，请遵守当地法律法规。作者不对使用本脚本造成的任何问题负责。