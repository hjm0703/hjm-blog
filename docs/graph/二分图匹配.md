# 二分图匹配

## 什么是二分图

??? definition "定义"
    二分图是一个没有奇环的图

这是因为二分图的点要分为左部和右部，而边只能连接左部和右部。

如果要回到原点，必然走偶数次，我们可以用染色法判断

???+ code "染色法 CODE"
    ```cpp
    void dfs(int x,int val){
    	vis[x]=val;
    	for(int i=0;i<v[x].size();i++){
    		int y=v[x][i];
    		if(vis[y]==0) dfs(y,3-val);
    		else if(vis[y]==val)
    			flag=1;
    	}
    }
    for(int i=1;i<=n;i++)
        if(!vis[i])
            dfs(i,1);
    cout<<(flag?"No":"Yes");
    ```

## 二分图最大匹配

匹配指的是一个边的集合，使其两两不公用节点。

我们发现所有的边可以连成多条链，且每一条必定为一个 `10101010101` 的匹配串，且我们可以尝试对匹配串取反

比如：

??? example "示例"
    ```
    	1+1010101
    =   1+0101010
    =    10101010
    ```

这样虽然答案不一定会增加，但不减少。

因而记录一下 `match[]` 为右边匹配左边，一直往前跳并取反。

???+ code "CODE"
    ```cpp
    bool dfs(int x){
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!vis[y]){
    			vis[y]=1;
    			if(match[y]==-1||dfs(match[y])){
    				match[y]=x;
    				return 1;
    			}
    		}
    	}
    	return 0;
    }
    int ans=0;
    memset(match,-1,sizeof match);
    for(int i=1;i<=n;i++){
        memset(vis,0,sizeof vis);
        if(dfs(i)) ans++;
    }
    cout<<ans<<'\n';
    ```

时间复杂度：$\mathcal O(NM)$。

## 应用

一般是一个位置对应一个答案，然后连接后跑二分图

如这道题：**[P1963 变换序列 - 洛谷](https://www.luogu.com.cn/problem/P1963)**

我们对每一个 `i` 连上 `i+d`，`i-d`，`i-(n-d)`，`i+(n-d)`。

然后直接跑二分图：

???+ code "CODE"
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    const int N=1e4+5,M=2e5+5;
    int n;
    int a[N];
    int ans[N];
    int match[N],vis[N];
    int tot,head[N],nxt[M],ver[M];
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    void add(int a,int b){
    	ver[++tot]=b;
    	nxt[tot]=head[a],head[a]=tot;
    }
    bool dfs(int x){
    	for(int i=head[x];i;i=nxt[i]){
    		int y=ver[i];
    		if(!vis[y]){
    			vis[y]=1;
    			if(match[y]==-1||dfs(match[y])){
    				match[y]=x;
    				ans[x]=y;
    				return 1;
    			}
    		}
    	}
    	return 0;
    }
    /*!@#$%^&*!@#$%^&*~~优美的分界线~~*&^%$#@!*&^%$#@!*/
    signed main(){
    	cin>>n;
    	for(int i=0;i<n;i++){
    		int x;cin>>x;
    		int a[4]={-1,-1,-1,-1};
    		if(i-x>=0) a[0]=i-x;
    		if(i+x<n) a[1]=i+x;
    		if(x!=n-x){
    			if(i-(n-x)>=0) a[2]=i-(n-x);
    			if(i+(n-x)<n) a[3]=i+(n-x);
    		}
    		sort(a,a+4);
    		for(int j=3;j>=0;j--)
    			if(a[j]!=-1)
    				add(i,a[j]);
    	}
    	memset(match,-1,sizeof match);
    	for(int i=n-1;i>=0;i--){
    		memset(vis,0,sizeof vis);
    		if(!dfs(i)){
    			cout<<"No Answer";
    			return 0;
    		}
    	}
    	for(int i=0;i<n;i++)
    		cout<<ans[i]<<' ';
    	return 0;
    }
    ```
