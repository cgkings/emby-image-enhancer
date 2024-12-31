// ==UserScript==
// @name         Emby 高清图片优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除 Emby 图片 URL 中的尺寸限制参数
// @author       You
// @match        *://*/emby/*
// @match        *://*/web/*
// @grant        none
// @run-at       document-start
// @license MIT

// ==/UserScript==

(function() {
    'use strict';

    // 处理图片 URL 的函数
    function processImageUrl(img) {
        if (!img.src || (!img.src.includes('maxWidth') && !img.src.includes('maxHeight'))) {
            return;
        }

        try {
            const url = new URL(img.src);
            url.searchParams.delete('maxWidth');
            url.searchParams.delete('maxHeight');
            const newSrc = url.toString();
            
            if (img.src !== newSrc) {
                console.log("更新图片:", newSrc);
                img.src = newSrc;
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

    // 在页面加载开始时就运行脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllImages();
            observer.observe(document.body, observerConfig);
        });
    } else {
        processAllImages();
        observer.observe(document.body, observerConfig);
    }

    // 监听页面加载完成事件
    window.addEventListener('load', processAllImages);
})();