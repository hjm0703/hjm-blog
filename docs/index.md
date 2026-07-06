<!-- 引入 Font Awesome 6 图标库 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

<style>
  /* 星空特效 CSS */
  @keyframes starMove {
    0% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
    100% { transform: translateY(20px) translateX(10px); opacity: 0.2; }
  }
  @keyframes starGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  .star-bg {
    position: relative;
    background: linear-gradient(135deg, #0a0f2a 0%, #0f1a3a 100%);
    overflow: hidden;
    border-radius: 1rem;
  }
  .star-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20% 40%, white, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 60% 80%, white, rgba(0,0,0,0)),
      radial-gradient(3px 2px at 85% 15%, white, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 10% 90%, white, rgba(0,0,0,0)),
      radial-gradient(2px 1px at 45% 55%, white, rgba(0,0,0,0)),
      radial-gradient(1px 2px at 75% 30%, white, rgba(0,0,0,0)),
      radial-gradient(2px 2px at 33% 70%, white, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 92% 50%, white, rgba(0,0,0,0)),
      radial-gradient(3px 2px at 5% 20%, white, rgba(0,0,0,0));
    background-repeat: no-repeat;
    background-size: 200px 200px;
    animation: starMove 8s infinite alternate ease-in-out;
    pointer-events: none;
  }
  .star-bg::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(1px 1px at 30% 60%, white, rgba(0,0,0,0)),
                      radial-gradient(2px 2px at 70% 20%, white, rgba(0,0,0,0));
    background-repeat: no-repeat;
    animation: starGlow 3s infinite alternate;
    pointer-events: none;
  }
  .star-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    padding: 2rem 1rem;
  }
  .star-content .main-quote {
    font-size: 1.7rem;
    font-weight: 500;
    line-height: 1.3;
    text-shadow: 0 0 8px rgba(0,0,0,0.5);
  }
  .star-content .right-text {
    text-align: right;
    margin-top: 1rem;
    font-style: italic;
    opacity: 0.9;
  }

  /* 其他样式保持不变 */
  .flat-card {
    background: rgba(255,255,255,0.96);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06);
    transition: all 0.2s;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .flat-card:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  .link-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f0f2f6;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    text-decoration: none;
    color: #1f2937;
    font-size: 0.9rem;
    transition: 0.2s;
  }
  .link-badge i {
    font-size: 1rem;
    color: #3b82f6;
  }
  .link-badge:hover {
    background: #e4e7ed;
    transform: translateY(-1px);
  }
  .link-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.5rem;
  }
  .full-width-img {
    text-align: center;
    margin: 1rem 0;
  }
  .full-width-img img {
    width: 100%;
    max-width: 800px;
    height: auto;
    border-radius: 1rem;
    display: block;
    margin: 0 auto;
  }
  .luogu-full {
    text-align: center;
    margin: 1rem 0;
  }
  .luogu-full img {
    width: 100%;
    max-width: 400px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  .right-text {
    text-align: right;
    color: #4b5563;
    margin-top: 0.5rem;
  }
  @media (max-width: 700px) {
    .grid-2 { grid-template-columns: 1fr; }
    .full-width-img img { max-width: 100%; }
    .luogu-full img { max-width: 80%; }
    .star-content .main-quote { font-size: 1.3rem; }
  }
</style>

<!-- 英雄区：星空特效 + 居中文字 + 靠右副标题 -->
<div class="star-bg">
  <div class="star-content">
    <div class="main-quote">
      星图铺就的，未必是归途<br>
      但有人循着它，便不算迷路
    </div>
    <div class="right-text">———— 2026 四川省选</div>
  </div>
</div>

<!-- logo.png 占满一行 -->
<div class="full-width-img">
  <img src="images/logo.png" alt="blog logo" onerror="this.style.display='none'">
</div>

<!-- 两列信息 -->
<div class="grid-2">
  <div class="flat-card">
    <h3><i class="fas fa-pen-fancy"></i> 此地</h3>
    <p>这里是 <a href="https://hjm-start.pages.dev">hjm0703</a> 的 blog</p>
    <p>以前的博客：<a href="https://cnblogs.com/hjm0703">博客园 - hjm0703</a></p>
  </div>
  <div class="flat-card">
    <h3><i class="fas fa-compass"></i> 出没地</h3>
    <div class="link-group">
      <a href="https://www.luogu.com.cn/user/1098988" class="link-badge"><i class="fab fa-luogu"></i> 洛谷</a>
      <a href="https://space.bilibili.com/1368842151" class="link-badge"><i class="fab fa-bilibili"></i> B站</a>
      <a href="https://www.acwing.com/user/myspace/index/546471/" class="link-badge"><i class="fas fa-code"></i> AcWing</a>
      <a href="https://hjm-start.pages.dev" class="link-badge"><i class="fas fa-home"></i> 我的主页</a>
    </div>
  </div>
</div>

<!-- 好用的网址 -->
<div class="flat-card">
  <h3><i class="fas fa-link"></i> 好用的网址</h3>
  <div class="link-group">
    <a href="https://tj.imken.dev/#/" class="link-badge"><i class="fas fa-edit"></i> 题解格式化</a>
    <a href="https://anacc22.github.io/another_graph_editor/" class="link-badge"><i class="fas fa-chalkboard"></i> 在线画图</a>
    <a href="https://fanyi.baidu.com/mtpe-individual/multimodal#/" class="link-badge"><i class="fas fa-language"></i> 百度翻译</a>
    <a href="https://oi-wiki.org/" class="link-badge"><i class="fas fa-book-open"></i> OI Wiki</a>
  </div>
</div>

<!-- 洛谷 logo 占满一行 -->
<div class="luogu-full">
  <a href="https://luogu.com.cn" target="_blank">
    <img src="https://fecdn.luogu.com.cn/luogu/logo.png?0fdd294ff62e331d2f70e1a37ba4ee02" alt="洛谷">
  </a>
</div>