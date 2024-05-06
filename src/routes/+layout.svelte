<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import 'boxicons/css/boxicons.min.css';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
	
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<Toast />
<div class="flex w-full h-full flex-col">
	<AppBar>Mario Maker 1 Level Generator</AppBar>
	<div class="flex flex-1 overflow-hidden">
	<AppRail>
		<svelte:fragment slot="lead">
			<AppRailAnchor name="generate" title="generate" href="/" selected={activeUrl === '/'}>
				<svelte:fragment slot="lead"><i class="bx bxs-file-plus text-2xl" /></svelte:fragment>
				<span>Generate</span>
			</AppRailAnchor>
		</svelte:fragment>
		<!-- --- -->
		<AppRailAnchor name="viewer" title="viewer" href="/viewer" selected={activeUrl === '/viewer'}>
			<svelte:fragment slot="lead"><i class="bx bxs-image text-2xl" /></svelte:fragment>
			<span>Viewer</span>
		</AppRailAnchor>
	</AppRail>
	<div class="flex-1 flex overflow-hidden p-2">
		<slot></slot>
	</div>
	</div>
</div>
