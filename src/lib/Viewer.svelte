<script lang="ts">
	import { Draw as DrawCourse } from './viewer/Draw';
	import type { CourseData } from './convert';
	import { Paginator } from '@skeletonlabs/skeleton';

	let scale = 16;
	
	export let id = "";
	export let courses: CourseData[];
	let paginatorSettings = { amounts: [], size: courses.length, page: 1, limit: 1 };

	let divId = "level-viewer-container-"+id;

	async function setUp(courses: CourseData[], scale: number) {
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
	<div id={"level-viewer-container-"+id} class="flex-1 overflow-scroll" use:init>
		<canvas id="canvas"></canvas>
	</div>
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
	{/if}
</div>