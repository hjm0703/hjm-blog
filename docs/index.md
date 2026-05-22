> **星图铺就的，未必是归途。**
>
> **但有人循着它，便不算迷路。**



![](images/logo.png)



这里是 [hjm0703](https://hjm-start.pages.dev) 的 blog  
以前的博客：[博客园 - hjm0703](https://cnblogs.com/hjm0703)

---

[洛谷](https://www.luogu.com.cn/user/1098988) ·
[B 站](https://space.bilibili.com/1368842151) ·
[AcWing](https://www.acwing.com/user/myspace/index/546471/) · 
[我的主页](https://hjm-start.pages.dev)

---

### 好用的网址

- [题解格式化](https://tj.imken.dev/#/)
- [在线画图](https://anacc22.github.io/another_graph_editor/)
- [百度翻译](https://fanyi.baidu.com/mtpe-individual/multimodal#/)
- [OI Wiki](https://oi-wiki.org/)

### 编译参数

有的时候一些 $\texttt{UB}$ 的问题很难被发现，下面代码可以解决大部分问题：

??? info "VScode 启动项"

    ```json
    {
        "version": "2.0.0",
        "tasks": [
            {
                "label": "GCC Run",
                "type": "shell",
                "command": "g++",
                "args": [
                    "-std=c++14",
                    "-Wall",
                    "-fsanitize=address,undefined",
                    "-D_GLIBCXX_DEBUG",
                    "-Wextra",
                    "-g",
                    "-O0",
                    "${file}",
                    "-o",
                    "${fileDirname}/run",
                    "&&",
                    "${fileDirname}/run"
                ],
                "group": {
                    "kind": "build",
                    "isDefault": true
                },
                "presentation": {
                    "echo": true,
                    "reveal": "always",
                    "focus": false,
                    "panel": "shared",
                    "showReuseMessage": true,
                    "clear": true
                },
                "problemMatcher": ["$gcc"]
            }
        ]
    }
    ```

[![洛谷](https://fecdn.luogu.com.cn/luogu/logo.png?0fdd294ff62e331d2f70e1a37ba4ee02)](https://luogu.com.cn)

