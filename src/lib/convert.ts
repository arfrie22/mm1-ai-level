// pub fn level_from_img(img: &RgbImage, y_offset: u32) -> Level {
//     let mut x = 0;

// pub fn uncolorize_u16(color: &Rgb<u8>) -> u16 {
//     let r = color.0[0] as u16;
//     let g = color.0[1] as u16;
//     let b = color.0[2] as u16;
//     (r >> 2) | ((g & 0xFC) << 4) | ((b & 0xFC) << 10)
// }

// pub fn colorize_u8(data: u8) -> Rgb<u8> {
//     colorize_u16((data as u16) << 8)
// }

// pub fn uncolorize_u8(color: &Rgb<u8>) -> u8 {
//     (uncolorize_u16(color) >> 8) as u8
// }

// pub fn u16_from_i8(data: i8) -> u16 {
//     (data as u8) as u16
// }

import { CourseObject } from './viewer/CourseObject';
import { Course } from './viewer/Course';
import { BlockObject } from './viewer/BlockObject';
import { MonsterObject } from './viewer/MonsterObject';

//     let game_mode =
//         GameMode::try_from(uncolorize_u8(img.get_pixel(x, y_offset)) >> 6).unwrap_or_default();
//     x += 1;

//     let course_theme =
//         CourseTheme::try_from(uncolorize_u8(img.get_pixel(x, y_offset)) >> 5).unwrap_or_default();
//     x += 1;

//     let time_limit = uncolorize_u16(img.get_pixel(x, y_offset));
//     x += 1;

//     let auto_scroll =
//         AutoScroll::try_from(uncolorize_u8(img.get_pixel(x, y_offset)) >> 6).unwrap_or_default();
//     x += 1;

//     let flags = uncolorize_u8(img.get_pixel(x, y_offset));
//     x += 1;

//     let mut width = 0u32;
//     for i in 0..4 {
//         width |= (uncolorize_u8(img.get_pixel(x, y_offset)) as u32) << (i * 8);
//         x += 1;
//     }
//     width = width.min(240 * 16);

//     let mut objects = Vec::new();
//     const SCALE: u32 = 160;
//     for y in 0..27 {
//         if objects.len() == 2600 {
//             break;
//         }

//         for x in 0..240 {
//             let x_pos = x * SCALE;
//             let y_pos = y as i16 * SCALE as i16;

//             let obj_type = uncolorize_u16(img.get_pixel(x, y + y_offset + 1));
//             let object_type = (obj_type >> 8) as i8;
//             if object_type == 0 {
//                 continue;
//             }
//             let transformation_id = obj_type as i8;

//             let z_position = (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27)) as u32) << 16
//                 | (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 2)) as u32);

//             let object_flags = (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 3)) as u32)
//                 << 16
//                 | (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 4)) as u32);

//             let size = uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 5));
//             let width = (size >> 8) as i8;
//             let height = size as i8;

//             let child_obj_type = uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 6));
//             let child_object_type = (child_obj_type >> 8) as i8;
//             let child_object_transformation_id = child_obj_type as i8;

//             let child_object_flags =
//                 (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 7)) as u32) << 16
//                     | (uncolorize_u16(img.get_pixel(x, y + y_offset + 1 + 27 * 8)) as u32);

//             let object = Object {
//                 x_position: x_pos,
//                 y_position: y_pos,
//                 z_position,
//                 object_type,
//                 transformation_id,
//                 object_flags,
//                 width,
//                 height,
//                 child_object_type,
//                 child_object_transformation_id,
//                 child_object_flags,
//                 extended_object_data: 0,
//                 link_id: -1,
//                 effect_index: -1,
//             };

//             objects.push(object);

//             if objects.len() == 2600 {
//                 break;
//             }
//         }
//     }

//     let mut hasher = AHasher::default();
//     img.hash(&mut hasher);

//     let image_hash = hasher.finish();
//     let mut rng = StdRng::seed_from_u64(image_hash);
//     let level_name = loop {
//         let name = Petnames::default().generate(&mut rng, 2, "-").unwrap();
//         if name.len() <= 28 {
//             break name;
//         }
//     };

//     Level {
//         course_theme,
//         time_limit,
//         auto_scroll,
//         flags,
//         width,
//         objects,
//         version: 0,
//         creation_time: Local::now().naive_local(),
//         level_name,
//         game_mode,
//         mii_data: [0; 96],
//         sound_effects: Vec::new(),
//     }
// }

function uncolorize_u16(data: Uint8ClampedArray): number {
	const r = data[0];
	const g = data[1];
	const b = data[2];
	return (r >> 2) | ((g & 0xfc) << 4) | ((b & 0xfc) << 10) % 0xFFFF;
}

function uncolorize_u8(data: Uint8ClampedArray): number {
	return uncolorize_u16(new Uint8ClampedArray([data[0], data[1], data[2]])) >> 8;
}

