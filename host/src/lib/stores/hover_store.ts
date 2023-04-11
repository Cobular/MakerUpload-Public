import { listen, type EventCallback } from '@tauri-apps/api/event';
import type { FileDropEvent } from '@tauri-apps/api/window';
import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export class HoverStore implements Readable<boolean> {
  private static instance: HoverStore;

	private store: Writable<boolean>;
	public subscribe: Writable<boolean>['subscribe'];

	private listeners: [symbol, EventCallback<any>][] = [];

	private constructor() {
		this.store = writable(false);
		this.subscribe = this.store.subscribe;

		listen('tauri://file-drop', (event) => {
			this.listeners.forEach(([_, callback]) => callback(event));
		});
		listen('tauri://file-drop-hover', () => {
			this.store.set(true);
		});
		listen('tauri://file-drop-cancelled', () => {
			this.store.set(false);
		});
	}

  // Make it a singleton
  public static get_instance(): HoverStore {
    if (!HoverStore.instance) {
      HoverStore.instance = new HoverStore();
    }
    return HoverStore.instance;
  }

	public add_listener(event_callback: EventCallback<FileDropEvent>): CallableFunction {
		const this_symbol = Symbol();
		this.listeners.push([this_symbol, event_callback]);

		return () => {
			this.listeners = this.listeners.filter(([symbol, _]) => symbol !== this_symbol);
		};
	}
}


export const hover_store = HoverStore.get_instance();