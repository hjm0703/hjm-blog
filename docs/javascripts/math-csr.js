// MathJax 配置（与 OI Wiki 一致）
MathJax = {
  chtml: {
    matchFontHeight: false
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    renderActions: {
      addMenu: []
    }
  }
};

// 监听 Material 主题的页面加载事件（支持 navigation.instant）
// 这是官方推荐的方式，必须在 MathJax 加载后调用
document$.subscribe(function () {
  // 清除之前的渲染缓存，确保新页面内容正确渲染
  MathJax.startup.output.clearCache();
  MathJax.typesetClear();
  MathJax.texReset();
  MathJax.typesetPromise();
});
