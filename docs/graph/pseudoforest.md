# 基环树

**基环树** 本质上就是在树上多了一条边。

而 **基环树森林** 本质上就是在每一颗树上多了一条边

**基环树** 问题有两种解决思路：

## 拆边

我们先找到那个环上的一条边，然后将其删去，按照树的方式处理。

最后在把边加上合并

像是这道题：**[P2607 骑士 - 洛谷](https://www.luogu.com.cn/problem/P2607)**

我们先把那多出来的一条边删除，然后以两个点位根跑树上 DP。

重要的是如何合并，我们需要考虑这条边的两个点选货不选的情况，最后合并最大值：

??? code "CODE"
    ```cpp
    #include<bits/stdc++.h>
    #define int long long
    #define PII pair<int,int>
    using namespace std;
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    const int N=4e6+5;
    int n;
    int cnt;
    int c[N];
    int f[N][2];
    int fa[N];
    PII l[N];
    int tot,head[N],nxt[N<<1],ver[N<<1];
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    void add(int a,int b){
    	ver[++tot]=b;
    	nxt[tot]=head[a],head[a]=tot;
    }
    int find(int x){
    	if(x==fa[x]) return x;
    	return fa[x]=find(fa[x]);
    }
    void dfs(int x,int fa,int t){//表示 to 这个点的骑士不能参见骑士团
    	f[x][0]=0;
    	if(x==t) f[x][1]=-0x3f3f3f3f;
    	else f[x][1]=c[x];
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(y==fa) continue;
    		dfs(y,x,t);
    		f[x][0]+=max(f[y][0],f[y][1]);
    		if(x!=t) f[x][1]+=f[y][0];
    	}
    }
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    signed main(){
    	ios::sync_with_stdio(0);
    	cin.tie(0),cout.tie(0);
    	cin>>n;
    	for(int i=1;i<=n;i++)
    		fa[i]=i;
    	for(int i=1;i<=n;i++){
    		int a,b;cin>>a>>b;
    		c[i]=a;
    	    int xa=find(i),xb=find(b);
    		if(xa==xb)
    			l[++cnt]=make_pair(i,b);
    		else
    			add(i,b),add(b,i);
    		fa[xa]=xb;
    	}
    	int ANS=0;
    	for(int i=1;i<=cnt;i++){
    		int ans=0;
    		dfs(l[i].first,-1,-1);
    		ans=f[l[i].first][0];
    		dfs(l[i].first,-1,l[i].second);
    		ans=max(ans,max(f[l[i].first][0],f[l[i].first][1]));
    	    ANS+=ans;
    	}
    	cout<<ANS;
    	return 0;
    }
    ```

## 留下环

像是下面这个图

![屏幕截图 2025-11-13 104140.png](https://youke1.picui.cn/s1/2025/11/13/6915454cc3d1c.png)

我们把他想象成一个环上挂着很多课树，最后直接合并。
