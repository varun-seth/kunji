
For regression, take average of y, get the residuals = average minus y (gradients)

Now train a weak model (decision tree) to predict residuals themselves, then a new model to predict those residuals, progressively fitting the data.

The final model is the sum of all the predictions

---

For classification

Calculate the log odds

Probability  = $\dfrac{ e^{\log(y/n)} }{1 + e^{\log(y/n)}}$ where $y$ and $n$ are count of each.

basically same as $\dfrac{y/n}{1 + y/n} = \dfrac{y}{y + n}$

This is the average prediction for the base model, and we start gradient boosting from here.


leaf formula using r = residuals

$$ = \dfrac{\sum{r}}{\sum{\text{prev}(y_i) * (1- \text{prev}(y_i)}} $$


New log(odds) = initial log(odds) + LR*(output value given by the Decision tree)
