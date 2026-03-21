// MathJax 配置（与 OI Wiki 一致）
MathJax = {
  chtml: {
    matchFontHeight: false
  }
};

document$.subscribe(function () {
  MathJax.typesetPromise();
});
