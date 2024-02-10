# Lexical Processing

## power law distribution
The freq(word) * rank(word) $\approx$ constant
This is also called the power law distribution ( Zipf's law) 

## Stop words
Words hold minimal information and are usually removed.
`nltk.stopwords('english')` has a list of common english stop words like 'the', 'is' etc.

## Tokenization
`nltk.tokenize_words` can be sued

## Bag of words

Creates a matrix, columns = each word, rows  = number ofentries (samples). And cell-value = frequency of the word in that sample.

## Stemming & Lemmatization
stemming cuts each word down to base like race and racing to rac

Lemmatization is more expensive and goes through dictionary again and again to find better lemma words.

## ID-IDF
TF is term frequency
IDF is inverse document freq.

$$tf_{t,d} = \dfrac{f_{t,d}}{\sum_{t} f_{t,d}}$$

$$ idf_{t} = log(\dfrac{|D|}{|D_t|}) $$

log(total number of docs / number of docs with term t)
