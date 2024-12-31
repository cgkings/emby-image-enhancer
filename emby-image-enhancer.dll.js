(function() {
    'use strict';
    console.log("Emby 高清图片优化脚本启动...");

    // 配置项，想显示原图可以设置为99999
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