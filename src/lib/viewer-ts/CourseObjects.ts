export interface Drawable {
    draw(context: CanvasRenderingContext2D, scale: number, height: number): void;
}

export class CourseObject implements Drawable {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    flags: number;
    childFlags: number;
    extendedData: number;
    blockType: number;
    childBlockType: number;
    linkId: number;
    effectId: number;
    transform: number;
    childTransform: number;

    constructor(
        x: number,
        z: number,
        y: number,
        width: number,
        height: number,
        flags: number,
        childFlags: number,
        extendedData: number,
        blockType: number,
        childBlockType: number,
        linkId: number,
        effectId: number,
        transform: number,
        childTransform: number
    ) {
        this.x = x;
        this.z = z;
        this.y = y;
        this.width = width;
        this.height = height;
        this.flags = flags;
        this.childFlags = childFlags;
        this.extendedData = extendedData;
        this.blockType = blockType;
        this.childBlockType = childBlockType;
        this.linkId = linkId;
        this.effectId = effectId;
        this.transform = transform;
        this.childTransform = childTransform;
    }

    static fromBuffer(buffer: ArrayBuffer, offset: number): CourseObject {
        const view = new DataView(buffer, offset);
        let x = view.getUint32(0x00);
        x = Math.floor(x / 160);
        let z = view.getUint32(0x04);
        z = Math.floor(z / 160);
        let y = view.getInt16(0x08);
        y = Math.floor(y / 160);
        let width = view.getInt8(0x0a);
        let height = view.getInt8(0x0b);
        let flags = view.getUint32(0x0c);
        let childFlags = view.getUint32(0x10);
        let extendedData = view.getUint32(0x14);
        let blockType = view.getInt8(0x18);
        let childBlockType = view.getInt8(0x19);
        let linkId = view.getInt16(0x1a);
        let effectId = view.getInt16(0x1c);
        let transform = view.getInt8(0x1e);
        let childTransform = view.getInt8(0x1f);

        return new CourseObject(
            x,
            z,
            y,
            width,
            height,
            flags,
            childFlags,
            extendedData,
            blockType,
            childBlockType,
            linkId,
            effectId,
            transform,
            childTransform
        );
    }

    public draw(context: CanvasRenderingContext2D, scale: number, height: number): void {
        context.fillStyle = "black";
        let y = height - (this.y + this.height) * scale;
        context.fillRect(this.x * scale, y, this.width * scale, this.height * scale);
        context.fillStyle = "white";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.font = Math.floor(scale * 3/4) + "px sans-serif";
        context.fillText(this.blockType.toString(), this.x * scale, y);
    }
}

export enum Blocks {
    RengaBlock = 4,
    HatenaBlock = 5,
    HardBlock = 6,
    Ground = 7,
    Coin = 8,
    Dokan = 9,
    GroundMushroom = 14,
    GroundBox = 16,
    Bridge = 17,
    ChikuwaBlock = 21,
    KumoBlock = 22,
    OnpuBlock = 23,
    GroundGoal = 26,
    ClearBlock = 29,
    GroundStart = 37,
    Toge = 43,
    CastleBridge = 49,
    BeltConveyor = 53,
    Rail = 59,
    IceBlock = 63,
    Tsuta = 64,
}

export class Block extends CourseObject {

}