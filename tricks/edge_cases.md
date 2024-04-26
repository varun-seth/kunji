
In Java, the following demonstrates a bug that gives a negative value after calling the absolute value function.

```java
System.out.println("Min Value: " + Integer.MIN_VALUE);
System.out.println("Absolute : " + Math.abs(Integer.MIN_VALUE));
```

This returns `-2147483648` which is  `-2^31`
