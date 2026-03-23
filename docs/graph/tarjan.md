# Tarjan

这里给出 `dfn[]` 的定义。

??? definition "dfn[] 定义"
    `dfn[]` 为图遍历时的时间辍。

这里在给出 `low[]` 的定义：

??? definition "low[] 定义"
    `low[x]` 为下面可选节点的时间辍的最小值。
    
    1. `x` 子树中的节点
    2. 通过一条不再搜索树上的节电，能够到达 `x` 的子树的介电节点。
    
    及：
    
    对于节点 `x` 的相邻节点 `y`:
    
    0. `low[x]=dfn[x]`
    1. 若 `x` 是 `y` 的搜索树上的父节点：`low[x]=min(low[x],low[y])`
    2. 边 `(x,y)` 不是搜索树上边：`low[x]=min(low[x],dfn[x])`

## 无向图联通性

### 判割点

**定义**

对于一个无向连通图，如果一个点去掉之后，会分裂成多个联通块，则称这个

**做法**

先给出结论，对于一个节点 `x`，如果有 `x` 的子节点 `y`：

`dfn[x]<=low[y]`

则 `x` 为割点。

**证明**

如下图：

![69143c775a736.png (630×607)](https://youke1.picui.cn/s1/2025/11/12/69143c775a736.png)

如果 `X` 不是割点，则一定没有黄色的这条边，则 `low[x]<=dfn[y]`。

这里因为是 `<=`，所以可以不用考虑访问到父亲节点的问题，而下面的割边则不同。

??? code "CODE"
    ```cpp
    void Tarjan(int x){
    	dfn[x]=low[x]=++idx;
    	int flag=0;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!dfn[y]){
    			Tarjan(y);
    			low[x]=min(low[x],low[y]);
    			if(low[y]>=dfn[x]){
    				flag++;
    				if(x!=root||flag>1)
    					cnt[x]=1;
    			}
    		}else
    		low[x]=min(low[x],dfn[y]);
    	}
    }
    for(int i=1;i<=n;i++){
        if(!dfn[i]){
            root=i;
            Tarjan(i);
        }
    }
    ```

### 求割边

对于边 `e`, 如果删除这条边后，图中出现了多个不相邻的子图，则称 `x` 为这个图的割边。

易证，当存在一个 `x` 的子节点 `y` 满足：`dfn[x] < low[y]`。

需要注意的是我们需要盘是否原路返回（不算重边）

??? code "CODE"
    ```cpp
    int tot=1;
    void add(int a,int b){
    	ver[++tot]=b;
    	nxt[tot]=head[a],head[a]=tot;
    }
    void Tarjan(int x,int edge){
    	dfn[x]=low[x]=++idx;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!dfn[y]){
    			Tarjan(y,i);
    			low[x]=min(low[x],low[y]);
    			if(low[y]>dfn[x])
    				c[++iteam]={x,y};
    		}else if(i!=(edge^1))
    		low[x]=min(low[x],dfn[y]);
    	}
    }
    for(int i=1;i<=n;i++){
        if(!dfn[i]){
            root=i;
            Tarjan(i,0);
        }
    }
    ```

### 双连通分量

??? definition "定义（来自 OI-Wiki）"
    在一张连通的无向图中，对于两个点 $u$ 和 $v$，如果无论删去哪条边（只能删去一条）都不能使它们不连通，我们就说 $u$ 和 $v$ **边双连通**。
    
    在一张连通的无向图中，对于两个点 $u$ 和 $v$，如果无论删去哪个点（只能删去一个，且不能删 $u$ 和 $v$ 自己）都不能使它们不连通，我们就说 $u$ 和 $v$ **点双连通**。
    
    边双连通具有传递性，即，若 $x,y$ 边双连通，$y,z$ 边双连通，则 $x,z$ 边双连通。
    
    点双连通 **不** 具有传递性，反例如下图，$A,B$ 点双连通，$B,C$ 点双连通，而 $A,C$ **不** 点双连通。
    
    ![bcc-counterexample.png](https://oi-wiki.org/graph/images/bcc-0.svg)
    
    对于一个无向图中的 **极大** 边双连通的子图，我们称这个子图为一个 **边双连通分量**。
    
    对于一个无向图中的 **极大** 点双连通的子图，我们称这个子图为一个 **点双连通分量**。

**CODE：**（v-DCC）

因为我们发现两个 `v-DCC` 重叠的区域一定是一个**割点**，所以我们只需要在求割点的代码内加入一个出入栈，记录的过程即可。

??? code "CODE (v-DCC)"
    ```cpp
    void Tarjan(int x){
    	dfn[x]=low[x]=++idx;
    	st[++top]=x;
    	if(!head[x]){
    		v[++cnt].push_back(x);
    		return;
    	}
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!dfn[y]){
    			Tarjan(y);
    			low[x]=min(low[x],low[y]);
    			if(low[y]>=dfn[x]){
    				int z;cnt++;
    				while(1){
    					z=st[top--];
    					vdcc[z]=cnt;
    					v[cnt].push_back(z);
    					if(z==y) break;
    				}
    				v[cnt].push_back(x);
    			}
    		}else
    		low[x]=min(low[x],dfn[y]);
    	}
    }
    ```

**CODE：**(e-DCC)

我们发现 `e-DCC`，我们发现如果 `dfn[x] = low[x]`, 及 `x` 本身即是 `x` 的搜索子树可达到的 **DFS 序** 最小的节点。

这是除去以前已经分配了的元素，剩下在栈里面的一定是一个 `e-DCC`。

但是我们可以发现 `e-DCC` 其实就是除去了所有的**割边**后留下的连通块，也可以先处理完割边在处理。

??? code "CODE (e-DCC)"
    ```cpp
    void Tarjan(int x,int edge){
    	dfn[x]=low[x]=++idx;
    	st[++top]=x;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!dfn[y]){
    			Tarjan(y,i);
    			low[x]=min(low[x],low[y]);
    		}else if(i!=(edge^1))
    		low[x]=min(low[x],dfn[y]);
    	}
    	if(dfn[x]==low[x]){
    		int y;cnt++;
    		do{
    			y=st[top--];
    			edcc[y]=cnt;
    			v[cnt].push_back(y);
    		}while(x!=y);
    	}
    }
    ```

## 有向图的连通性

### 强连通分量

对于一个有向图，如果其中每两个点都可以互相到达，则称这个图为**强连通图**。

而一个有向图的子图如果是**强连通图**，则称这个子图为**强连通分量**

做法和前面的差不多，满足条件 `dfn[x] = dfn[y]`。

如下图，图中黄色，红色的边都会使 `low[x] < dfn[x]`，

因而这个中间的节点一定不是他所在的 `scc` 的最先访问的节点。

因而把当前在栈里面的元素都标记一下即可

![](https://youke1.picui.cn/s1/2025/11/13/6915235530e09.png)

??? code "CODE"
    ```cpp
    void Tarjan(int x){
    	dfn[x]=low[x]=++idx;
    	ins[x]=1;
    	st[++top]=x;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!dfn[y]){
    			Tarjan(y);
    			low[x]=min(low[x],low[y]);
    		}else if(ins[y])
    		low[x]=min(low[x],dfn[y]);
    	}
    	if(dfn[x]==low[x]){
    		int y;cnt++;
    		do{
    			y=st[top--];
    			scc[y]=cnt;
    			ins[y]=0;
    			siz[cnt]++;
    			b[cnt]+=a[y];
    		}while(y!=x);
    	}
    }
    ```

### 缩点

有向图的缩点我觉得用处十分的大，因为它可以用来解决 **2 - SAT 问题**，当然代码和无向图的缩点差不多：

??? code "CODE"
    ```cpp
    for(int x=1;x<=n;x++){
        for(int i=head[x];i;i=nxt[i]){
            int y=ver[i];
            if(scc[x]==scc[y]) continue;
            v[scc[x]].push_back(scc[y]);
            d[scc[y]]++;
        }
    }
    ```
