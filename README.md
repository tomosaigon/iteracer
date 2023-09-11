# iteracer

The iteracer is a TypeScript function that facilitates concurrent processing of two asynchronous iterators. It enables you to (Promise) race the two iterators, executing processing callback functions as each returns, and "done" functions as the iterators finish yielding.

- It wraps the promises returned by iterator1.next() and iterator2.next() with an identifier to track the source iterator.
- It employs Promise.race to determine which iterator yields a value first.
- Upon identifying the winning iterator, it calls the appropriate callback function with the yielded value and calls next
- If the winning iterator is done, it invokes the corresponding "done" function to signal completion.
