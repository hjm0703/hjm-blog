# DFS 序与树链剖分

!!! note "备注"
    先感谢以前自己居然写了总结，I love char
    
    但是，什么垃圾 latex

## DFS 序

**DFS** 序，就是对于一个图进行 **DFS** 便利时，访问节点的顺序\
如下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/d1kf8jra.png)

这棵树的 **DFS** 序是 `A B C D E F`

**那这又有什么用呢？**

当我们要计算以 **B** 为根的字数点权和时，相当于是求 `A+B+C`, 这样正好在 **DFS** 序中构成了一个区间。

如 `[dfn[x],dfn[x]+siz[x]-1]`, 相当于将 **树上便利** 变为了 **区间修改**，于是可以使用**数据结构**来维护。

## 树链剖分

对于一个要进行树链剖分的树，有以下定义：

1. 重子节点：儿子中子树最大的节点
2. 轻子节点：其他节点
3. 重边：向下连接到重子节点的边
4. 轻边：其他边
5. 重链：由重边相连组成的链

（如下图）

![](https://oi-wiki.org/graph/images/hld.png)

因而我们需要记录以下信息：

1. `fa[x]` 父亲节点
2. `dep[x]` 深度
3. `siz[x]` 子树大小
4. `son[x]` 重儿子
5. `top[x]` 所在重链的顶部节点
6. `dfn[x]` DFS 序

很明显而发现，每一个点都会属于一个重链，或者说，整棵树被分成了若干条链

**更明显** 能发现，轻子节点的子树大小小于父亲节点子树大小的一半

同时也 **显然**，任意一条最短路径可以被分成了至多 $\log n$ 条重链

??? proof "证明"
    我们可以将这条链分为按 **LCA** 分界的两条链，设这条链会被分成 $k$ 段，则这条链上一定有 $k$ 个轻节点，有上一个结论：`轻子节点的子树大小小于父亲节点子树大小的一半` 可以发现，这条链的尾部节点子树大小最多为 $\frac{lca 子树大小}{2^k}$，lca 子树大小最多为 $n$，且这条链的尾部节点子树大小最少为 $1$，因而 $2^k$ 最大为 $n$，因而 $k<\log n$

**那这又有什么用呢？**

如果我们要求解一条路径的点权和，便可以转换为求解若干条重链，我们发现一个节点只有一个重子节点，因而只需要每一次先枚举重子节点，便可保证每条重链的 **DFS** 序是连续的，即可用 $\log n$ 的时间复杂度求解每一条重链的点权和。

**那么如何拆分重链**

这种过程有点类似 **LCA**，但是每一次是从 $x$ 跳到 `fa[top[x]]`, 且结束条件为两点在同一重链上，步骤：

1. 检测两个点的 `top` 是否相等，如果是，跳出循环
2. 如果 `top[x]` 的深度小于 `top[y]` 的深度，交换，及每一次跳矮的。
3. 对于从线段树 `[dfn[x],dfn[fa[top[x]]]` 寻找答案
4. 更新 $x$ 为 `fa[top[x]]`
5. 回到 **1**
6. 处理线段树 `[dfn[x],dfn[y]]`

![](https://cdn.luogu.com.cn/upload/image_hosting/7j14na1n.png)

如图，当求 `(10,8)` 时，`10 --> 5,8 -> 3` 然后算 `[5,3]`。

## CODE

**DFS 预处理：**

- **build1**: `fa[]`, `dep[]`, `siz[]`, `son[]`。

- **build2**: `top[]`, `dfn[]`。

??? code "代码"
    ```cpp
    void build1(int x,int ff){
    	son[x]=-1,siz[x]=1;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(y==ff) continue;
    		dep[y]=dep[x]+1;
    		fa[y]=x;
    		build1(y,x);
    		siz[x]+=siz[y];
    		if(son[x]==-1||siz[y]>siz[son[x]]) son[x]=y;
    	}
    }
    void build2(int x,int ff,int tp){
    	top[x]=tp;
    	dfn[x]=++cnt;
    	rnk[cnt]=x;
    	if(son[x]==-1) return;
    	build2(son[x],x,tp);
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(y==ff||y==son[x]) continue;
    		build2(y,x,y);
    	}
    }
    ```

**从 x 到 y 结点最短路径上所有节点的值都加上 z**

??? code "CODE"
    ```cpp
    void update(int x,int y,int k){
    	k%=P;
    	while(top[x]!=top[y]){
    		if(dep[top[x]]<dep[top[y]]) swap(x,y);
    		change(1,dfn[top[x]],dfn[x],k);
    		x=fa[top[x]];
    	}
    	if(dep[x]>dep[y]) swap(x,y);
    	change(1,dfn[x],dfn[y],k);
    }
    ```

**求树从 x 到 y 结点最短路径上所有节点的值之和**

??? code "CODE"
    ```cpp
    int query(int x,int y){
    	int ans=0;
    	while(top[x]!=top[y]){
    		if(dep[top[x]]<dep[top[y]]) swap(x,y);
    		ans+=ask(1,dfn[top[x]],dfn[x]);
    		ans%=P;
    		x=fa[top[x]];
    	}
    	if(dep[x]>dep[y]) swap(x,y);
    	ans+=ask(1,dfn[x],dfn[y]);
    	ans%=P;
    	return ans;
    }
    ```

**将以 x 为根节点的子树内所有节点值都加上 z**

??? code "CODE"
    ```cpp
    void updatetree(int x,int k){
    	change(1,dfn[x],dfn[x]+siz[x]-1,k);
    }
    ```

**求以 x 为根节点的子树内所有节点值之和**

??? code "CODE"
    ```cpp
    int querytree(int x){
    	return ask(1,dfn[x],dfn[x]+siz[x]-1);
    }
    ```

??? code "完整 CODE"
    ```cpp
    int cnt,rnk[N],a[N];//DFS 序，初始点权
    int fa[N],dep[N],siz[N],son[N],top[N],dfn[N];//点的信息
    class SMT{
    private:
        struct SegmentTree{
            int l,r;//左右端点
            int sum;//区间和
            int tag;//区间懒标记
            #define lc p<<1
            #define rc p<<1|1
        }T[N<<2];
        void push_down(int p){
            if(T[p].tag==0) return;
            T[lc].sum=(T[lc].sum+T[p].tag*(T[lc].r-T[lc].l+1))%P;
            T[rc].sum=(T[rc].sum+T[p].tag*(T[rc].r-T[rc].l+1))%P;
            T[lc].tag=(T[lc].tag+T[p].tag)%P;
            T[rc].tag=(T[rc].tag+T[p].tag)%P;
            T[p].tag=0;
        }
    public:
        void build(int p,int l,int r){
            T[p].l=l,T[p].r=r;
            if(l==r) {
                T[p].sum=a[rnk[l]];
                return;
            }
            int mid=l+r>>1;
            build(lc,l,mid);
            build(rc,mid+1,r);
            T[p].sum=(T[lc].sum+T[rc].sum)%P;
        }
    
        void change(int p,int l,int r,int k){
            if(l<=T[p].l && r>=T[p].r){
                T[p].sum+=(T[p].r-T[p].l+1)*k;
                T[p].sum%=P;
                T[p].tag+=k;
                T[p].tag%=P;
                return;
            }
            push_down(p);
            int mid=T[p].l+T[p].r>>1;
            if(l<=mid) change(lc,l,r,k);
            if(r>mid) change(rc,l,r,k);
            T[p].sum=T[lc].sum+T[rc].sum;
            T[p].sum%=P;
        }
        int ask(int p,int l,int r){
            if(l<=T[p].l && r>=T[p].r){
                return T[p].sum;
            }
            push_down(p);
            int ans=0;
            int mid=T[p].l+T[p].r>>1;
            if(l<=mid) ans+=ask(lc,l,r);
            if(r>mid) ans+=ask(rc,l,r);
            ans%=P;
            return ans;
        }
    };
    SMT T;
    void build1(int x,int f){
    	son[x]=-1,siz[x]=1;
    	for(auto y: v[x]){
    		if(y==f) continue;
    		dep[y]=dep[x]+1;
    		fa[y]=x;
    		build1(y,x);
    		siz[x]+=siz[y];
    		if(son[x]==-1||siz[y]>siz[son[x]]) son[x]=y;
    	}
    }
    void build2(int x,int f,int tp){
    	top[x]=tp;
    	dfn[x]=++cnt;
    	rnk[cnt]=x;
    	if(son[x]==-1) return;
    	build2(son[x],x,tp);
    	for(auto y: v[x]){
    		if(y==f||y==son[x]) continue;
    		build2(y,x,y);
    	}
    }
    int query(int x,int y){
    	int ans=0;
    	while(top[x]!=top[y]){
    		if(dep[top[x]]<dep[top[y]]) swap(x,y);
    		ans+=T.ask(1,dfn[top[x]],dfn[x]);
    		ans%=P;
    		x=fa[top[x]];
    	}
    	if(dep[x]>dep[y]) swap(x,y);
    	ans+=T.ask(1,dfn[x],dfn[y]);
    	ans%=P;
    	return ans;
    }
    void update(int x,int y,int k){
    	k%=P;
    	while(top[x]!=top[y]){
    		if(dep[top[x]]<dep[top[y]]) swap(x,y);
    		T.change(1,dfn[top[x]],dfn[x],k);
    		x=fa[top[x]];
    	}
    	if(dep[x]>dep[y]) swap(x,y);
    	T.change(1,dfn[x],dfn[y],k);
    }
    int querytree(int x){
    	return T.ask(1,dfn[x],dfn[x]+siz[x]-1);
    }
    void updatetree(int x,int k){
    	T.change(1,dfn[x],dfn[x]+siz[x]-1,k);
    }
    
    T.build(1,1,n)
    build1(root,0);
    build2(root,0,root);
    ```
