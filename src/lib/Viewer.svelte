<script lang="ts">
	import { Draw as DrawCourse } from './viewer/Draw';
	import type { CourseData } from './convert';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let scale = 16;

	export let id = '';
	export let courses: CourseData[];
	let paginatorSettings = { amounts: [], size: courses.length, page: 1, limit: 1 };

	let divId: string | undefined = undefined;

	async function setUp(courses: CourseData[], scale: number) {
		if (!divId) {
			return;
		}
		
		const courseData = courses[paginatorSettings.page];
		new DrawCourse(divId, courseData.course, courseData.objects, scale);
	}

	function reset(_courses: CourseData[]) {
		paginatorSettings.size = courses.length;
		paginatorSettings.page = 0;
	}

	$: reset(courses);

	$: setUp(courses, scale);

	function init(elment: HTMLElement) {
		divId = elment.id;
		setUp(courses, scale);
	}

	function copyImageToClipboard() {
		const canvas = document.getElementById(`level-viewer-container-${id}_courseDraw`) as HTMLCanvasElement;
		if (!canvas) {
			toastStore.trigger({
				message: 'No level to copy',
				background: 'variant-filled-error',
			});
			return;
		}
		const img = canvas.toBlob((blob) => {
			try {
				if (!navigator.clipboard) {
					throw new Error('Clipboard API not available');
				}

				if (!blob) {
					throw new Error('No image data');
				}
				navigator.clipboard.write([
					new ClipboardItem({
						'image/png': blob
					})
				]);

				toastStore.trigger({
					message: 'Image copied to clipboard',
					background: 'variant-filled-success',
				});
			} catch (e) {
				let errorMessage: string;
				if (e instanceof Error) {
					errorMessage = e.message;
				} else {
					errorMessage = 'An unknown error occurred';
				}

				toastStore.trigger({
					message: errorMessage,
					background: 'variant-filled-error',
				});
			}
		});
	}
</script>

<div class="level-height flex flex-1 flex-col gap-2 overflow-hidden">
	<label class="label">
		<span>Level Size</span>
		<select class="select" bind:value={scale}>
			<option value={8}>Small</option>
			<option value={16}>Medium</option>
			<option value={32}>Large</option>
		</select>
	</label>
	<div id={'level-viewer-container-' + id} class="flex-1 overflow-scroll" use:init />
	<div class="flex justify-between gap-2 w-full px-4">
		
		{#if courses.length > 1}
			<Paginator
				showFirstLastButtons={true}
				showPreviousNextButtons={true}
				showNumerals
				maxNumerals={1}
				settings={paginatorSettings}
				on:page={() => {
					setUp(courses, scale);
				}}
			/>
		{:else}
			<span />
		{/if}
		<button type="button" class="btn variant-filled" on:click={copyImageToClipboard}>
			<span class="icon"><i class="bx bxs-copy-alt" /></span>
			<span>Copy Level as Image</span>
		</button>
	</div>
</div>
