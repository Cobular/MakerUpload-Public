import { render, screen } from '@testing-library/svelte';
import type { DocumentData } from 'makersync-common/types';
import DefaultProps from './File.svelte';

const weird_js_object = {
  toDate: () => new Date()
}

it('set and update prop', async () => {
	const file: DocumentData = {
		creation_time: weird_js_object,
		download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
		target_machine: 'Sewing',
		name: 'test file',
		uid: '1234'
	};
	const { component } = render(DefaultProps, { file });

	expect(screen.queryByText('test file')).toBeInTheDocument();

	// Update prop using Svelte's Client-side component API
  const file2: DocumentData = {
    // @ts-ignore
		creation_time: weird_js_object,
		download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
		target_machine: 'Sewing',
		name: 'two',
		uid: '1234'
	};
	await component.$set({ file: file2 });
	expect(screen.queryByText('two')).toBeInTheDocument();
});
