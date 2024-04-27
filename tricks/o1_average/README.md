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

1. **Update Weighted Average**: Assuming the last weighted average was $\hat{\mu}_0$, the new weighted average can be calculated as:

   $$\hat{\mu}_1 = \frac{(w_1 - 1) \cdot \hat{\mu}_0 + x_1}{w_1}$$

Where $x_1$ is the new number being added in the stream.
