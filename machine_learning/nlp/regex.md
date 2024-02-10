
# Regex

```python
import re
re.search(pattern, string)
```

## Quantifiers


- `?` is for optional pattern. `'abc?'` to find `abc` or `ab` as `c` is optional.

- `*` 0 or more. eg: `ab*c` can catch `ac` and `abbc`
- `+` 1 or more.
- `{...}` for specific number, like `ab{3}c` will catch abbbc.
  - `{5, 10}` will match 5 to 10 occurrences.
  - `{5,}` 5 and above.
  - `,10` at-most 10.
  - `{0,1}` is same as `?`
  - `{1,}` is same as `+`
  - `{0,}` is same as `*`

- `()` parenthesis are used enclosing the logic units, for example `(wo)?man` will capture man and woman.

- `|` for or, like `(base|foot)ball` can match both baseball and football

- `\` is an escape sequence, used with above special characters to match literal values. `\?` will match `?`

## Regex Flags

- `I` searches case insensitive.
- `M` searches multiple lines.
```python
re.search(pattern, string, flags=re.I | re.M)
```

## Compile

`re.compile` gives faster results.


```py
result = re.search("a+", "abc")
```

Above can be replaced by below

```py
pattern = re.compile("a+")
result = pattern.search("abc")
```

## Anchors

- `^` marks the start
- `$` marks the end.
- Example: `^a.*` will find something that *starts* with a.

- `.` is a wildcard that matches everything.

## Character sets
- `[]` square brackets to indicate a set of characters for matching
- `[abc]` will match a or b or c.
- `[a-z]` will match a to z
- `[.*]` will find literal dot and star as quantifiers lose special meanings inside square brackets.
- `[A-Za-z]` all characters large or small.
- `[A-z]` is buggy because it regex uses ASCII sequence which has A=65, Z=90, a=97, z=122, (basically all small and upper letters) and also includes `[`, `\`, `]`, `^`, `-`, \`
- `[0-9]+` matches all natural numbers.
- `[^ab]` will match literal neither a nor b.
- `[ab^]` will match literal a, b and `^`

Note that `^` can act as anchor (start-search) and also complement (within brackets), and also something literal.
  
## Meta Sequences
- `\s` finds whitespaces like `[\t\n\r]`
- `\S` finds non-white spaces.
- `\d` finds `[0-9]` digit
- `\D` finds non digit
- `\w` finds word `[a-zA-Z0-9_]`
- `\W` non-word

## Non-greedy.
- `?` ending with a pattern with this makes a non-greedy search. 
- `<.*>` will search the entire html doc.
- `<.*>?` will only stop at the first `<html>` tag.

---

## Common Functions

`re.match` matches beginning and `re.search` searches entire string.
`re.sub(pattern, replacement, string)` to substitute.

## Grouping

The pattern can contain each group in a parenthesis `()`

- `(\d{4})-(\d{2})-(\d{2})` can find a date and `result.group(1)` gives the first group, i.e, year. `group(0)` gives the entire match.






