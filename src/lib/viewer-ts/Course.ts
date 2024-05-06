// 00 	u64 	Assumed to be a version number. Always 0xB (11) right now
// 08 	u32 	Checksum. Standard CRC32 of the entire file from offset 0x10 onwards.
// 0C 	padding 	4 unused bytes
// 10 	u16 	Creation year
// 12 	u8 	Creation month
// 13 	u8 	Creation day
// 14 	u8 	Creation hour
// 15 	u8 	Creation minute
// 16 	u8 	Unknown
// 17 	u8 	Unknown
// 18 	u64 	Unknown
// 20 	u8 	Unknown
// 21 	padding 	7 unused bytes
// 28 	u16[0x21] 	UCS-2 course name - 32 characters long plus zero terminator
// 6A 	char[2] 	Game mode ('M1', 'M3', 'MW', 'WU')
// 6C 	u8 	Unknown
// 6D 	u8 	Course theme (0 = overworld, 1 = underground, 2 = castle, 3 = airship, 4 = water, 5 = ghost house)
// 6E 	u8 	Unknown
// 6F 	u8 	Unknown
// 70 	u16 	Time limit
// 72 	u8 	Autoscroll (0 = none, 1 = slow, 2 = medium, 3 = fast)
// 73 	u8 	Flags
// 74 	u32 	Width
// 78 	u8[0x60] 	Mii data
// D8 	u32 	Unknown
// DC 	u32 	Unknown
// E0 	padding 	0xC unused bytes
// EC 	u32 	Object count
// F0 	obj_t[2600] 	Objects (note that the full size is reserved even if the course has less than 2600 objects)
// 145F0 	effect_t[300] 	Sound effects
// 14F50 	padding 	0xB0 unused bytes

import { CourseObject } from "./CourseObjects";

export enum GameMode {
    SuperMarioBros = 'M1',
    SuperMarioBros3 = 'M3',
    SuperMarioWorld = 'MW',
    NewSuperMarioBrosU = 'WU'
}

export enum CourseTheme {
    Overworld = 0,
    Underground = 1,
    Castle = 2,
    Airship = 3,
    Water = 4,
    GhostHouse = 5
}

export enum AutoScroll {
    None = 0,
    Slow = 1,
    Medium = 2,
    Fast = 3
}

export class Course {
    version: number;
    checksum: number;
    creationDate: Date;
    courseName: string;
    gameMode: GameMode;
    courseTheme: CourseTheme;
    timeLimit: number;
    autoScroll: AutoScroll;
    flags: number;
    width: number;
    miiData: number[];
    objectCount: number;
    objects: CourseObject[];

    constructor(
        version: number,
        checksum: number,
        creationDate: Date,
        courseName: string,
        gameMode: GameMode,
        courseTheme: CourseTheme,
        timeLimit: number,
        autoScroll: AutoScroll,
        flags: number,
        width: number,
        miidata: number[],
        objectCount: number,
        objects: CourseObject[]
    ) {
        this.version = version;
        this.checksum = checksum;
        this.creationDate = creationDate;
        this.courseName = courseName;
        this.gameMode = gameMode;
        this.courseTheme = courseTheme;
        this.timeLimit = timeLimit;
        this.autoScroll = autoScroll;
        this.flags = flags;
        this.width = width;
        this.miiData = miidata;
        this.objectCount = objectCount;
        this.objects = objects;
    }

    public static fromBuffer(buffer: ArrayBuffer): Course {
        let view = new DataView(buffer);
        let versionLow = view.getUint32(0x00);
        let versionHigh = view.getUint32(0x04);
        let version = versionLow + (versionHigh << 32);
        let checksum = view.getUint32(0x08);
        let creationYear = view.getUint16(0x10);
        let creationMonth = view.getUint8(0x12);
        let creationDay = view.getUint8(0x13);
        let creationHour = view.getUint8(0x14);
        let creationMinute = view.getUint8(0x15);
        let creationDate = new Date(creationYear, creationMonth - 1, creationDay, creationHour, creationMinute);

        // Parse name as UCS-2 using Little Endian
        let nameBytes = new ArrayBuffer(0x42);
        let nameView = new DataView(nameBytes);
        let nameLength = 0;
        for (nameLength = 0; nameLength < 0x21; nameLength++) {
            let value = view.getUint16(0x28 + nameLength * 2);
            if (value === 0) {
                break;
            }
            nameView.setUint16(nameLength * 2, value, true);
        }
        let courseName = new TextDecoder('ucs-2').decode(new Uint16Array(nameBytes, 0, nameLength));
        
        let gameMode = new TextDecoder('utf-8').decode(new Uint8Array(buffer, 0x6A, 0x02));
        let courseTheme = view.getUint8(0x6D);
        let timeLimit = view.getUint16(0x70);
        let autoScroll = view.getUint8(0x72);
        let flags = view.getUint8(0x73);
        let width = view.getUint32(0x74);
        let miiData = [];
        for (let i = 0; i < 0x60; i++) {
            miiData.push(view.getUint8(0x78 + i));
        }

        let objectCount = view.getUint32(0xEC);
        let objects = [];
        for (let i = 0; i < objectCount; i++) {
            objects.push(CourseObject.fromBuffer(buffer, 0xF0 + i * 0x20));
        }

        objects = objects.sort((a, b) => {
            if (a.z < b.z) {
                return -1;
            } else if (a.z > b.z) {
                return 1;
            } else {
                return 0;
            }
        });
        
        return new Course(
            version,
            checksum,
            creationDate,
            courseName,
            gameMode as GameMode,
            courseTheme as CourseTheme,
            timeLimit,
            autoScroll as AutoScroll,
            flags,
            width,
            miiData,
            objectCount,
            objects
        );
    }

    public blockWidth(): number {
        return this.width / 16;
    }
}