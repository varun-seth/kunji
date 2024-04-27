# Calculating average in $O(1)$ Time

Problem: Having previously seen a stream of numbers and their timestamps, estimate the weighted average of the numbers in $O(1)$ time each time a new number is added.

Note: We will assume exponential decay of weights, with coefficient $\alpha$.


## Solution

If "exponential decay" is not a requirement, then the problem is simpler and can be solved with a simple running average and total count. Assuming the values $x_1$ for the new point, $\hat{\mu}_0$ for the last known average, and $w_0$ for the total count of numbers seen so far, the new weight $w_1$ and the new average  $\hat{\mu}_1$ can be calculated as follows:

$$w_1 = w_0 + 1$$

$$\hat{\mu}_1 = \frac{(w_1 - 1) \cdot \hat{\mu}_0 + x_1}{w_1}$$


However, since we are assuming exponential decay, we need to maintain a weighted average that accounts for the time decay of previous numbers.


To achieve $O(1)$ time complexity for calculating the weighted average, we can maintain a running total sum and a proxy for count of the numbers added. We need to keep track of the following key metrics (updated with each new number):

- **Total Weight**: Total Weight of the numbers. This will itself be weighted by the timestamp, so that more recent numbers have a higher influence on the average. If there is no timestamp concept, then this can be simply the count of numbers.
- **Weighted Average**: The last known weighted average, which was previously calculated.
- **Last Timestamp**: The timestamp of the last number added, this helps determine the ratio of weights between the old avearge and the new number.

When a new number is added, we will update all these metrics as follows:
1. **Update Total Weight**: The total weight is sum of weights by discounted by the timestamp of each number. So, if the last_timestamp is $t_0$, last weight was $w_0$ and the new timestamp is $t_1$, the new total weight can be calculated as:
   
$$w_1 = w_0 \cdot e^{-\alpha (t_1 - t_0)} + 1$$

This essentially means that the weight of the previous average is decayed by the time difference, and we add a weight of 1 for the new number.

2. **Update Weighted Average**: Assuming the last weighted average was $\hat{\mu}_0$, the new weighted average can be calculated as:

$$\hat{\mu}_1 = \frac{(w_1 - 1) \cdot \hat{\mu}_0 + x_1}{w_1}$$

Where $x_1$ is the new number being added in the stream.
Notice that this second formula is identical to the case without exponential decay, only the formula for the weight is different.

[Live Demo](https://varun-seth.github.io/kunji/tricks/o1_average/)


Note: If $\alpha$ is set to 0, then the weights will not decay and the average will be a simple running average of all points seen so far. If $\alpha$ is set to a very high value, then the average will quickly converge to the most recent number added, effectively ignoring all previous numbers.

## Proof of Correctness

Suppose we have a stream of numbers $x_1, x_2, \ldots, x_n$ with timestamps $t_1, t_2, \ldots, t_n$. The weighted average at time $t_n$ can be expressed as:

$$\hat{\mu}_n = \frac{\sum_{i=1}^{n} (b_{i \to n} \cdot x_i)}{\sum_{i=1}^{n} b_{i \to n}}$$

Where $b_{i \to n}$ is a partial weight of the number $x_i$ (that came at the $ith$ iteration) but evaluated at time $t_n$. Mathematically, we define the partial weight as:

$$b_{i \to j} = e^{-\alpha (t_j - t_i)}$$


Now, we define $w_n$ as the total weight of all numbers up to $x_n$ at the time $t_n$.

$$ w_n = \sum_{i=1}^{n} b_{i \to n} = \sum_{i=1}^{n} e^{-\alpha (t_n - t_i)} $$


Now, when we add a new number $x_{n+1}$ at time $t_{n+1}$, the new total weight becomes:

$$w_{n+1} = \sum_{i=1}^{n+1} b_{i \to n+1} $$

Let us simplify $b_{i \to n+1}$:

$$b_{i \to n+1} = e^{-\alpha (t_{n+1} - t_i)} = e^{-\alpha (t_{n+1} - t_n)} \cdot e^{-\alpha (t_n - t_i)}$$

$$b_{i \to n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \to n}$$

Substituting this into the total weight formula, we get:

$$w_{n+1} = \sum_{i=1}^{n} e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \to n} + e^{-\alpha (t_{n+1} - t_{n+1})}$$


$$w_{n+1} = \sum_{i=1}^{n} e^{-\alpha (t_{n+1} - t_i)} + e^{-\alpha (t_{n+1} - t_{n+1})} $$

$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot \sum_{i=1}^{n} e^{-\alpha (t_n - t_i)} + 1$$

$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot \sum_{i=1}^{n} b_{i \to n} + 1$$


$$w_{n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot w_n + 1$$

This weight matches the formula we suggested earlier for updating the total weight.

Now, the new weighted average would be:

$$\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n+1} (b_{i \to n+1} \cdot x_i)}{w_{n+1}}$$

$$\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n} (b_{i \to n+1} \cdot x_i) + b_{n+1 \to n+1} \cdot x_{n+1}}{w_{n+1}}$$

Where $b_{n+1 \to n+1} = e^{-\alpha (t_{n+1} - t_{n+1})} = 1$.

$$\hat{\mu}_{n+1} = \frac{\sum_{i=1}^{n} (b_{i \to n+1} \cdot x_i) + x_{n+1}}{w_{n+1}}$$


Remember that $b_{i \to n+1} = e^{-\alpha (t_{n+1} - t_n)} \cdot b_{i \to n}$, so we can rewrite the numerator as:

$$\hat{\mu}_{n+1} = \frac{ e^{-\alpha (t_{n+1} - t_{n})} \cdot \sum_{i=1}^{n} (b_{i \to n} \cdot x_i) + x_{n+1}}{w_{n+ 1}}$$

Recall that $\hat{\mu}_n = \frac{\sum_{i=1}^{n} (b^{n}_i \cdot x_i)}{w_n}$, so we can rewrite the numerator as:

$$\hat{\mu}_{n+1} = \frac{ e^{-\alpha (t_{n+1} - t_{n})} \cdot w_n \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}$$

$$\hat{\mu}_{n+1} = \frac{(w_n \cdot e^{-\alpha (t_{n+1} - t_{n})}) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}$$

$$\hat{\mu}_{n+1} = \frac{(w_{n+1} - 1) \cdot \hat{\mu}_n + x_{n+1}}{w_{n+1}}$$

This matches the formula we derived earlier for updating the weighted average.


