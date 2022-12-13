/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
function promiseState(p: Promise<any>) {
  const t = {};
  return Promise.race([p, t]).then(
    (v) => (v === t ? 'pending' : 'fulfilled'),
    () => 'rejected'
  );
}

export default function use<T>(
  promise: Promise<T> | PromiseLike<T> | any
): Awaited<Promise<T>> {
  if (promise.status === 'fulfilled') {
    return promise.value;
  }
  if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
    throw promise;
  }
}
