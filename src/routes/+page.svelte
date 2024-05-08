<script lang="ts">
	import Viewer from '$lib/Viewer.svelte';
	import { level_from_img, type CourseData } from '$lib/convert';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let courses: CourseData[] = [];

	async function parseImage(data: Blob) {
		const parseData = await level_from_img(data);
		courses = parseData.levels;
	}

	let generating = false;

	async function generate(_event: Event) {
		generating = true;
		try {
			const time = new Date().getTime();
			const response = await fetch('/api/generate', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log('Time to generate:', (new Date().getTime() - time) / 1000, 'seconds');

			if (!response.ok) {
				throw new Error('Failed to generate level');
			}
			const data = await response.blob();
			parseImage(data);
		} catch (e) {
			console.error(e);
			let levelError: string | undefined;
			if (e instanceof Error) {
				levelError = e.message;
			} else {
				levelError = 'An unknown error occurred';
			}

			toastStore.trigger({
				message: levelError,
				background: 'variant-filled-error',
			});
		} finally {
			generating = false;
		}
	}
</script>

<title> Mario Maker 1 Level Generator </title>

<div class="flex flex-1 overflow-hidden flex-col gap-2">
	<button type="button" class="btn btn-xl variant-filled" disabled={generating} on:click={generate}> Generate </button>

	{#if generating}
		<ProgressBar value={undefined} />
	{:else}
		{#if courses.length > 0}
			<Viewer {courses} />
		{/if}
	{/if}
</div>
