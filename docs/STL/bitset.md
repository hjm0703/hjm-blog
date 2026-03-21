## 基础操作

`std::bitset` 是标准库中的一个存储 `0/1` 的大小不可变容器

**头文件：**

```cpp
#include <bitset>
```

**定义：**

```cpp
bitset<N> A; \\ N 为bitset的大小
```

**基本成员函数：**

|            操作写法             |                 含义                  |        时间复杂度         |
| :-----------------------------: | :-----------------------------------: | :-----------------------: |
|              `[]`               |      访问 or 修改 某一个下标的值      |      $\mathcal O(1)$      |
|            `count()`            |         返回 `true` 的数量。          | $\mathcal O(\frac{N}{w})$ |
|             `all()`             |         检查所有位是否为 `1`          | $\mathcal O(\frac{N}{w})$ |
|             `any()`             |          检查是否存在 `1` 位          | $\mathcal O(\frac{N}{w})$ |
|            `none()`             |         检查是否所有位为 `0`          | $\mathcal O(\frac{N}{w})$ |
|             `set()`             |           所有位置变为 `1`            | $\mathcal O(\frac{N}{w})$ |
|            `reset()`            |           所有位置变为 `0`            | $\mathcal O(\frac{N}{w})$ |
|               `&`               |                按位与                 | $\mathcal O(\frac{N}{w})$ |
|               `\|`               |                按位或                 | $\mathcal O(\frac{N}{w})$ |
|               `^`               |               按位异或                | $\mathcal O(\frac{N}{w})$ |
|               `^`               |               按位取反                | $\mathcal O(\frac{N}{w})$ |
|           `<<` & `>>`           |              左移 & 右移              | $\mathcal O(\frac{N}{w})$ |
| `bitset<N>(unsigned long long)` | 把一个 64 位无符号整数转换为 `bitset` |      $\mathcal O(N)$      |

（这里的操作并非所有，只是大多数如 `flip()` 都可以直接用位运算操作 `~` 代替，但是其中有一些操作还是很有必要的，如 `count()` 如果暴力实现时间复杂的远大于直接调用）

（这里的 `w` 取决于你电脑的性能，64 位 `w` 为 `64`，32 位 `w` 为 `32`）

这里有两种理解方式：

- 把他当作一个 `bool` 数组

- 把他当作一个超级大的无符号整数

## 基本用途

**输出一个整数的二进制：**

直接 `cout<<bitset<N>(x);`，注意其中 `N` 一定是一个 `const` 类型的常量或一个整数

（这是因为 `std::bitset` 重载了输入，输出，同理也可以用 `cin>>x`，输入一个 01 字符串）

**卡长：**

`std::bitset`，时间复杂度，空间复杂度在某一些操作都会比 `bool` 数组小，可以用于卡长。

**简化代码：**

其集成了许多函数，可以在一些需要的题目中快速完成，如求解一个 `x` 的 二进制下 `1` 的个数，可以直接写成 `(bitset<N>(x)).count()`，时间复杂度近似 $\mathcal O({min(N,64)})$

## 扩展用途

**`bitset ` 优化 DP：**

