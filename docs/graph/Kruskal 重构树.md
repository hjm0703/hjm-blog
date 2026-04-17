# Kruskal 重构树

## 引入

听名字就知道是和 Kruskal 有关， 其本质是把一颗无向联通图重构成一颗带有特殊性质的树，其重构方法如下：

1. 按照边权从小到大排序

2. 从小到大遍历所有边，假定现在便利到了 $(x,y,w)$

3. 询问他们所在的联通块 $fx,fy$。如果在一个中那么回到 $2$ 。

4. 然后创建一个新的节点 $cnt$ ，令 $fx,fy$ 所在的联通块为 $cnt$ 。

5. 连接边 $(cnt,fx)$ 和 $(cnt,fy)$

我们发现前四步几乎就是 Kruskal 的步骤，只是在第五步把 Kruskal 的过程通过图的办法记录了下来。

??? success "示例代码"

    ```cpp
    
    struct DSU;
    DSU T;

    struct edge{
        int x,y,w;
        bool operator < (const edge& x) const {
            return w < x.w; // 根据题目要求
        }
    }e[M];

    int cnt;
    void Kruskal() {
        sort(e+1, e+m+1);
        for(int i=1; i<=m; i++){
            int x=T.find(e[i].x), y=T.find(e[i].y);
            if(x==y) continue;
            cnt++, val[cnt]=e[i].w;
            T.fa[x]=T.fa[y]=T.fa[cnt]=cnt;
            v[cnt].push_back(x);
            v[cnt].push_back(y);
        }
    }
    ```

## 性质

当然光是一个能够把图转换成树的办法肯定没什么用，必经把图转化成树老生常谈，其他办法都有他们独特的性质，从而解决题目，而 **kruskal重构树** 的性质如下：

1. 树上的一个子树对应 Kruskal 过程中的一个连通块。
2. $x$, $y$ 的最小瓶颈路（路径上最大边最小值）等于 LCA 的权值。
3. 同一到根链上点越深，权值越小/大。

## 应用

直接给出题目：

???+ node "[P4768 [NOI2018] 归程](https://www.luogu.com.cn/problem/P4768)"
    <!-- **标签：Kruskal重构树** -->

    首先形式化提议就是要求解一个点 $x$ 使得从 $v$ 到 $x$ 的边全部满足 $w>p$ 。

    然后询问 $x$ 离 $1$ 距离的最小值。

    由于 Kruskal重构树 满足一个 "子树对应 Kruskal 过程中的一个连通块" 并且 "同一到根链上点越深，权值越小/大。" .

    所以我们直接在 Kruskal 重构树上倍增跳到祖先中最上面的节点 $x$ 满足 $val_x>p$ 。 然后此时 $x$ 在重构树上的子树中的节点都是可取的，然后直接子树查询到达 $1$ 的最短路径就可以了。

