# SA 数组

## 定义

对于一个字符串 $s$ ，我们取出他们的所有后缀。然后按照后缀排序，此时排名为 $i$ 的后缀就是 $sa_i$ ，然后令 $rk_i$ 表示以 $i$ 开始的后缀的排名。因此 $rk_{sa_i} = i$ 。

然后具体如何求出 $sa$ 呢，不难以想到直接把所有后缀丢进去然后排序。当然这样是 $\mathcal O(n^2 \log n)$ 的。

考虑优化这个过程。我们发现此时排序的时间复杂度瓶颈主要出现在判断两个字符串字典序大小上。因此我们考虑优化这个过程。

容易发现这里字符串比较实际上就是把每一个后缀的第一个字符当作第一关键字，第二个当作第二关键字···。因此可以尝试使用倍增优化：具体来说，当我们比较两个字符串字典序时，我们可以把他们分成前后相同长度的两段，然后把第一段字典序作为第一关键字，第二段同理。因此我们发现此时比较字典序的基准实际上就是对于所有后缀开始的一段。

因此我们考虑对于每一个长度进行处理。如图下：

![https://oi-wiki.org/string/images/sa2.png](https://oi-wiki.org/string/images/sa2.png)

当然这里排序还是太慢了，所以我们可以考虑使用桶排序优化一下。

!!! tip "一个小优化"

    对于第一次桶排序实际上就是比较时按照 $rnk_{i+w}$ 和 $rnk_{j+w}$ 相比。然后其实此时我们就发现，如果 $rnk_x < rnk_y$ ，自然对于 $i = x-w, j = y-w$ 就满足上面那个要求了。

    因此满足 $rnk_x < rnk_y$ 实际上就是 $sa$ 数组出现的顺序。因此我们只需要把所有 $i + w > n$ 的放在队首。然后按照 $sa$ 数组的顺序加入就可以了。

于是我们可以得到这一部分的代码:

```cpp
struct SA {
    static constexpr int N = 3e5+5;
	
    int rnk[N<<1], sa[N<<1];
    // 这里 `id` 表示经过第二关键字排序之后序列
    int tot, oldrk[N<<1], id[N<<1], cnt[N];
	
    void build(int n, const string& s) {
        int m = 26;
		
        for(int i=1; i<=n; i++) cnt[rnk[i] = s[i] - 'a' + 1]++;
        for(int i=1; i<=m; i++) cnt[i] += cnt[i-1];
        for(int i=n; i>=1; i--) sa[cnt[rnk[i]]--] = i;
		
        for(int w=1, p=0; w<n; w<<=1, m=p) {
            tot = 0;
            for(int i=n-w+1; i<=n; i++) id[++tot] = i;
            for(int i=1; i<=n; i++) if(sa[i] > w) id[++tot] = sa[i] - w;
			
            for(int i=1; i<=m; i++) cnt[i] = 0;
            for(int i=1; i<=n; i++) cnt[rnk[i]]++;
            for(int i=1; i<=m; i++) cnt[i] += cnt[i-1];
            for(int i=n; i>=1; i--) sa[cnt[rnk[id[i]]]--] = id[i];
			
            p = 0;
            for(int i=1; i<=n; i++) oldrk[i] = rnk[i];
            for(int i=1; i<=n; i++) {
                if(
                    oldrk[sa[i]] == oldrk[sa[i-1]] &&
                    oldrk[sa[i] + w] == oldrk[sa[i-1] + w]
                ) {
                    rnk[sa[i]] = p;
                } else rnk[sa[i]] = ++p;
            }
			
            if(p == n) break;
        }
    }
}
```

## height 数组

首先这个 height 的基本应用是出来任意两个后缀的公共最长前缀。

![https://oi-wiki.org/string/images/sa1.png](https://oi-wiki.org/string/images/sa1.png)

我们以上面这副图为例子，推到一下一个重要的式子:

$$
\operatorname{lcp}(x, y) = \min_{i=x+1}^{y}\{\operatorname{lcp}(i-1, i)\}
$$

由于对于 $sa$ 数组我们发现相邻元素一定是公共前缀最长的。这个也就一看就是对的。

因此这里这个 height 为: $height_i = \operatorname{lcp}(sa_i, sa_{i-1})$，可以视 $height_1 = 0$。

如果暴力求解大概是 $\mathcal O(n \log^2 n)$ 的（如果使用二分加哈希）。当前就是需要找到一个更好的算法计算。

我们尝试证明下面这个式子：

$$
height_{rk_i} \ge height_{rk_{i-1}} - 1
$$

$$
height_{rk_i} \ge \operatorname{lcp}(i-1, sa_{rk_{i-1}-1}) - 1
$$

![alt text](https://cdn.luogu.com.cn/upload/image_hosting/g4aqb00f.png)

我们考虑按照上图指定一个 $i-1$ ，然后 $k = sa_{rk_{i-1}-1}$ 。即上面式子中右边的两个数。然后考虑在他们同时取出头部的一个相同字符，此时他们的 $lcp$ 长度就是 $height_{rk_{i-1}} - 1$ 。

然后可以发现如果按照我们上面的公式， $k+1$ 和 $l$ 之间的 $lca$ 需要取他们在 $sa$ 之间所有的 $height$ 数组，而这里必然包含的 $height_{rk_i}$ 。因此就证明出来了。

根据上面的式子，可以写出代码：

```cpp
for(int i=1; i<=n; i++) rnk[sa[i]] = i;
for(int i=1, k=0; i<=n; i++) {
    if(rnk[i] == 0) continue;
    if(k) k--;
    while(s[i+k] == s[sa[rnk[i] - 1] + k]) k++;
    height[rnk[i]] = k;
}
```

此时我们发现每一次最多 $k$ 减少 $1$ 。因此时间复杂度就是 $\mathcal O(n)$。

## 应用

### 任意两个后缀的 LCP

由于前面的推导，我们只需要把 $height$ 放入 ST 表中维护。然后取区间最小值就可了。

### 在线查询匹配串是否在字符串中出现过

AC 自动机 解决的问题是提前知道所有的匹配串。然后用大字符串匹配匹配床。而 SA 数组可以做到在预先知道大字符串的情况下在线 $\mathcal O(n \log n)$ 求解是否出现过。

具体来说如果是一个字符串的子串，其必然作为一个后缀的前缀出现。因此我们在 $sa$ 上二分。然后找到一个前缀和他最匹配的，然后暴力判断。

### 不同字子串个数

实际上就是用所有子串减去重复的。然后重复的部分就是两个字符串的 LCP。答案为 $\frac{n(n+1)}{2} - \sum_{i=2}^{n} height_i$ 。