比如说对于这一道题：**[P6345 [CCO 2017] 接雨滴 - 洛谷](https://www.luogu.com.cn/problem/P6345)**。

这道题虽然是紫题，但是其实难点主要是在推 DP 转移方程。

我们先不考虑 `bitset`，可以写出一份代码：

```cpp
for(int i=2;i<=n;i++){
	for(int p=n;p>=1;p--)
		for(int t=a[i];t<=m;t++)
			f[p][t]|=f[p-1][t-a[i]];
	for(int len=1;len<i;len++)
		for(int t=0;t<=m;t++)
			f[len][t]=0;
}
```

因为 DP 数组存储的是 `bool`, 我们发现如果吧把 DP 数组 `bool f[p][t]` 转化 `bitset<T> f[p]`，则现在的时间复杂的会变成 $\mathcal O(\frac {n^2m}{w})$：

```cpp
for(reg int i=2;i<=n;i++){
	for(reg int p=1;p<=n;p++)
		f[p]|=(f[p-1]<<a[i]);
	f[i-1].reset();
}
```

则现在可以通过此题。

其实简单来说，这样写仍然是在进行 **卡长**

**集合相关**

对于两个**不可重的集合**，我们将他们值当作下标存在 `bitset` 中，两个进行与操作即可快速得到他们的并集

可以看到 **[P4688 [Ynoi Easy Round 2016] 掉进兔子洞 - 洛谷](https://www.luogu.com.cn/problem/P4688)**

我们发现其实 `ans = len1+len2+len3-3*(相同元素个数)`.

我们可以将每一个区间的值按下标存储到 `bitset` 中，然后直接进行 `&` 操作，即可得到其相同元素个数。

~~然后问题就解决了？~~

我们注意到按照下标存储处理的一定是 **不可重集合**，而这一道题要求可重，所以我们需要先对其进行离散化

如对于全集为 `{1,1,2,3,3}`，处理区间集合为 `{1,2,3,3}`

存储的 `bitset` 为：

```cpp
全集： 00000000000111110
集合： 00000000000111010
        n   <-----    0
```

这个样子才能解决。

~~然后问题就解决了？~~

**与莫队结合**

还是这道题：**[P4688 [Ynoi Easy Round 2016] 掉进兔子洞 - 洛谷](https://www.luogu.com.cn/problem/P4688)**

我们发现如果每一次都重新把每一个区间存入其中，与暴力没什么两样，但是我们发现每一个区间之间有很大的重叠，所以考虑与莫队结合，这样就可以以大概为 $\mathcal O(N\sqrt{N})$ 的时间处理每一次把对应区间元素插入集合。
但是还有一点需要注意：

虽然说 `bitset` 的空间复杂度比较小，但是因为是离线，我们要求把每一次询问产生的 `bitset` 记录下来，一遍统计答案，所以 $\mathcal O(\frac{N^2}{w})$ 会炸，需要将其分为多个部分（每一个处理 `2e4` 次询问）。

???- success "完整代码"
    ```cpp
    #include <bits/stdc++.h>
    using namespace std;
    /*!@#$%^&*!@#$%^&*~~ Boundary Line ~~*&^%$#@!*&^%$#@!*/
    const int N=1e5+5,T=2e4;
    int n,m;
    int tot;
    int len[N];
    int a[N],b[N];
    int pos[N],cnt[N];
    struct asks{
        int l,r,ip;
        bool operator < (const asks x) const{
            if(pos[l]==pos[x.l]) return r<x.r;
            return l<x.l;
        }
    }op[N];
    /*!@#$%^&*!@#$%^&*~~ Boundary Line ~~*&^%$#@!*&^%$#@!*/
    bitset<N> nw,vis,ans[T+5];
    void updata(int x,int y){
        if(y==1){
            cnt[x]++;
            nw[x+cnt[x]-1]=1;
        }else{
            nw[x+cnt[x]-1]=0;
            cnt[x]--;
        }
    }
    void solve(int m){
        memset(op,0,sizeof op);
        memset(cnt,0,sizeof cnt);
        tot=0;
        for(int i=1;i<=m;i++){
            ans[i].reset();
            len[i]=0;
            for(int j=1;j<=3;j++){
                int l,r;cin>>l>>r;
                len[i]+=(r-l+1);
                op[++tot]={l,r,i};
            }
        }
        
        nw.reset(),vis.reset();
        sort(op+1,op+tot+1);
        int l=1,r=0;
        for(int i=1;i<=tot;i++){
            while(l>op[i].l) updata(a[--l],1);
            while(r<op[i].r) updata(a[++r],1);
            while(l<op[i].l) updata(a[l++],-1);
            while(r>op[i].r) updata(a[r--],-1);
            
            if(vis[op[i].ip]) ans[op[i].ip]&=nw;
            else ans[op[i].ip]=nw,vis[op[i].ip]=1;
        }
        for(int i=1;i<=m;i++){
            cout<<len[i]-3*(ans[i].count())<<'\n';
        }
    }
    /*!@#$%^&*!@#$%^&*~~ Boundary Line ~~*&^%$#@!*&^%$#@!*/
    signed main(){
        cin>>n>>m;
        int len=sqrt(n);
        for(int i=1;i<=n;i++){
            cin>>a[i];
            b[i]=a[i],pos[i]=(i-1)/len+1;
        }
        sort(b+1,b+n+1);
        for(int i=1;i<=n;i++) a[i]=(lower_bound(b+1,b+n+1,a[i])-b);
        while(m){
            if(m>T){
                solve(T);
                m-=T;
            }else{
                solve(m);
                break;
            }
        }
        return 0;
    }
    ```

**优化埃式筛**

其实就是把埃式筛的数组替换为 **bitset**，这里有一份对比的代码：


???- success "对比代码"
    ```cpp
    #include <bits/stdc++.h>
    using namespace std;
    namespace OLD{
        const int N=1e8+5;
        const int M=N/log(N)+10;
        bool v[N];
        int prime[M],tot;
        void primes(int a){
            for(int i=2;i<=a;i++){
                if(v[i]) continue;
                else prime[++tot]=i;
                for(int j=i;j<=a/i;j++) v[i*j]=1;
            }
        }
    }
    namespace NEW{
        const int N=1e8+5;
        const int M=N/log(N)+10;
        bitset<N> v;
        int prime[M],tot;
        void primes(int a){
            tot=0;
            for(int i=2;i<=a;i++){
                if(v[i]) continue;
                else prime[++tot]=i;
                for(int j=i;j<=a/i;j++) v[i*j]=1;
            }
        }
    }
    signed main(){
        {
            double st=clock();
            OLD::primes(1e8);
            double ed=clock();
            cout<<"未添加 bitset: "<<ed-st<<"ms\n";	
        }
        {
            double st=clock();
            NEW::primes(1e8);
            double ed=clock();
            cout<<"添加 bitset: "<<ed-st<<"ms\n";	
        }
        return 0;
    }
    ```