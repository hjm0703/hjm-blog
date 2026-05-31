# FFT

> 由于不想写数学章节的总结，所以 FFT 就放在杂项了

## 问题引入

!!! question "示例问题"

    给定一个 $n$ 次多项式 $F(x)$，和一个 $m$ 次多项式 $G(x)$。

    请求出 $F(x)$ 和 $G(x)$ 的乘积。

这里如果我们暴力去做就是 $\mathcal O(n m)$ 的，但是貌似这里已经没有更好的办法了。

但是，如果题目提供的是 "两个多项式上相同 $x$ 下的多个点" （这里被称作 **"点表示法"**） 那么对于在两个多项式上的两个点 $(x, F(x)), (x, G(x))$ ，他们在乘积多项式上的点就直接是 $(x, F(x)\cdot G(x))$ ，只需要 $\mathcal O(n+m+1)$ 就可以求解。

于是现在的问题就变成了需要把原来的多项式转化为 **"点表示法"** 然后合并之后快速切换回去。

**Step 1：** 考虑如何转化过去，我们发现此时就算我们随机找 $n + m + 1$ 个点也需要 $\mathcal O\left((n+m+1)^2\right)$ ，但是由于选择任意不同点都是一样的，所以可以考虑选择一些特殊点进行计算。

**Step 2：** 考虑如何转化回去，首先有一个结论，对于一个 $n$ 次多项式，需要至少 $n+1$ 个点就能确定它，既然我们通过 **Step 1** 已经求出这 $n+1$ 个点了，那么一定可以做出来。而最直观的办法就是使用高斯消元，但是时间复杂度 $\mathcal O(n^3)$ 。

所以现在两个步骤都是不能直接使用前面的办法解决的，这时候就需要使用 $\texttt{FFT}$ 。

## 复数

关于 **Step 1** 我们不是需要找到 $n+1$ 个特殊点吗，所以这里我们可以使用性质良好的 **复数** 作为特殊点。

当然对于这个多项式，他当然支持 **复数**， 并且 **Step 2** 的那个结论仍然存在。

### 复数运算

**加法** $(a + b i) + (c+di) = (a+c) + (b+d)i$ ，在几何意义中就是和向量加法相同。

**乘法** $(a+bi)\times (c+di) = (ac - bd) + (ad + bc)i$ ，在几何意义中就是复平面上角度相加，长度相乘。

### 单位根

我们在复平面上画一个单位圆，然后均分这个园到 $n$ 份，然后每两份之间的交界点就是一个单位根，使用 $w_n^k$ ，图示如下：

![](images/image9.png)

此时有以下性质：

- $w_n^k = \left( cos(\frac{k \cdot 2\pi}{n}), sin(\frac{k \cdot 2\pi}{n}) \right)$

- $w_n^k = w_{2n}^{2k}$

- $w_n^k = w_n^{k+n}$

- $w_n^{k + n / 2} = -w_n^{k}$

- $w_n^{a+b} = w_n^{a} * w_n^{b}$

## FFT

现在终于到真正的 **FFT** 了，这里我们令一个多项式 $f(x) = \sum_{i=0}^{n-1} a_i x^i$ 。

我们考虑求出对于 $f(w_n)，k \in [0, n)$ ，那么这里我们考虑分成两个子问题：

- $f_1(x) = a_0 + a_2 x + a_4 x^2 + \dots + a_{n-2} x^{\frac{n}2 -1}$ 。

- $f_2(x) = a_1 + a_3 x + a_4 x^2 + \dots + a_{n-1} x^{\frac{n}{2}-1}$

那么不难发现: $f(x) = f_1(x^2) + x * f_2(x^2)$ 。

那么把特殊点 $w_n$ 带入：

$$
f(w_n^k) = f_1((w_n^k)^2) + w_n^k \times f_2((w_n^k)^2)
$$

此时分为两种情况：

1. $0\le k < \frac{n}{2}$ : $f(w_n^k) = f_1(w_n^{2k}) + w_n^k \times f_2(w_n^{2k}) = f_1(w_{n/2}^k) + w_n^k \times f_2(w_{n/2}^{k})$

1. $\frac{n}{2} \le \frac{n}{2} + k < n$ : $f(w_n^{k+\frac{n}{2}}) = f_1(w_n^{2k+n}) + w_n^{k+\frac{n}{2}} \times f_2(w_n^{2k+n}) = f_1(w_{n/2}^k) - w_n^k \times f_2(w_{n/2}^{k})$

