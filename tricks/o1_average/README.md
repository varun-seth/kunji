# Calculating average in $O(1)$ Time

Problem: Having previously seen a stream of numbers and their timestamps, estimate the weighted average of the numbers in $O(1)$ time each time a new number is added.

Note: We will assume exponential decay of weights, with coefficient $\alpha$.


## Solution

If "exponential decay" is not a requirement, then the problem is simpler and can be solved with a simple running average and total count. Let the new value be $x_{n+1}$. The estimated mean $`\hat{\mu}_{n}`$ for the average till last point, and $w_n$ for the total count of numbers seen so far, the new weight $w_{n+1}$ and the new average  $\hat{\mu}_{n+1}$ can be calculated as follows:

$$w_{n+1} = w_n + 1$$

```math
\hat{\mu}_{n+1} = \frac{(w_{n+1} - 1) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}
```



Since we want an exponential decay, we need to maintain a weighted average that accounts for the time decay of previous numbers.


To achieve $O(1)$ time complexity for calculating the weighted average, we can maintain a running total sum and a proxy for count of the numbers added. We need to keep track of the following key metrics (updated with each new number):

- **Total Weight**: Total Weight of the numbers. This will itself be weighted by the timestamp, so that more recent numbers have a higher influence on the average. If there is no timestamp concept, then this can be simply the count of numbers.
- **Weighted Average**: The last known weighted average, which was previously calculated.
- **Last Timestamp**: The timestamp of the last number added, this helps determine the ratio of weights between the old avearge and the new number.

When a new number is added, we will update all these metrics as follows:
1. **Update Total Weight**: The total weight is sum of weights by discounted by the timestamp of each number. So, if the last_timestamp is $t_n$, last weight was $w_n$ and the new timestamp is $t_{n+1}$, the new total weight can be calculated as:

$$w_{n+1} = w_n \cdot e^{-\alpha (t_{n+1} - t_n)} + 1$$

This essentially means that the weight of the previous average is decayed by the time difference, and we add a weight of 1 for the new number.

2. **Update Weighted Average**: Assuming the last weighted average was $\hat{\mu}_n$, the new weighted average can be calculated as:

```math
\hat{\mu}_{n+1} = \frac{(w_{n+1} - 1) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}
```

Where $x_{n+1}$ is the new number being added in the stream.
Notice that this second formula is identical to the case without exponential decay, only the formula for the weight is different.

You can try playing with this [live demo](https://varun-seth.github.io/kunji/tricks/o1_average/)


Note: If $\alpha$ is set to $0$, then the total weight will not decay with time and the average will be a simple running average of all points seen so far. If $\alpha$ is set to a very high value, then the average will quickly converge to the most recent number added, effectively ignoring all previous numbers.

## Proof of Correctness

Suppose we have a stream of numbers $x_1, x_2, \ldots, x_n$ with timestamps $t_1, t_2, \ldots, t_n$. The weighted average at time $t_n$ can be expressed as:

```math
\hat{\mu}_n = \frac{\sum_{i=1}^{n} (b_{i \leadsto n} \cdot x_i)}{\sum_{i=1}^{n} b_{i \leadsto n}}
```

Where $b_{i \leadsto j}$ is a partial weight of the number $x_i$ (that came at the iteration $i$) but evaluated at time $t_j$ (during the iteration $j$). Mathematically, we define the partial weight as:

$$b_{i \leadsto j} = e^{-\alpha (t_j - t_i)}$$


Now, we define $w_n$ as the total weight of all numbers up to $x_n$ at the time $t_n$.

$$ w_n = \sum_{i=1}^{n} b_{i \leadsto n} = \sum_{i=1}^{n} e^{-\alpha (t_n - t_i)} $$


Now, when we add a new number $x_{n+1}$ at time $t_{n+1}$, the new total weight becomes:

$$w_{n+1} = \sum_{i=1}^{n+1} b_{i \leadsto n+1} $$

Let us simplify $b_{i \leadsto n+1}$:

$$b_{i \leadsto n+1} = e^{-\alpha (t_{n+1} - t_i)} = e^{-\alpha (t_{n+1} - t_n)} \cdot e^{-\alpha (t_n - t_i)}$$

$$b_{i \leadsto n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \leadsto n}$$

Substituting this into the total weight formula, we get:

$$w_{n+1} = \sum_{i=1}^{n} e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \leadsto n} + e^{-\alpha (t_{n+1} - t_{n+1})}$$


$$w_{n+1} = \sum_{i=1}^{n} e^{-\alpha (t_{n+1} - t_i)} + e^{-\alpha (t_{n+1} - t_{n+1})} $$

$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot \sum_{i=1}^{n} e^{-\alpha (t_n - t_i)} + 1$$

$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot \sum_{i=1}^{n} b_{i \leadsto n} + 1$$


$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot w_n + 1$$

This weight matches the formula we suggested earlier for updating the total weight.

Now, the new weighted average would be:

```math
\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n+1} (b_{i \leadsto n+1} \cdot x_i)}{w_{n+1}}

```

```math
\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n} (b_{i \leadsto n+1} \cdot x_i) + b_{n+1 \leadsto n+1} \cdot x_{n+1}}{w_{n+1}}
```

Where $b_{n+1 \leadsto n+1} = e^{-\alpha (t_{n+1} - t_{n+1})} = 1$.

```math
\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n} (b_{i \leadsto n+1} \cdot x_i) + x_{n+1}}{w_{n+1}}
```


Remember that $b_{i \leadsto n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \leadsto n}$, so we can rewrite the numerator as:

```math
\hat{\mu}_{n+1} = \frac{ e^{-\alpha (t_{n+1} - t_{n})} \cdot \sum_{i=1}^{n} (b_{i \leadsto n} \cdot x_i) + x_{n+1}}{w_{n+1}}
```

Recall that $`\hat{\mu}_n = {\sum_{i=1}^{n} (b^{n}_i \cdot x_i)}/{w_n}`$, so we can rewrite the numerator as:

```math
\hat{\mu}_{n+1} = \frac{ e^{-\alpha (t_{n+1} - t_{n})} \cdot w_n \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}
```

```math
\hat{\mu}_{n+1} = \frac{(w_n \cdot e^{-\alpha (t_{n+1} - t_{n})}) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}
```

```math
\hat{\mu}_{n+1} = \frac{(w_{n+1} - 1) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}
```

This matches the formula we suggested earlier for updating the weighted average.


