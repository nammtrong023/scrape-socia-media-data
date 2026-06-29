// ponytail: gom 2 block worker pool trùng nhau trong FB và IG transcript batch
// Pattern: pull-based queue — mỗi worker tự lấy task tiếp theo cho đến khi hết

/**
 * Run `worker(item, index)` cho mỗi phần tử trong `items`, tối đa `concurrency` workers song song.
 * @template T
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<void>} worker
 * @param {number} concurrency
 */
export async function runWorkerPool(items, worker, concurrency) {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
}
