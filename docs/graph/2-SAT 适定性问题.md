# 2 - SAT 适定性问题

## 解决问题可食用范围

有 $n$ 个非 0 及 1 的变量 $a_i$，满足以下 $m$ 个条件：

!!! question "问题描述"
    如果 $a_i$ 为 $x$，则 $a_j$ 为 $y$。

## 解决思路

我们仍然要先将其转化为 **图论问题**，首先我们把每一个 $a_i$ 分成两个点：$i_1$，$i_2$，表示是否满足 $a_i = 0$，$a_i = 1$。

对于一条边 $(u_x,v_y)$，表示如果 $a_u = x$ 则 $a_v$ 为 $y$ 。

比如对于边 $(1_0,2_1)$ （这里 $x_y$ 表示 $a_x$ 是否为 $y$ 的这个短板），表示如果 $a_1$ 为 $0$ ，那么 $a_2$ 为 $1$

然后我们就可以建出一个有向图。

???+ example "示例输入"
    ```
    4 8
    1 0 2 1
    4 0 2 1
    3 0 1 1
    1 1 3 1
    3 1 4 1
    4 1 1 1
    2 0 3 1
    2 1 3 0
    ```

![69152cc012639.png (355×428)](https://youke1.picui.cn/s1/2025/11/13/69152cc012639.png)

我们可以发现：

1. 如果两个属于同一元素的节点在一条链上时，越靠近末尾的就是答案。

2. 且对于在一个 `scc` 内的元素，他们要不是同时满足，要不是都不满足，所以如果同一元素的两个点在一个 `scc` 中，一定无解

3. 拓扑排序值越大则约有可能

那肯定有 **聪明的小朋友们** 发现了，这样模拟上面的图，答案是 `1 1 1 1`，这也不对，答案是这个图画错了

我们知道如果：

$$
p \Rightarrow q
$$

则称 $p$ 为 $q$ 的充分条件，$q$ 为 $p$ 的必要条件，因而满足：

$$
\neg q \Rightarrow \neg p
$$

所以我们把这样的几条边连上：

![屏幕截图 2025-11-13 093122.png](https://youke1.picui.cn/s1/2025/11/13/691534cc62fe0.png)

就只有两个 `scc` 了，我们显然要满足上面的，及答案为 `1011`。

所以我们不仅要连正边，也要连反边。

???- code "CODE"
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    const int N=4e6+5,M=4e6+5;
    int n,m;
    int ins[N];
    int st[N],top;
    int cnt,edcc[N];
    int idx,dfn[N],low[N];
    int tot=1,head[N],ver[M<<1],nxt[M<<1];
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    void add(int a,int b){
    	ver[++tot]=b;
    	nxt[tot]=head[a],head[a]=tot;
    }
    void Tarjan(int x){
    	dfn[x]=low[x]=++idx;
    	st[++top]=x,ins[x]=1;
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
    			edcc[y]=cnt;
    			ins[y]=0;
    		}while(y!=x);
    	}
    }
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    signed main(){
    	cin>>n>>m;
    	while(m--){
    		int i,a,b,j;
    		cin>>a>>i>>b>>j;
    		add(a+(n*i),b+(n*j));
    		add(b+(n*(j^1)),a+(n*(i^1)));
    	}
    	for(int i=1;i<=2*n;i++)
    		if(!dfn[i])
    			Tarjan(i);
    	for(int i=1;i<=n;i++)
    		if(edcc[i]==edcc[i+n]){
    			cout<<"IMPOSSIBLE";
    			return 0;
    		}
    	cout<<"POSSIBLE\n";
    	for(int i=1;i<=n;i++) cout<<(edcc[i]>edcc[i+n])<<' ';
    	return 0;
    }
    /*这个代码并非 P4782【模板】2-SAT*/
    ```

## 扩展

一般的题问你是否有解，或者有 **SPJ**。

如果需要你判断不确定，就需要用上面的判断是否在一条链上，否则不知道：

???- code "扩展 CODE"
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    const int N=4005,M=10005;
    int n,m;
    int d[N];
    int vis[N];
    int dis[N];
    int ins[N];
    int st[N],top;
    int cnt,scc[N];
    int idx,dfn[N],low[N];
    int tot,head[N],ver[M<<1],nxt[M<<1];
    vector<int> v[N];
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    void add(int a,int b){
    	ver[++tot]=b;
    	nxt[tot]=head[a],head[a]=tot;
    }
    void Tarjan(int x){
    	dfn[x]=low[x]=++idx;
    	st[++top]=x,ins[x]=1;
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
    		}while(y!=x);
    	}
    }
    void dfs(int x,int fa){
    	vis[x]=1;
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(vis[y]) continue;
    		dfs(y,x);
    	}
    }
    bool check(int x){
    	memset(vis,0,sizeof vis);
    	dfs(x,0);
    	for(int i=1;i<=n;i++)
    		if(vis[i]&&vis[i+n])
    			return 0;
    	return 1;
    }
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    signed main(){
    	ios::sync_with_stdio(0);
    	cin.tie(0),cout.tie(0);
    	cin>>n>>m;
    	for(int i=1;i<=m;i++){
    		int a,b;char c,d;
    		cin>>a>>c>>b>>d;
    		int p1=(c=='Y'),p2=(d=='Y');
    		add(a+n*(p1^1),b+n*p2);
    		add(b+n*(p2^1),a+n*p1);
    	}
    	for(int i=1;i<=2*n;i++)
    		if(!dfn[i])
    			Tarjan(i);
    	for(int i=1;i<=n;i++)
    		if(scc[i]==scc[i+n]){
    			cout<<"IMPOSSIBLE";
    			return 0;
    		}
    	for(int x=1;x<=2*n;x++){
    		for(int i=head[x];i;i=nxt[i]){
    			int y=ver[i];
    			if(scc[x]==scc[y]) continue;
    			v[scc[x]].push_back(scc[y]);
    			d[scc[y]]=0;
    		}
    	}
    	for(int i=1;i<=n;i++){
    		if(check(i)&&check(i+n)) cout<<'?';
    		else if(scc[i]<scc[i+n]) cout<<'N';
    		else cout<<'Y';
    	}
    	return 0;
    }
    ```

注意会退化为 $\mathcal O(N^2)$
