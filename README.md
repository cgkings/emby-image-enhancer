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

2. 复制粘贴如下代码：
```
(function() {
    'use strict';
    console.log("Emby 高清图片优化脚本启动...");

    // 配置项
    const CONFIG = {
        // 封面图最大宽度（像素）
        posterMaxWidth: 500,
        // 背景图最大宽度（像素）
        backdropMaxWidth: 1200,
        // 默认最大宽度（像素）
        defaultMaxWidth: 800
    };

    // 判断图片类型并返回对应的最大宽度
    function getMaxWidthByUrl(url) {
        if (url.includes('/Primary?')) {
            return CONFIG.posterMaxWidth;
        }
        if (url.includes('/Backdrop?')) {
            return CONFIG.backdropMaxWidth;
        }
        return CONFIG.defaultMaxWidth;
    }

    // 处理图片 URL 的函数
    function processImageUrl(img) {
        if (!img.src || !img.src.includes('emby/Items')) {
            return;
        }

        try {
            const url = new URL(img.src);
            const currentMaxWidth = url.searchParams.get('maxWidth');
            const currentMaxHeight = url.searchParams.get('maxHeight');
            
            // 如果当前限制小于配置的最大宽度，则更新
            if (currentMaxWidth && parseInt(currentMaxWidth) < getMaxWidthByUrl(img.src)) {
                url.searchParams.set('maxWidth', getMaxWidthByUrl(img.src).toString());
                url.searchParams.delete('maxHeight');
                
                if (img.src !== url.toString()) {
                    console.log("更新图片:", url.toString());
                    img.src = url.toString();
                }
            }
        } catch (error) {
            console.error("处理图片URL时出错:", error);
        }
    }

    // 处理所有图片
    function processAllImages() {
        document.querySelectorAll('img[src*="emby/Items"]').forEach(processImageUrl);
    }

    // 创建 MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // 检查新添加的节点
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    processImageUrl(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img[src*="emby/Items"]').forEach(processImageUrl);
                }
            });

            // 检查属性变化
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'src' && 
                mutation.target.nodeName === 'IMG') {
                processImageUrl(mutation.target);
            }
        });
    });

    // 配置 MutationObserver
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    };

    // 适配客户端 API
    function initializeScript() {
        try {
            processAllImages();
            observer.observe(document.body, observerConfig);
            console.log("Emby 高清图片优化脚本初始化完成");
        } catch (error) {
            console.error("脚本初始化失败:", error);
        }
    }

    // 确保在 DOM 加载完成后运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // 监听页面加载完成事件，确保处理动态加载的内容
    window.addEventListener('load', processAllImages);
})();
```
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