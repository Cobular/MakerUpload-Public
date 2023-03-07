import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export class PersistentStore<T> implements Writable<T> {
    private store: Writable<T>;
    public subscribe: Writable<T>['subscribe'];
    public set: Writable<T>['set'];
    public update: Writable<T>['update'];

    constructor(private readonly title: string, initial: T) {
        if (browser) {
            const local_storage_val = localStorage.getItem(title);
            if (local_storage_val === null) {
                this.store = writable(initial);
            } else {
                this.store = writable(JSON.parse(local_storage_val));
            }
            this.store.subscribe((val) => localStorage.setItem(title, JSON.stringify(val)));
        } else {
            this.store = writable(initial);
        }

        this.subscribe = this.store.subscribe;
        this.set = this.store.set;
        this.update = this.store.update;
    }
}
