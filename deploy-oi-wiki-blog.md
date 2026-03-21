# 从零搭建 OI Wiki 风格博客（部署到 Cloudflare Pages）

[OI Wiki](https://oi-wiki.org/) 是一个编程竞赛知识整合站点。本指南将帮助你搭建一个**风格完全一致**的个人博客，支持 **LaTeX 公式**、**语法高亮**、**提示框**等特性，并通过 **Cloudflare Pages** 免费部署。

---

## 目录

1. [整体架构](#整体架构)
2. [本地环境搭建](#本地环境搭建)
3. [创建项目并配置主题](#创建项目并配置主题)
4. [编写内容](#编写内容)
5. [部署到 Cloudflare Pages](#部署到-cloudflare-pages)
6. [进阶配置](#进阶配置)
7. [常见问题排查](#常见问题排查)
8. [完整项目模板](#完整项目模板)

---

## 一、整体架构

```
本地开发 → 编写 Markdown → mkdocs build → site/ 文件夹 → 推送 GitHub → Cloudflare Pages 自动部署
```

---

## 二、本地环境搭建

### 2.1 安装 Python 和 pip

确保 Python 3.8+ 已安装：

```bash
python --version
# 或
python3 --version
```

### 2.2 安装 MkDocs 及相关插件

```bash
# 安装核心工具
pip install mkdocs

# 安装 Material 主题（作为基础）
pip install mkdocs-material

# 安装扩展插件
pip install pymdown-extensions
pip install mkdocs-git-revision-date-localized-plugin  # 可选：显示最后更新日期
```

---

## 三、创建项目并配置主题

### 3.1 初始化项目

```bash
# 创建项目目录
mkdocs new my-oi-wiki
cd my-oi-wiki

# 查看项目结构
tree
# .
# ├── docs
# │   └── index.md
# └── mkdocs.yml
```

### 3.2 获取 OI Wiki 风格主题

OI Wiki 基于 `mkdocs-material` 主题做了定制。我们有两种选择：

#### 方案 A：直接使用 Material 主题（推荐）

无需额外操作，已在 `mkdocs.yml` 中配置为 `name: material`。

#### 方案 B：复制 OI Wiki 的定制主题（可选）

如果需要完全一致的风格，可以复制 OI Wiki 的主题文件：

**Windows CMD/PowerShell 用户：**

```powershell
# 克隆 OI Wiki 仓库（仅获取主题）
git clone --depth 1 https://github.com/OI-wiki/OI-wiki.git oi-wiki-temp

# OI Wiki 使用 git submodule 引用 mkdocs-material
# 需要初始化 submodule 才能获取主题文件
cd oi-wiki-temp
git submodule update --init --recursive

# 返回上级目录
cd ..

# 复制主题文件（PowerShell）
Copy-Item -Recurse oi-wiki-temp\mkdocs-material theme

# 复制额外资源（如自定义 CSS、JavaScript）
Copy-Item -Recurse oi-wiki-temp\docs\_static docs\  # 如果有静态资源

# 清理临时文件
Remove-Item -Recurse -Force oi-wiki-temp
```

**Git Bash 用户：**

```bash
# 克隆 OI Wiki 仓库（仅获取主题）
git clone --depth 1 https://github.com/OI-wiki/OI-wiki.git oi-wiki-temp

# OI Wiki 使用 git submodule 引用 mkdocs-material
# 需要初始化 submodule 才能获取主题文件
cd oi-wiki-temp
git submodule update --init --recursive

# 返回上级目录
cd ..

# 复制主题文件
cp -r oi-wiki-temp/mkdocs-material ./theme

# 复制额外资源（如自定义 CSS、JavaScript）
cp -r oi-wiki-temp/docs/_static ./docs/  # 如果有静态资源

# 清理临时文件
rm -rf oi-wiki-temp
```

> **注意**：如果选择方案 B，需要在 `mkdocs.yml` 中将主题配置改为：
> ```yaml
> theme:
>   name: null
>   custom_dir: theme
> ```

### 3.3 配置 mkdocs.yml

编辑 `mkdocs.yml`，配置主题和扩展（**与 OI Wiki 完全一致**）：

```yaml
# 站点信息
site_name: 我的算法笔记
site_description: OI 算法学习笔记
site_author: Your Name
site_url: https://your-site.pages.dev

# 版权信息
copyright: © 2024 Your Name

# 主题配置（与 OI Wiki 一致）
theme:
  name: material
  language: zh
  include_search_page: false
  search_index_only: true
  icon:
    logo: material/school
  palette:
    # 亮色模式 - 白底红 accent
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: white
      accent: red
      toggle:
        icon: material/weather-sunny
        name: 切换到深色模式
    # 深色模式 - 蓝底蓝 accent
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: blue
      accent: blue
      toggle:
        icon: material/weather-night
        name: 切换到亮色模式
  features:
    - navigation.tabs
    - navigation.instant
    - content.code.copy
  font:
    text: Fira Sans
    code: Fira Mono

# Markdown 扩展配置
markdown_extensions:
  - admonition
  - def_list
  - footnotes
  - meta
  - toc:
      permalink: ""
  - pymdownx.arithmatex:
      generic: true
  - pymdownx.caret
  - pymdownx.critic
  - pymdownx.details
  - pymdownx.emoji:
      emoji_generator: !!python/name:pymdownx.emoji.to_svg
  - pymdownx.highlight:
      linenums: true
  - pymdownx.inlinehilite
  - pymdownx.keys
  - pymdownx.magiclink
  - pymdownx.mark
  - pymdownx.snippets:
      check_paths: true
  - pymdownx.smartsymbols
  - pymdownx.superfences:
      custom_fences:
        - name: math
          class: arithmatex
          format: !!python/name:pymdownx.arithmatex.fence_mathjax_format
  - pymdownx.tasklist:
      custom_checkbox: true
  - pymdownx.tilde
  - pymdownx.tabbed:
      alternate_style: true

# 额外 JavaScript（MathJax 支持）
extra_javascript:
  - javascripts/math-csr.js
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js

# 额外 CSS
extra_css:
  - stylesheets/extra.css

# 导航结构
nav:
  - 首页：index.md
  - 数据结构:
      - 树状数组：ds/fenwick.md
```

### 3.4 创建自定义 CSS 文件

创建 `docs/stylesheets/extra.css`，复制 OI Wiki 的样式：

```css
/* 与 OI Wiki 一致的自定义样式 */

/* Logo title */
.md-header__topic:first-child {
  font-weight: initial !important;
}

/* Code font size in <details> */
details .linenos, details code {
  font-size: inherit !important;
}

/* Table full width */
.md-typeset__table { display: block !important; }
.md-typeset table:not(.highlighttable) { display: table !important; }

/* 深色模式配色 */
[data-md-color-scheme="slate"] {
  --md-primary-fg-color: #2e303e;
  --md-accent-fg-color: #00bda4;
  --md-typeset-a-color: #526cfe;
}

[data-md-color-scheme="slate"] .md-typeset img {
  background: white;
  filter: brightness(0.9);
}
```

### 3.5 创建 MathJax 配置文件

创建 `docs/javascripts/math-csr.js`：

```javascript
// MathJax 配置（与 OI Wiki 一致）
MathJax = {
  chtml: {
    matchFontHeight: false
  }
};

document$.subscribe(function () {
  MathJax.typesetPromise();
});
```

---

## 四、编写内容

### 4.1 创建目录结构

按照 OI Wiki 的风格组织（**使用英文目录名**，避免 URL 编码问题）：

**Git Bash / WSL：**

```bash
mkdir -p docs/{basic,ds,graph,math}
```

**PowerShell：**

```powershell
New-Item -ItemType Directory -Force docs\basic,docs\ds,docs\graph,docs\math
```

**CMD：**

```cmd
mkdir docs\basic docs\ds docs\graph docs\math
```

> **建议**：目录名使用英文（如 `ds`、`graph`），标题可以使用中文。这样 URL 更简洁，如 `/ds/fenwick/` 而非 `/data-structures/%E6%A0%91%E7%8A%B6%E6%95%B0%E7%BB%84/`

### 4.2 编写示例文章

创建 `docs/ds/fenwick.md`：

```markdown
# 树状数组 (Fenwick Tree)

树状数组是一种用于维护数列前缀和的数据结构，支持**单点修改**和**区间查询**操作，时间复杂度均为 $O(\log n)$。

## 基本思想

树状数组基于二进制的思想。对于一个正整数 $x$，我们定义 $\text{lowbit}(x)$ 为 $x$ 的二进制表示中最低位的 $1$ 所对应的值，即：

$$
\text{lowbit}(x) = x \& (-x)
$$

## 核心操作

### 单点更新

​```cpp
void add(int x, int k) {
    while (x <= n) {
        c[x] += k;
        x += lowbit(x);
    }
}
### 前缀查询
int sum(int x) {
    int res = 0;
    while (x > 0) {
        res += c[x];
        x -= lowbit(x);
    }
    return res;
}
​```
!!! note "区间查询"
    区间 $[l, r]$ 的和可以通过 `sum(r) - sum(l-1)` 得到。
```

### 4.3 本地预览

```bash
mkdocs serve
```



访问 `http://127.0.0.1:8000` 预览效果。

---

## 五、部署到 Cloudflare Pages

### 5.1 初始化 Git 仓库

**Git Bash / PowerShell：**
```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库（在 GitHub 网页端创建）
# 然后关联远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

> **Windows 用户提示**：如果 `main` 分支名称不同，可先运行 `git branch -M main` 重命名

### 5.2 在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → **Create a project** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| **Build command** | `pip install mkdocs mkdocs-material pymdown-extensions && mkdocs build` |
| **Build output directory** | `site` |
| **Environment variables** | （可选）`PYTHON_VERSION` = `3.11` |

### 5.3 等待部署

点击 **Save and Deploy**，Cloudflare 会自动：

- 拉取代码
- 安装依赖
- 执行 `mkdocs build`
- 将 `site/` 目录的内容部署

部署成功后，你会获得一个 `https://你的项目名.pages.dev` 的域名。

### 5.4 绑定自定义域名（可选）

1. 在项目设置中点击 **Custom domains**
2. 输入你的域名（如 `oi.yourdomain.com`）
3. 在 DNS 提供商处添加 CNAME 记录，指向 `你的项目名.pages.dev`

---

## 六、进阶配置

### 6.1 添加搜索功能

MkDocs Material 自带搜索，无需额外配置。如需更强大的搜索，可以添加：

```yaml
# mkdocs.yml
plugins:
  - search:
      lang: zh  # 支持中文搜索
```

### 6.2 添加评论系统（Giscus）

在 `theme/main.html` 中添加：

```html
<script src="https://giscus.app/client.js"
        data-repo="你的用户名/仓库名"
        data-repo-id="..."
        data-category="Announcements"
        data-category-id="..."
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
```

### 6.3 优化构建速度

在 Cloudflare Pages 的环境变量中添加：

```
PIP_CACHE_DIR = /opt/buildhome/.cache/pip
```

### 6.4 配置自动部署

每次 `git push` 到 GitHub 的 `main` 分支，Cloudflare Pages 会自动触发重新构建和部署。

---

## 七、常见问题排查

### 7.1 主题样式不生效

- 检查 `custom_dir` 路径是否正确
- 确保主题文件夹中有 `main.html`、`base.html` 等文件

### 7.2 数学公式不显示

- 检查 `extra_javascript` 中的 MathJax CDN 是否可访问
- 确认公式使用 `$$` 包裹（块级）或 `$` 包裹（行内）

### 7.3 构建时依赖安装失败

在 `mkdocs.yml` 同级目录创建 `requirements.txt`：

```
mkdocs
mkdocs-material
pymdown-extensions
```

然后在 Cloudflare Pages 的构建命令改为：

```bash
pip install -r requirements.txt && mkdocs build
```

### 7.4 本地预览正常，部署后异常

检查 Cloudflare Pages 的构建日志，确认：

- 构建命令是否成功执行
- `site` 目录是否正确生成
- 是否有文件路径大小写问题（Linux 环境区分大小写）

### 7.5 构建时出现 "not found in the documentation files" 警告

如果看到类似以下警告：
```
WARNING - A reference to 'xxx：path/file.md' is included in the 'nav' configuration...
```

这是 MkDocs 对中文标题的兼容性提示，**不影响正常使用**。只要：
- 文件确实存在于指定路径
- 本地预览正常
- 构建成功生成 `site/` 目录

即可忽略这些警告。

### 7.6 URL 出现中文编码

确保目录和文件名使用**英文**，如 `ds/fenwick.md` 而非 `数据结构/树状数组.md`。
标题可以使用中文，通过 Markdown 的 `# 标题` 语法设置。

---

## 八、完整项目模板

为了方便，我整理了完整的项目结构参考：

```
my-oi-wiki/
├── docs/
│   ├── index.md
│   ├── _static/              # 静态资源（图片、CSS 等）
│   ├── basic/
│   │   ├── sorting.md
│   │   └── binary-search.md
│   ├── ds/                   # 数据结构（使用英文目录名）
│   │   └── fenwick.md
│   └── graph/
│       └── shortest-path.md
├── theme/                    # OI Wiki 主题文件（可选）
│   ├── main.html
│   ├── base.html
│   ├── assets/
│   └── ...
├── mkdocs.yml               # 配置文件
├── requirements.txt         # Python 依赖
└── .gitignore              # 忽略 __pycache__、site/ 等
```

---

## 常用命令

**所有平台：**
```bash
# 本地预览（自动重载）
mkdocs serve

# 指定端口
mkdocs serve -a localhost:8080

# 构建静态站点
mkdocs build

# 查看帮助
mkdocs --help
```

**Windows 用户注意**：如果 `mkdocs` 命令无法识别，尝试使用 `python -m mkdocs` 代替：

```powershell
# PowerShell / CMD
python -m mkdocs serve
python -m mkdocs build
```

---

## 参考资源

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs 文档](https://squidfunk.github.io/mkdocs-material/)
- [OI Wiki 源码](https://github.com/OI-wiki/OI-wiki)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

现在你可以开始搭建自己的 OI Wiki 风格博客了。如果在部署过程中遇到任何具体问题（比如构建失败、样式异常等），把错误日志贴出来，我帮你分析解决。
