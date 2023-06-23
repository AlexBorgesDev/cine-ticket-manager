import { AsyncLocalStorage } from 'async_hooks';

export const userAsyncLocalStorage = new AsyncLocalStorage<any>();
