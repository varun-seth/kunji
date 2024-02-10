
## Linear regression

$\hat{y} = mx + c$

### R-square
Proportion of variance in $y$ explained by the model.

$0 \le R^2 \le 1$, the higher the better is model.

$R^2 = 1 - RSS/TSS$


### Multicollinearity
VIF (variation inflation factor):
measures how much one predictor variable (x) is linearly related with existing other variables (excluding target variable).

$VIF = 1/(1 - R^2_j)$ where $R^2_j$ is the coefficient of determination between $j$th independent variable and all other independent variables.

### Categorical variables
A categorical variable (that has $m$ different classes) cannot be directly used as an independent variable, but we can create $m-1$ dummy variables to represent this. Each takes either 0 or 1.
