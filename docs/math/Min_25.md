# Min_25 筛

## 引入

首先这个算法是为了解决求解积性函数求前缀和： $\sum_{i=1}^n f(i)$ 解决的。

其有两个前提:

* 所有的 $f(p)$ 必须能否被表达为一个类似 $a+bp+cp^2 \dots$ 。
* 所有的 $f(p^e)$ 在知道 $p,e,p^e$ 的情况下能够快速求出 $f$。

其算法的大致思路就是分成 质数 和 合数 分别解决，如下：

$$
\sum_{i=1}^{n} f(i) = \sum_{p \le n} f(i) + \sum_{p^e \le n} f(p^e) \left ( \sum_{j\le \frac{n}{p^e}, mp>p} f(j) + [e\neq1]\right)
$$

（$mp$ 表示 $j$ 的最小质因子）

第一部分十分好理解；而第二部分意思就是 $p^e$ 枚举其质因子，那么合数就可以表示为 $p^e \cdot j$，当然由于 $gcd(p^e, j)$ 必须等于 $1$ ，同时满足不能算重，因此需要要求 $j$ 中不能包含 $p$ ，相当于 $mp>p$ 。

因此我们分成两部分完成： 质数, 合数。

## 质数部分

这里目前我们的目标是求出对于所有质数的前缀和，但是 $1$ ~ $n$ 的质数筛都筛不出来。

我们令 $g(i, j)$ 表示从 $1$ ~ $i$ 中所有 $x$ 满足 "$x$ 是质数 或 $x$ 的最小质因子大于 $pri_j$" 的 $x^k$ 的和。

此时这个 $x^k$ 就和质数位置的 $f$ 中的某一项相同，并且 $x^k$ 是一个完全积性函数。

那么我们尝试找出 $g(i, j)$ 和 $g(i, j-1)$ 的关系。相当与从 $g(i, j-1)$ 中取出那些最小质因子等于 $pri_j = p_j$ 的合数。

那么其实就是剔除了一个 $p_j$ 之后质因子大于等于 $p_j$ 的数。

$$
g(i, j) = g(i, j-1) - p_j ^ k \left( g(\frac{i}{p_j}, j-1) - g(pri_{j-1}, j-1) \right)
$$

（后面那个 $g$ 是为了去除所有质数）

然后后面的那个 $g$ 就相当于前 $j-1$ 个质数的 $k$ 次方和。后面命名为 $s(x)$

但是这个 $g$ 还是很大阿，首先 $j\le \sqrt i$ 因为 $p_j \le \sqrt i$ （最小质因子性质），并且对于 $i$ 一直都是除去 $p$ ，因此其真实只有 $\sqrt n$ 个取值 ，可以写一个离散化。这里真实跑下来是比较快的。

此时如果距离 $\sqrt n$ 最近的 $p$ 是第 $x$ 个质数，那么 $1$ ~ $n$ 中质数 $k$ 次方前缀和就是 $g(n, x)$ 。

然后把每一个 $k$ 对应的 $g$ 加上系数就是真实的我们求解的前缀和，这里，命名为 $d(x) = a~g_0(x) + b~g_1(x) + c~g_2(x) \dots$ 。

## 合数部分

此时我们令 $S(n, x)$ 表示对于 $1$ ~ $n$ 中的数，其最小质因子大于 $pri_x$ 的函数和。

那么同样枚举最小质因子 $p$ ，就可以得到：

$$
S(n, x) = d(n) - s(x) + \sum_{k > x, p_k^e \le n} f(p_k^e) ~\left( S(\frac{n}{p^e}, x) + [e \neq 1] \right)
$$

这里这个 $[e \neq 1]$ 和上面相同，因为 $p^e, e>1$ 也是合数。

可以发现，$S(n, 0)$ 就是答案，递归求解即可。

## 代码实现

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
/*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
const int inv2 = 500000004, inv3 = 333333336;
const int N = 2e5+5, mod = 1e9+7;

/*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
inline int norm_mut(int& x) { return x = (x%mod+mod)%mod; }
inline int norm(int x) { return (x%mod+mod)%mod; }

namespace Min_25 {
    int n, b;

    bitset<N> vis;
    int tot, pri[N];

    int val[N];
    int s1[N], s2[N]; // 质数前缀和
    int g1[N], g2[N];

    int cnt, val1[N], val2[N]; // 所有可能产生的数
    int& id(int x) {
        if(x < b) return val1[x];
        else return val2[n/x];
    }

    void build(int m) {
        n=m, b=sqrt(m);

        for(int i=2; i<=b; i++) {
            if(vis[i] == 0) {
                pri[++tot] = i;
                norm_mut( s1[tot] = s1[tot-1] + i );
                norm_mut( s2[tot] = s2[tot-1] + i*i%mod );
            }

            for(int j=1; j<=tot; j++) {
                if(i * pri[j] > b) break;
                vis[i * pri[j]] = 1;
                if(i % pri[j] == 0) break;
            }
        }

        // Min_25 Main

        for(int l=1, r; l<=m; l=r+1) {
            r = min(m, (m / (m/l)));
            int i = (id(m/l) = ++cnt), j = (m/l)%mod;
            val[cnt] = m/l; // ! 注意以下这里不能 %mod

            norm_mut( g1[i] = j * (j+1)%mod * inv2%mod - 1 );
            norm_mut( g2[i] = j * (j+1)%mod * (2*j+1)%mod * inv3%mod * inv2 %mod - 1 );
        }

        for(int i=1; i<=tot; i++) {
            int p = pri[i];
            for(int j=1; j<=cnt && p*p <= val[j]; j++) {
                int k = id(val[j] / p);
                norm_mut( g1[j] -= p * (g1[k] - s1[i-1]) %mod );
                norm_mut( g2[j] -= p * p %mod * (g2[k] - s2[i-1]) %mod );
            }
        }
    }

    int f(int x) { return norm(x*x%mod - x); }

    int S(int n, int x) {
        if(n <= pri[x]) return 0;
        int k = id(n);
        int ans = norm((g2[k]-g1[k]) - (s2[x]-s1[x]));
        for(int i=x+1; i<=tot && pri[i]*pri[i] <= n; i++) {
            for(int e=1, pe=pri[i]; pe<=n; e++, pe*=pri[i]) {
                norm_mut( ans += f(pe%mod) * (S(n/pe, i) + (e != 1)) %mod );
            }
        }
        return ans;
    }
};
/*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
signed main() {
    int n; cin>>n;
    Min_25::build(n);
    cout<<Min_25::S(n, 0)+1<<'\n'; // 这里 +1 是因为前面没有算 f(1)
    return 0;
}
```