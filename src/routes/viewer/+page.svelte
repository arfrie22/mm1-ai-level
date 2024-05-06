<script lang="ts">
	import Viewer from '$lib/Viewer.svelte';
	import { level_from_img, type CourseData } from '$lib/convert';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let courses: CourseData[] = [];

	let files: FileList | undefined = undefined;

	async function parseImage(data: Blob) {
		try {
			const parseData = await level_from_img(data);
			courses = parseData.levels;
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
		}
	}

	async function uploadImage(_event: Event) {
		if (files && files.length > 0) {
			const file = files[0];
			parseImage(new Blob([await file.arrayBuffer()]));
		}
	}
</script>

<title> Mario Maker 1 Level Generator | Viewer </title>

<div class="flex flex-1 overflow-hidden flex-col gap-2">
		<FileDropzone
			name="files"
			accept="image/*"
			bind:files
			on:change={uploadImage}
		>
			<svelte:fragment slot="lead"><i class="bx bxs-cloud-upload text-2xl" /></svelte:fragment>
			<svelte:fragment slot="message">Drop an image here to get started</svelte:fragment>
			<svelte:fragment slot="meta">or click to select a file</svelte:fragment>
		</FileDropzone>

	{#if courses.length > 0}
		<Viewer {courses} />
	{:else}
		<p>Upload an image to get started</p>
	{/if}
</div>
