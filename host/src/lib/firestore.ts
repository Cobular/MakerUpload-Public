import { writable, type Readable, type Writable } from 'svelte/store';
import { onSnapshot, Query, getDocs, type DocumentChange } from 'firebase/firestore';

export class FirestoreReadable<T extends Record<string, any>> implements Readable<T[]> {
	private readonly remoteStore: Writable<T[]>;
	public readonly subscribe: Readable<T[]>['subscribe'];
	private change_handlers: ((change: DocumentChange<T>) => void)[] = [];

	private constructor(private readonly query: Query<T>, initialData: T[]) {
		this.remoteStore = writable(initialData);
		this.subscribe = this.remoteStore.subscribe;

		onSnapshot(this.query, (snapshot) => {
			const docs = snapshot.docs;
			this.change_handlers.forEach((handler) =>
				snapshot.docChanges().forEach((change) => handler(change))
			);

			this.remoteStore.set(docs.map((doc) => doc.data()));
		});
	}

	static async new<Y extends Record<string, any>>(query: Query<Y>): Promise<FirestoreReadable<Y>> {
		const get_docs_res = await getDocs(query);
		const docs = get_docs_res.docs;
		const data = docs.map((doc) => doc.data());
		return new FirestoreReadable<Y>(query, data);
	}

	register_change_handler(callbackfn: (change: DocumentChange<T>) => void) {
		this.change_handlers.push(callbackfn);
	}
}
