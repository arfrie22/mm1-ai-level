import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const gen = env.GENERATOR_URL;
	if (!gen) {
		error(500, 'Generator URL not set');
	}

	const count = Number(url.searchParams.get('count') ?? '1');

	if (isNaN(count) || count < 1) {
		error(400, 'Invalid count');
	}

	const res = await fetch(`${gen}/generate?count=${count}`);
	if (!res.ok) {
		error(res.status, 'Failed to fetch from generator');
	}

	return res;
};