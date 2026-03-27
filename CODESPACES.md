# hjm-blog 云端编辑部署指南（GitHub Codespaces + Cloudflare Pages）

---

## 📋 目录

- [方案说明](#方案说明)
- [快速开始](#快速开始)
- [日常使用](#日常使用)
- [本地开发](#本地开发)
- [常见问题](#常见问题)

---

## 方案说明

### 架构

```
┌──────────────────────────────────────────────────────────┐
│  GitHub                                                  │
│  ┌─────────────────┐         ┌──────────────────────┐   │
│  │   Codespaces    │  ────→  │   你的仓库           │   │
│  │   (在线编辑)     │   push  │                      │   │
│  └─────────────────┘         └──────────────────────┘   │
│                              ↑                           │
│                              │ webhook                   │
│                              ↓                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Cloudflare Pages                               │   │
│  │   自动构建 + 部署                                │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                        ↓
                        │ 访问
                        ↓
              https://你的域名.pages.dev
```

### 优势

- ✅ **完全免费**：Codespaces 每月 60 小时免费额度，Cloudflare Pages 免费托管
- ✅ **24 小时在线**：博客托管在 Cloudflare，无需开自己的电脑
- ✅ **随时随地编辑**：任何设备打开浏览器即可写文章
- ✅ **自动部署**：推送到 GitHub 后 Cloudflare 自动构建发布
- ✅ **数据云端**：所有代码和文章存储在 GitHub

---

## 快速开始

### 步骤 1：启用 Codespaces

1. 打开你的 GitHub 仓库：`https://github.com/hjm0703/hjm-blog`
2. 点击 **Code** 按钮（绿色）
3. 切换到 **Codespaces** 标签
4. 点击 **Create codespace on main**

### 步骤 2：等待环境初始化

首次创建需要 2-5 分钟，Codespaces 会：
- 创建开发容器
- 安装 Python 3.11
- 安装 `requirements.txt` 中的依赖（MkDocs、Material 主题等）

### 步骤 3：开始写作

环境准备好后，你会看到网页版 VS Code：

1. 在左侧文件浏览器打开 `docs/` 目录
2. 点击任意 `.md` 文件开始编辑
3. 支持实时预览、Markdown 语法高亮、代码补全

### 步骤 4：预览博客

在 Codespaces 终端运行：

```bash
mkdocs serve --dev-addr 0.0.0.0:8000
```

Codespaces 会自动转发 8000 端口，点击弹出的 **Open in Browser** 即可预览。

### 步骤 5：提交并部署

```bash
# 添加文件
git add .

# 提交更改
git commit -m "添加新文章：xxx"

# 推送到 GitHub
git push
```

推送后，Cloudflare Pages 会自动：
1. 拉取最新代码
2. 执行 `mkdocs build`
3. 部署到 `https://你的域名.pages.dev`

---

## 日常使用

### 访问你的 Codespace

1. 打开 `https://github.com/codespaces`
2. 点击你的 codespace 名称
3. 直接进入编辑界面

### 常用命令

```bash
# 本地预览（实时重载）
mkdocs serve

# 构建静态站点
mkdocs build

# 查看生成的文件
ls site/

# 检查语法
mkdocs build --strict
```

### 写文章流程

1. **创建 Codespace** → 访问 https://github.com/codespaces
2. **编辑 Markdown** → 在 `docs/` 目录下创建/修改文件
3. **预览效果** → 运行 `mkdocs serve`，端口自动转发
4. **提交推送** → `git add . && git commit -m "xxx" && git push`
5. **等待部署** → Cloudflare 自动构建，1-2 分钟后访问网站查看

### 配置导航

编辑 `mkdocs.yml` 的 `nav` 部分：

```yaml
nav:
  - 首页：index.md
  - STL:
    - bitset: STL/bitset.md
  - 图论:
    - LCA、树上前缀和与差分：graph/LCA、树上前缀和与差分.md
    - DFS 序与树链剖分：graph/DFS 序与树链剖分.md
```

---

## 本地开发（可选）

如果你想在本地电脑上开发：

### 安装依赖

```bash
pip install -r requirements.txt
```

### 本地预览

```bash
mkdocs serve
```

访问 `http://127.0.0.1:8000`

### 推送到 GitHub

```bash
git add .
git commit -m "更新内容"
git push
```

---

## 常见问题

### Q1: Codespaces 是什么？

**GitHub Codespaces** 是 GitHub 提供的云端开发环境，基于 VS Code，运行在容器中。你只需要浏览器就能写代码。

### Q2: 免费额度够用吗？

**每月 60 小时免费额度**（2 核 CPU + 4GB 内存配置）。对于写博客来说完全够用：
- 每周写 2 小时文章 → 每月 8 小时
- 剩余 52 小时备用

### Q3: 如何查看 Codespaces 使用量？

访问：https://github.com/settings/billing

### Q4: Cloudflare Pages 免费吗？

**完全免费**，包括：
- 无限请求次数
- 免费 SSL 证书
- 免费自定义域名绑定
- 全球 CDN 加速

### Q5: 如何绑定自定义域名？

1. 打开 Cloudflare Dashboard → Pages → 你的项目
2. 点击 **Custom domains**
3. 输入你的域名（如 `oi.yourdomain.com`）
4. 按照提示配置 DNS（CNAME 记录）

### Q6: Codespace 关闭后数据会丢失吗？

**不会**。所有更改都保存在 GitHub 仓库中。关闭 Codespace 只是停止容器，下次打开时会恢复原样。

### Q7: 如何停止 Codespace 计费？

- 手动停止：https://github.com/codespaces → 点击 **Stop**
- 设置自动停止：Settings → Codespaces → 设置空闲超时

### Q8: 部署失败怎么办？

1. 打开 Cloudflare Dashboard → Pages → 你的项目
2. 点击 **Deployments** 查看构建日志
3. 常见错误：
   - `mkdocs.yml` 语法错误
   - Markdown 文件路径错误
   - 依赖缺失（检查 `requirements.txt`）

---

## 费用参考

| 服务 | 免费额度 | 超出后价格 |
|------|----------|------------|
| GitHub Codespaces | 60 小时/月 | $0.18/小时 |
| Cloudflare Pages | 无限 | 免费 |

---

## 参考资源

- [GitHub Codespaces 文档](https://docs.github.com/en/codespaces)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs 文档](https://squidfunk.github.io/mkdocs-material/)

---

**祝你写作愉快！** ✍️
