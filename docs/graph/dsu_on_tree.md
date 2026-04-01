# 树上启发式合并

简称 "dsu on tree"

??? warning "缩写注意"
    "dsu" 是 "并查集" 的缩写。

    而 "dsu on tree" 是树上信息合并的一种策略。

    两种并没有直接联系。~~（除非你硬说他们都是合并）~~

我们假设需要处理一个问题：

这个问题需要我们对于每一个子树统计答案，而现在需要对于每一颗子树都要把他们的子树节点放入一个数据结构里面，而这个数据结构支持快速的 增，删（也可以是回退）。

此时，传统的做法就是对于每一个子树都遍历一遍，然后统计答案。

但是有一个简单的思路就可以简化时间复杂度： 我们对于当前枚举到的节点，我们直接继承他中儿子计算的到的数据，然后在暴力加入剩下的轻儿子的所有节点。

???+ info "时间复杂度证明"
    首先通过重链剖分的性质： 任意节点到 root 最多经过 $\log n$ 条重边。

    然后对于每一个节点，如果当前计算的 root 到的路径他有至少一个重边，那么就一定会被计算一次。

    所以总共会加入大概 $\mathcal O(N \log N)$ 此，时间复杂度得证。


???+ note "例题: [CF741D](https://vjudge.net/problem/CodeForces-741D)"
    我们发现对于一个字符串，其能否组成一个回文串，此时一定满足只有一种字母数量为奇数。

    所以我们令 $c_x$ 为从 $root$ 到 $x$ 的路径上字母的奇偶性（状压存储）。

    然后如果 $(x,y)$ 的路径满足条件 $c_x \oplus c_y$ 至多只有一个 $1$ 。

    （因为 $lca$ 往上的信息都互相抵消了，只剩下路径上的）。

    所以 dsu on tree 此时需要处理的东西就是每一刻子树中对于每一种奇偶性的路径的最大升读。

    然后就是一个 dsu on tree 模板了。

    ```cpp
    #include <bits/stdc++.h>
    using namespace std;
    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
    const int N=5e5+5,M=(1<<22)+5;
    int n;
    int c[N],fa[N];
    vector<int> v[N];
    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/

    int dep[N];
    int idx,dfn[N],rnk[N];
    int siz[N],son[N];
    void build(int x){
        siz[x]=1;
        dfn[x]=++idx;
        rnk[idx]=x;
        dep[x]=dep[fa[x]]+1;
        c[x]^=c[fa[x]];
        for(auto y: v[x]){
            if(y==fa[x]) continue;
            build(y);
            siz[x]+=siz[y];
            if(son[x]==0 || siz[son[x]]<siz[y]) son[x]=y;
        }
    }

    int now=0;
    int t[M],ans[N];
    void Getans(int x,int top){
        now=max(now,t[c[x]]+dep[x]-2*dep[top]);
        for(int i=0;i<22;i++)
            now=max(now,t[c[x]^(1<<i)]+dep[x]-2*dep[top]);
    }
    void update(int x){
        t[c[x]]=max(t[c[x]],dep[x]);
    }

    void solve(int x,bool opt){ // 是否继承
        for(auto y: v[x]){
            if(y!=fa[x] && y!=son[x]){
                solve(y,0);
                ans[x]=max(ans[x],ans[y]);
            }
        }
        if(son[x]){
            solve(son[x],1);
            ans[x]=max(ans[x],ans[son[x]]);
        }
        for(auto y: v[x]){
            if(y==son[x]) continue;
            for(int i=dfn[y];i<=dfn[y]+siz[y]-1;i++)
                Getans(rnk[i],x);
            for(int i=dfn[y];i<=dfn[y]+siz[y]-1;i++)
                update(rnk[i]);
        }

        Getans(x,x);
        ans[x]=max(ans[x],now);
        update(x);

        if(opt==0){
            now=0;
            for(int i=dfn[x];i<=dfn[x]+siz[x]-1;i++)
                t[c[rnk[i]]]=-0x3f3f3f3f;
        }
            
        
    }

    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
    signed main(){
        cin>>n;
        for(int i=2;i<=n;i++){
            cin>>fa[i];
            v[fa[i]].push_back(i);
            char ch;cin>>ch;
            c[i]=(1<<(ch-'a'));
        }

        memset(t,-0x3f,sizeof t);

        build(1);
        solve(1,0);

        for(int i=1;i<=n;i++) cout<<ans[i]<<' ';


        return 0;
    }
    ```
    