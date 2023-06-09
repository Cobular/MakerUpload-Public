import type { TargetMachine } from 'makersync-common/types';
import { createMachine, assign, actions } from 'xstate';
import type { useMachine } from '@xstate/svelte';
import { compress_files } from './compress';
import { Observable } from 'rxjs';
import { upload_file } from './upload';

const { log } = actions;

export const file_upload_machine = createMachine(
	{
		/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOljABsxMAXAfQDNcrYBiAMQEkAZAUToDKvPgGEAKgG0ADAF1EoAA4B7WLhq4l+eSAAeiAEwBGAOwkAnFIBs+gCxmAHAFZDlwy4A0IAJ6IzhxyTG9n76AMyhZjZGwQC+MZ5oWHiEpORUtHQYOARgrACyAIIiABKcAHL8QqKSstrKquqa2noIZvqWJKGOjjbGUjZRxq6hnj4IvfYk9vb69lZ9+o5OoXEJWcnEZJTU9Os5rABCRQDSdGIA8oLCvOJ0XHwC0nJIIPVqGlovLdEklsZuxkBQSkQ30o0QfVCJCk9hMzksDjC-lWIES2RSJAArgoKEp0BBDiczpcqjcxHRCiVyrwnnUVO8ml9fO1Ot1ev1BsNwQhwgF-NZHGZAfC-Ct4qi9hjsbj8YSRKcLldqnceLxHrUXm9Gp9QC02h0uj0+gN9ENDCNvAY3IFHFIpIZpjZQjZ7KFzSi0RtSNK8QSAKoABW45wKABEVWVOAJirTNfTtc1mQa2cbOebuYZ+iRepZHEM3U57DYPZLNj78SQAO7od74KCsQPBsOCMQFABKNWeinjH0TCBMZhI+naeZcXUs9iC3PCUKcmZsebM3X8YRLSRy3pxvqxW-xBHrjZD4YDbfOAHE22r1V3Xj3GbrEF1TCvQpZLKF9H4YYZucObNnYXaBdbSkJZ3zXdEy13CAdxlCB9wbIMjzoXg21PNtY27BpeyZBBHHfQJAVfSwpA-YdwmnRZzDzWEpGHSdpnsCCvRICBNFyI55WJJUyRVB5MNvbD710RA3DMDozHCN9xP+QsLTGWESBAu1bBI20bEMMw4nFfAlAgOBtE9Dc6SEnURIQABaWxuQsjo7Xs0ibH6W1TSY8UjIxNIdkYZgDLjUy+0Bbki0mCIwInBdjEFLT3NLVJtgyUsTIZMyWltKFBXs7o3yWf4bG5CxDCU4w7GMWxgkiQVmI3WDfWShNcOsy1+1fcxANcEqvw0yxqqlaCqxrdQ63qnCHwQMrp2dVl50XZdHFXWL1z6uDar3Yb-JSvsukmcTJyGJyukWMxKICSSnWMMxCumPMxTWJaoJW8sIDoMAACdXqUV6RuEloSv-PoFgHS6HEcac7GzZ1QiCf52k011es2NjCG+1LRMzA0XF6FwwmCUiMyzIVc3zB0lmLbSgA */
		schema: {
			context: {
				files: [] as File[],
				final_blob: null as File | null,
				target: null as TargetMachine | null,
				progress: 0 as number | null,
				error: null as string | null,
				token: null as string | null
			},
			events: {} as
				| { type: 'FILE_SELECT'; files: File[] }
				| { type: 'MACHINE_SELECT'; target: TargetMachine }
				| { type: 'UPLOAD_START'; turnstile_elem: HTMLDivElement }
				| { type: 'COMPRESSION_DONE'; file: File }
				| { type: 'COMPRESSION_PROGRESS'; progress: number }
				| { type: 'UPLOAD_PROGRESS'; progress: number }
				| { type: 'UPLOAD_ERROR'; error: string }
				| { type: 'UPLOAD_FINISH' }
				| { type: 'BACK_TO_SELECT_FILES' }
				| { type: 'BACK_TO_SELECT_MACHINE' },
			services: {} as {
				validate_capcha: {
					// The data that gets returned from the service
					data: string;
				};
				upload_file: {
					data: void;
				};
			}
		},
		context: {
			files: [] as File[],
			final_blob: null as File | null,
			target: null as TargetMachine | null,
			progress: 0 as number | null,
			error: null as string | null,
			token: null as string | null
		},
		tsTypes: {} as import('./states.typegen').Typegen0,
		initial: 'select_files',
		states: {
			select_files: {
				on: {
					FILE_SELECT: {
						target: 'select_machine',
						actions: [
							assign({
								files: (context, event) => event.files
							}),
							log("Files selected", "SELECT_FILES->SELECT_MACHINE")
						]
					}
				}
			},
			select_machine: {
				on: {
					MACHINE_SELECT: {
						target: 'upload',
						actions: [assign({ target: (context, event) => event.target }), log("Machine selected", "SELECT_MACHINE->UPLOAD")]
					},
					BACK_TO_SELECT_FILES: {
						target: 'select_files',
						actions: ['reset', log("Reselect files", "SELECT_MACHINE->SELECT_FILES")]
					}
				}
			},
			upload: {
				on: {
					BACK_TO_SELECT_MACHINE: {
						target: 'select_machine',
						actions: ['wipe_target', log("Upload cancelled", "UPLOAD->SELECT_MACHINE")]
					},
					BACK_TO_SELECT_FILES: {
						target: 'select_files',
						actions: ['reset', log("Upload cancelled", "UPLOAD->SELECT_FILES")]
					},
					UPLOAD_FINISH: {
						target: 'done',
						actions: [log('Upload finished', 'UPLOAD->DONE')]
					}
				},
				initial: 'waiting',
				states: {
					waiting: {
						on: {
							UPLOAD_START: {
								target: 'validating'
							}
						}
					},
					validating: {
						invoke: {
							src: 'validate_capcha',
							onDone: {
								target: 'compressing',
								actions: [
									assign({ token: (context, event) => event.data }),
									log('Capcha validated', 'VALIDATE->COMPRESS')
								]
							},
							onError: {
								target: 'upload_error',
								actions: [
									assign({ error: (context, event) => event.data }),
									log('Error validating capcha', 'VALIDATE->ERROR')
								]
							}
						}
					},
					compressing: {
						on: {
							COMPRESSION_DONE: {
								target: 'uploading',
								actions: [
									assign({ progress: 0, final_blob: (context, event) => event.file }),
									log((ctx, evt) => {
										const orig_size = ctx.files.reduce((acc, file) => acc + file.size, 0);
										const new_size = evt.file.size;
										const ratio = new_size / orig_size;
										return 'Compression done. New size: ' + new_size + ' (' + ratio + 'x)';
									}, 'COMPRESSION->UPLOAD')
								]
							},
							COMPRESSION_PROGRESS: {
								actions: ['set_progress']
							}
						},
						invoke: {
							src: 'compress_data',
							onDone: {
								target: 'uploading'
							}
						}
					},
					uploading: {
						on: {
							UPLOAD_PROGRESS: {
								actions: ['set_progress']
							},
							UPLOAD_ERROR: {
								actions: [
									(context, event) => assign({ error: event.error }),
									log((ctx, evt) => 'Upload error: ' + evt.error, 'UPLOAD->ERROR')
								],
								target: 'upload_error'
							}
						},
						invoke: {
							src: 'upload_file',
							onDone: {
								target: '..done',
								actions: [log('Upload done', 'UPLOAD->DONE')]
							}
						}
					},
					upload_error: {}
				}
			},

			done: {
				on: {
					BACK_TO_SELECT_FILES: {
						target: 'select_files',
						actions: ['reset', log('Back to select from done', 'DONE->SELECT')]
					},
					BACK_TO_SELECT_MACHINE: {
						target: 'select_machine',
						actions: ['wipe_target', log('Back to machines from done', 'DONE->MACHINE')]
					}
				}
			}
		}
	},
	{
		actions: {
			wipe_target: assign({ target: null, token: null }),
			set_progress: assign({ progress: (context, event) => event.progress }),
			reset: assign({ progress: null, error: null, token: null, files: [], target: null })
		},
		services: {
			upload_file: (context) =>
				new Observable<{ type: 'UPLOAD_PROGRESS'; progress: number } | { type: 'UPLOAD_FINISH' }>(
					(subscriber) => {
						if (context.final_blob === null) {
							subscriber.error('No file to upload');
							return;
						}
						if (context.target === null) {
							subscriber.error('No target machine');
							return;
						}
						if (context.token === null) {
							subscriber.error('No token');
							return;
						}
						upload_file(context.final_blob, context.target, context.token, (progress) => {
							subscriber.next({ type: 'UPLOAD_PROGRESS', progress });
						})
							.then(() => {
								subscriber.next({ type: 'UPLOAD_FINISH' });
								subscriber.complete();
							})
							.catch((err) => {
								subscriber.error(err);
							});
					}
				),
			compress_data: (context) =>
				new Observable<
					| { type: 'COMPRESSION_PROGRESS'; progress: number }
					| { type: 'COMPRESSION_DONE'; file: File }
				>((subscriber) => {
					if (context.files.length === 1) {
						subscriber.next({ type: 'COMPRESSION_DONE', file: context.files[0] });
						subscriber.complete();
						return;
					}
					// Make a name from the set of files
					const name =
						context.files
							.map((file) => file.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '-'))
							.join('_') + '.zip';

					compress_files(context.files, (progress) => {
						console.log(progress);
						subscriber.next({ type: 'COMPRESSION_PROGRESS', progress });
					})
						.then((blob) => {
							subscriber.next({ type: 'COMPRESSION_DONE', file: new File([blob], name) });
							subscriber.complete();
						})
						.catch((err) => {
							subscriber.error(err);
						});
				}),
			validate_capcha: (context, event) => {
				const promise = new Promise<string>((resolve, reject) => {
					window.turnstile.render(event.turnstile_elem, {
						sitekey: '0x4AAAAAAADGNjylRVrnMnPc',
						callback: function (token: string) {
							console.log(`Challenge Success ${token}`);
							resolve(token);
						},
						'error-callback': function () {
							reject('Capcha Error');
						}
					});
				});
				return promise;
			}
		}
	}
);

export type SvelteUseMachineTypes = ReturnType<typeof useMachine<typeof file_upload_machine>>;
export type SvelteStateTypes = (typeof file_upload_machine)['states'];

type subscribe = SvelteUseMachineTypes['state']['subscribe'];
type subscribe_params = Parameters<subscribe>;
type subscribe_callback = subscribe_params[0];

export type StatePropType = Parameters<subscribe_callback>[0];
export type StateValue = StatePropType['value'];

export type SendPropType = SvelteUseMachineTypes['send'];