所以我们发现这两个式子居然只有中间的符号不一样, 于是现在两个问题被分成了来嗯个规模相同的子问题。只需要递归下去。

然后当问题规模为 $1$ 的时候直接结束，总共时间复杂度 $\mathcal O(n \log n)$ 。

## IFFT

这里我们已经得到了 $c = (c_0, c_1, c_2, /dots, c_{n-1})$ ，然后我们考虑对于 $f(x) = \sum_{i=1}^{n-1} c_i x^i$ 求解他的 FFT : $d = (d_0, d_1, d_2, /dots, d_{n-1})$ 。

所以可以发现:

$$
d_k = f(W_n^{-k})
$$

$$
= \sum_{i=0}^{n-1} c_i(W_n^{-k})^i
$$

$$
= \sum_{i=0}^{n-1} c_i(W_n^{-k})^i
$$

$$
= \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} a_j (W_n^{i})^j (W_n^{-k})^i
$$

$$
= \sum_{j=0}^{n-1} a_j \sum_{i=0}^{n-1} (W_n^{j-k})^i
$$

$$
= \sum_{j=0}^{n-1} a_j \frac{1 - (W_n^{j-k})^{n}}{1-W_n^{j-k}}
$$

$$
= \sum_{j=0}^{n-1} a_j \frac{1 - (W_n^n)^{j-k}}{1-W_n^{j-k}}
$$

所以只有 $j = k$ 时，所以 $d_i = n \cdot a_i$ ， 那么 $a_i = \frac{d_i}n$ 。

??? success "递归版代码"
    
    ```cpp
    #include <bits/stdc++.h>
    using namespace std;

    typedef complex<double> com;
    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
    const int N = 1e6+5, PI = acos(-1);
    int n, m;
    vector<com> a, b, c;
    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/

    void FFT(int n, vector<com>& v, bool invert) {
        if(n == 1) return ;
        
        int mid = n>>1;
        vector<com> al(mid+1), ar(mid+1);
        for(int i=0; i<mid; i++) 
            al[i] = v[i<<1], ar[i] = v[i<<1|1];

        FFT(mid, al, invert), FFT(mid, ar, invert);

        com j(1, 0);
        com step(cos(2*M_PI / n), sin(2*M_PI / n * (invert ? -1 : 1)));
        for(int i=0; i<mid; i++, j = j*step) {
            v[i] = al[i] + j*ar[i];
            v[i+mid] = al[i] - j*ar[i];
        }
    }
    
    /*~~~~~~~~~~~~~~~~~~~~ Boundary Line ~~~~~~~~~~~~~~~~~~~~*/
    signed main() {
        cin>>n>>m; n++, m++;

        a.resize(n+1), b.resize(m+1);

        for(int i=0; i<n; i++) cin>>a[i];
        for(int i=0; i<m; i++) cin>>b[i];

        int mxn = n+m-1, t=1;
        while(t <= mxn) t<<=1;
        a.resize(t+1), b.resize(t+1);
        c.resize(t+1);

        FFT(t, a, 0), FFT(t, b, 0);
        for(int i=0; i<t; i++) c[i]=a[i]*b[i];
        FFT(t, c, 1);
        
        for(int i=0; i<mxn; i++) cout<< (int)round(c[i].real()/t) <<' '; 
        return 0;
    }
    ````

## NTT

首先我们发现 FFT 有一个巨大的问题，其不能取膜，如果题目就是要求你取膜应当如何是好。

所以这里我们引入几个概念：

**价:** 在模 $p$ 下，如果 $a^x \equiv 1 \mod p$， 那么称 $x$ 为 $a$ 在 $p$ 下的价，记作 $|a|$ 。

**原根 $g$ :** 对于 $|g| = \varphi(p)$ ， 那么称 $g$ 为 $p$ 下的原根。对于 $p$ 为质数的情况，其一定有原根，其原根满足 $g^{p-1} \equiv 1 \mod p$ 。

然后我们现在实际上就是要选择一个单位根，满足前面的那些性质，这里我们选择单位根为 $g^{\frac{p-1}{n}}$ ，那么此时 $w_n^k = \left(g^{\frac{p-1}{n}}\right)^k$ 。

此时我们验证以下各个性质

