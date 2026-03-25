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
document$.subscribe(function () {
  MathJax.typesetPromise();
});

// 监听 MkDocs Material 的 instant 导航事件
document.addEventListener('DOMContentLoaded', function () {
  MathJax.typesetPromise();
});
