/**
 * Concurrently processes two asynchronous iterators immediately as either yields, 
 * invoking callback functions for yielded values and "done" functions upon
 * completion of each iterator.
 *
 * @template T
 * @param {AsyncGenerator<T1, void, void>} iterator1 - The first asynchronous iterator.
 * @param {AsyncGenerator<T2, void, void>} iterator2 - The second asynchronous iterator.
 * @param {(value: T1) => boolean} callback1 - Callback function for values yielded by iterator1, true to continue iterating.
 * @param {(value: T2) => boolean} callback2 - Callback function for values yielded by iterator2, true to continue iterating.
 * @param {() => void} done1 - "Done" function for iterator1 to be called upon completion.
 * @param {() => void} done2 - "Done" function for iterator2 to be called upon completion.
 * @returns {Promise<void>} A Promise that resolves when iterators are done.
 */
export async function iteracer<T1, T2>(
    iterator1: AsyncGenerator<T1, void, void>,
    iterator2: AsyncGenerator<T2, void, void>,
    callback1: (value: T1) => Promise<boolean>,
    callback2: (value: T2) => Promise<boolean>,
    done1: () => void,
    done2: () => void
) {
    const wrapPromise = (
        promise: Promise<IteratorResult<T1 | T2, void>>,
        identifier: string
    ) => {
        return promise.then((value) => ({ identifier, value }));
    };

    let iterator1Promise = wrapPromise(iterator1.next(), 'iterator1');
    let iterator2Promise = wrapPromise(iterator2.next(), 'iterator2');
    let done = false;

    while (!done) {
        const winner = await Promise.race([
            iterator1Promise,
            iterator2Promise,
        ]);

        const { identifier, value } = winner;
        if (value.done) {
            if (identifier === 'iterator1') {
                done1();
            } else if (identifier === 'iterator2') {
                done2();
            }
            done = true;
        } else {
            if (identifier === 'iterator1') {
                if (await callback1(value.value as T1)) {
                    iterator1Promise = wrapPromise(iterator1.next(), 'iterator1');
                } else {
                    done = true;
                }
            }
            else if (identifier === 'iterator2') {
                if (await callback2(value.value as T2)) {
                    iterator2Promise = wrapPromise(iterator2.next(), 'iterator2');
                } else {
                    done = true;
                }
            }
        }
    }
}