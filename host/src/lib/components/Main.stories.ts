import type { Meta, StoryObj } from '@storybook/svelte';
import type { DocumentData } from 'makersync-common/types';

import Main from './Main.svelte';

const meta = {
	title: 'Main',
	component: Main,
	tags: ['autodocs']
} satisfies Meta<Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: {
    files: []
  }
};

const file: DocumentData = {
  creation_time: { toDate: () => new Date() },
  download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
  target_machine: 'Sewing',
  name: 'test file',
  uid: '1234'
}

const file2: DocumentData = {
  creation_time: { toDate: () => new Date() },
  download_url: 'https://cf-worker.cobular.workers.dev/files?uuid=1234',
  target_machine: '3DPrinter',
  name: 'two',
  uid: '1234'
}

export const SomeData: Story = {
  args: {
    files: [
      file, file2, file
    ]
  }
};

export const ManyData: Story = {
  args: {
    files: [
      file2, file, file,
      file, file2, file,
      file, file, file2,
    ]
  }
};