function to_i8(data: number): number {
	return ((data & 0xff) << 24) >> 24;
}

export type CourseData = { course: Course; objects: CourseObject[] };

async function parse_level(
	ctx: CanvasRenderingContext2D,
	x_offset: number,
	y_offset: number
): Promise<CourseData> {
	const game_mode = uncolorize_u8(ctx.getImageData(x_offset, y_offset, 1, 1).data) >> 6;
	const course_theme = uncolorize_u8(ctx.getImageData(x_offset + 1, y_offset, 1, 1).data) >> 5;
	const time_limit = uncolorize_u16(ctx.getImageData(x_offset + 2, y_offset, 1, 1).data);
	const auto_scroll = uncolorize_u8(ctx.getImageData(x_offset + 3, y_offset, 1, 1).data) >> 6;
	const flags = uncolorize_u8(ctx.getImageData(x_offset + 4, y_offset, 1, 1).data);
	let width = 0;
	for (let i = 0; i < 4; i++) {
		width |= uncolorize_u8(ctx.getImageData(x_offset + 5 + i, y_offset, 1, 1).data) << (i * 8);
	}
	width = Math.min(width, 240 * 16);

	const objects: CourseObject[] = [];
	const SCALE = 160;

	for (let y = 0; y < 27; y++) {
		if (objects.length === 2600) {
			break;
		}

		for (let x = 0; x < 240; x++) {
			const x_pos = x * SCALE;
			const y_pos = y * SCALE;

			const obj_type = uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1, 1, 1).data);
			const object_type = to_i8(obj_type >> 8);
			if (object_type === 0) {
				continue;
			}
			const transformation_id = to_i8(obj_type);

			const z_position =
				(uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27, 1, 1).data) << 16) |
				uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 2, 1, 1).data);

			const object_flags =
				(uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 3, 1, 1).data) << 16) |
				uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 4, 1, 1).data);

			const size = uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 5, 1, 1).data);
			const width = to_i8(size >> 8);
			const height = to_i8(size);

			const child_obj_type = uncolorize_u16(
				ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 6, 1, 1).data
			);
			const child_object_type = to_i8(child_obj_type >> 8);
			const child_object_transformation_id = to_i8(child_obj_type);

			const child_object_flags =
				(uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 7, 1, 1).data) << 16) |
				uncolorize_u16(ctx.getImageData(x_offset + x, y + y_offset + 1 + 27 * 8, 1, 1).data);

			const object = new CourseObject({
				x: Math.round(x_pos / 160),
				y: Math.round(y_pos / 160),
				z: Math.round(z_position / 160),
				width,
				height,
				flags: object_flags,
				childFlags: child_object_flags,
				extendedData: 0,
				type: object_type,
				childType: child_object_type,
				linkId: -1,
				effect: -1,
				transform: transformation_id,
				childTransform: child_object_transformation_id
			});

			const type = object.type;
			/* is Block? or Monster? */
			const typedObject = BlockObject.is(type)
			? new BlockObject(object)
			: MonsterObject.is(type)
				? new MonsterObject(object)
				: object;
			objects.push(typedObject);
		}
	}

	const themesMap = {
		0: 'overworld',
		1: 'underground',
		2: 'castle',
		3: 'airship',
		4: 'water',
		5: 'ghostHouse'
	};

	const themeName = themesMap[course_theme as keyof typeof themesMap];
	const modeMap = {
		0: 'M1',
		1: 'M3',
		2: 'MW',
		3: 'WU'
	};

	const mode = modeMap[game_mode as keyof typeof modeMap];

	const course = new Course({
		version: 0,
		checksum: 0,
		year: 0,
		month: 0,
		day: 0,
		hour: 0,
		minute: 0,
		name: '',
		mode,
		theme: course_theme,
		themeName,
		timeLimit: time_limit,
		scroll: auto_scroll,
		scrollName: 'Fast',
		flags,
		areaWidth: width,
		objectCount: objects.length
	});

	return {
		course,
		objects
	};
}

export async function level_from_img(
	img: Blob,
): Promise<{
	levels: CourseData[];
	width: number;
	height: number;
}> {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Failed to get 2d context');
	}

	const image = new Image();
	image.src = URL.createObjectURL(img);
	await image.decode();
	canvas.width = image.width;
	canvas.height = image.height;
	ctx.drawImage(image, 0, 0);


	const imageSize = 256;
	const width = Math.floor(image.width / imageSize);
	const height = Math.floor(image.height / imageSize);

	if (!width || !height) {
		throw new Error('Invalid image size');
	}

	const levels: CourseData[] = [];

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const { course, objects } = await parse_level(ctx, x * imageSize, y * imageSize);
			levels.push({ course, objects });
		}
	}

	return {
		levels,
		width,
		height
	};
}
