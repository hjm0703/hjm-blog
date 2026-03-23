# LCA、树上前缀和与差分

## LCA

**LCA** 指的是树上最长公共祖先，我们可以现想出一个 预处理 $\mathcal O (N^2)$, 单次查询 $\mathcal O(N)$ 的做法：

令 `f[i][j]` 为 `i` 的第 `j` 层祖先是那个节点，因而有转移式：

`f[i][j]=f[fa[i]][j-1]`，我们便可以直接推出结果。

然后我们对这个进行倍增优化，令 `g[i][j] = f[i][1<<j]`，因而可以得出新的转移式：

`g[i][j]=g[g[i][j-1]][j-1]`，及时间复杂度为 $\mathcal O(N\log N+Q\log N)$。

??? code "CODE"
    ```cpp
    template<int N>
    class LCA{
        private:
            int dep[N];
            int fa[N][21];
        public:
            void build(int x=root,int f=0){
                dep[x]=dep[f]+1;
                fa[x][0]=f;
                for(int i=1;i<=20;i++)
                    fa[x][i]=fa[fa[x][i-1]][i-1];
                for(auto y: v[x]){
                    if(y==f) continue;
                    build(y,x);
                }
            }
            int lca(int x,int y){
                if(dep[x]<dep[y]) swap(x,y);
                for(int i=20;i>=0;i--){
                    if(dep[fa[x][i]]>=dep[y])
                        x=fa[x][i];
                }
                if(x==y) return x;
                for(int i=20;i>=0;i--){
                    if(fa[x][i]!=fa[y][i])
                        x=fa[x][i],y=fa[y][i];
                }
                return fa[x][0];
            }
    };
    LCA<N> L;
    ```

本做法比正常做法 **man 100ms**，加不加 `template` 都一样。

## 树上前缀和

??? problem "问题描述"
    有一颗多个带边权的无向边组成树
    
    现在查询多次两个点之间的距离。

我们先定义一个点的前缀和 `sum[]` 为这个点到根节点的路径长度。

于是 `x` 到 `y` 的距离为 `sum[x]+sum[y]-2*sum[lca[x,y]]`。

如果是处理点的同理。

**CODE：**`就不挂了`

## 树上差分

??? problem "问题描述"
    有一颗初始点权都为 0 的树，有多次操作每一次给一条路径上的点都加 `x`
    
    然后最后询问你每一个点的点权

我们先定义一个树的差分数组 `d[x] = val[x]-val[fa[x]]`, 因而，当给 `x` 到 `y` 的路径处理时：

`d[fa[x]]++,d[x]--,d[y]--`

然后在最后求一个前缀和即可。

如果是处理边的同理。

**CODE：**`就不挂了`
