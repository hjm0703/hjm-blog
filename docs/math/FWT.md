# 快速沃尔什变换 

## 引入

首先这个 “快速沃尔什变换” 也缩写 FWT，为了解决和 FFT 类似的一类问题而生。

即一下三个问题：

$$
C_i = \sum_{j \oplus k = i} A_j \times B_k
$$


其中 $\oplus$ 是 `xor`, `and`, `or` 中的其中一种。

以下我们令 $FWT(A)$ 表示序列 FWT 变化之后得到的答案。

然后 FWT 需要做到的和 FFT 也类似，把原序列变化之后只需要按位乘法就可以得到答案。

即 $FWT(A) \cdot FWT(B) = FWT(C)$ 。

## OR FWT

首先这里我们通过或 FWT 举例。

首先 FWT 的实现可以通过 SOSDP，具体来说我们令 $FWT(A)_i = \sum_{j \in i} A_j$ ，那么可以发现：

$$
\begin{align}
FWT(A)_i \cdot FWT(B)_i &= \left(\sum_{j \in i} A_j\right) \left(\sum_{j \in i} B_j\right) \\

&= \sum_{j \in i} \sum_{k \in i} A_j \cdot B_k \\

&= \sum_{(j | k) \in i} A_j \cdot B_k \\

&= FWT(C)_i
\end{align}
$$
这里的 FWT 就是一个高维前缀和，但是为了后面的统一这里我们使用专用的蝶式变换性质。

具体来说这里采用和 FFT 类似的做法，使用分治。具体来说我们分成左右两部分依次处理，相当于一边的最大位置的二进制为 $0$ ，一边为 $1$ 。

因此我们只需要把 $1$ 的那一边全部加上 $0$ 的那一边就可以了。

对于逆变换类比 SOSDP，重新减去就可以了。

```cpp
namespace FWT {
    inline void OR(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1)
            for(int i=0; i<n; i += (len<<1))
                for(int j=0; j<len; j++)
                    (a[i+j+len] += 1ll * a[i+j] * sign + mod) %= mod;
    }
}
```

## AND FWT

这里道理相同，令 $FWT(A)_i = \sum_{i \in j} A_j$ ，同样可以使用 SOSDP。当然平时的代码：

```cpp
namespace FWT {
    inline void AND(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1)
            for(int i=0; i<n; i += (len<<1))
                for(int j=0; j<len; j++)
                    (a[i+j] += 1ll * a[i+j+len] * sign + mod) %= mod;
    }
}
```

## XOR FWT

这里定义 $x \oplus y = \operatorname{popcount}(x ~\&~ y) \bmod 2$ ， 此时满足 $(i \oplus j) \operatorname{xor} (i \oplus k) = i \oplus (j \operatorname{xor} k)$ 。

然后构造 $FWT(A)_i = \sum_{i \oplus j = 0} A_j - \sum_{i \oplus j = 1} A_j$ 。

那么：

$$
\begin{align}
FWT(A)_i \cdot FWT(B)_i &= \left(\sum_{i \oplus j = 0} A_j - \sum_{i \oplus j = 1} A_j\right) \left(\sum_{i \oplus j = 0} B_j - \sum_{i \oplus j = 1} B_j\right) \\

&= 
\left( \sum_{i \oplus j = 0} A_j \right) \left(\sum_{i \oplus j = 0} B_j \right) -
\left( \sum_{i \oplus j = 1} A_j \right) \left(\sum_{i \oplus j = 0} B_j \right) -
\left( \sum_{i \oplus j = 0} A_j \right) \left(\sum_{i \oplus j = 1} B_j \right) +
\left( \sum_{i \oplus j = 1} A_j \right) \left(\sum_{i \oplus j = 1} B_j \right) \\

&=
\sum_{i \oplus (j \operatorname{xor} k) = 0} a_j b_k -
\sum_{i \oplus (j \operatorname{xor} k) = 1} a_j b_k \\

&= FWT(C)_i

\end{align}
$$

我们分别最高位为 $0/1$ ，对于最高位为 $0$ 的情况，无论 $j$ 这一位为 $0$ 还是 $1$ 都为 $0$， 因此只有第一个式子产生贡献，贡献就是递归的两边加在一起。

如果目标位为 $1$ ，相当于如果 $j = 1$ ，产生负数的贡献， $j=0$ ，产生正数。因此就是左边减去右边。

```cpp
namespace FWT {
    inline void XOR(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1) {
            for(int i=0; i<n; i += (len<<1)) {
                for(int j=0; j<len; j++) {
                    ll u = a[i+j], v = a[i+j+len];
                    a[i+j] = (u + v) % mod;
                    a[i+j+len] = (u - v + mod) % mod;
                    if(sign == -1) {
                        a[i+j] = 1ll * a[i+j] * inv2 % mod;
                        a[i+j+len] = 1ll * a[i+j+len] * inv2 % mod;
                    }
                }
            }
        }
    }
}
```

注意一下这里的逆变换乘上的值为 $\frac{1}{2}$ ，下面简单说明一下：

> [!info] 以矩阵视角看待 FWT
> 
> 这里我们可以把正变化看成一个矩阵乘法，比如对于上面的问题，我们可以把 FWT 变成：
> 
>  $$ FWT(A) = \sum_{j} A_j \times (-1)^{\operatorname{opocount}(i ~\& j)} $$
> 
>  那么这样所谓变化实际上对于原序列乘上下面这个矩阵
>  
>  $$H_{i, j} = (-1)^{\operatorname{opocount}(i ~\& j)}$$
>  
>  但是为什么我们可以加快进程呢，因为这个矩阵满足：
>  
>  $$H_n = \begin{bmatrix} H_{n-1} & H_{n-1} \\ H_{n-1} & -H_{n-1} \end{bmatrix}$$
>  
>  因此我们实际上每一步仅仅实在求解：
>  
>  $$\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$$
>  
>  那么所谓逆变换就只需要把这个矩阵求逆，而：
>  
>  $$H^{-1} = \frac{1}{2} H$$


最后给出一个完整代码把：

```cpp
namespace FWT {
    inline void OR(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1)
            for(int i=0; i<n; i += (len<<1))
                for(int j=0; j<len; j++)
                    (a[i+j+len] += 1ll * a[i+j] * sign + mod) %= mod;
    }

    inline void AND(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1)
            for(int i=0; i<n; i += (len<<1))
                for(int j=0; j<len; j++)
                    (a[i+j] += 1ll * a[i+j+len] * sign + mod) %= mod;
    }

    inline void XOR(int n, ll* a, int sign) {
        for(int len=1; len<n; len<<=1) {
            for(int i=0; i<n; i += (len<<1)) {
                for(int j=0; j<len; j++) {
                    ll u = a[i+j], v = a[i+j+len];
                    a[i+j] = (u + v) % mod;
                    a[i+j+len] = (u - v + mod) % mod;
                    if(sign == -1) {
                        a[i+j] = 1ll * a[i+j] * inv2 % mod;
                        a[i+j+len] = 1ll * a[i+j+len] * inv2 % mod;
                    }
                }
            }
        }
    }
}
```