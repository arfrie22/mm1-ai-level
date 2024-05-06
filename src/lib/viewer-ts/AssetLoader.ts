import { GameMode } from "./Course";

type GameModeAsset<T> = {
    [key in GameMode]: T;
};

const assetCourseThemes = [
    'overworld',
    'underground',
    'castle',
    'airship',
    'water',
    'ghostHouse'
];

export class AssetSource {
    monsters: GameModeAsset<Map<string, ArrayBuffer>>;
    tiles: GameModeAsset<Map<string, ArrayBuffer>[]>;

    constructor() {
        this.monsters = {
            [GameMode.SuperMarioBros]: new Map(),
            [GameMode.SuperMarioBros3]: new Map(),
            [GameMode.SuperMarioWorld]: new Map(),
            [GameMode.NewSuperMarioBrosU]: new Map()
        };

        const array = () => Array(assetCourseThemes.length).fill(null).map(() => new Map());

        this.tiles = {
            [GameMode.SuperMarioBros]: array(),
            [GameMode.SuperMarioBros3]: array(),
            [GameMode.SuperMarioWorld]: array(),
            [GameMode.NewSuperMarioBrosU]: array()
        };
    }

    async loadTiles(gameMode: GameMode, theme: string) {
        const response = await fetch(`/assets/tileset/${gameMode}-${theme}.png`);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        let image = new Image();
        image.src = URL.createObjectURL(blob);

        let bitmap = await createImageBitmap(image);


        // this.tiles[gameMode][assetCourseThemes.indexOf(theme)] = buffer;
    }

    public async loadAssets() {
        for (const gameMode of Object.values(GameMode)) {
            for (const theme of assetCourseThemes) {
                await this.loadTiles(gameMode, theme);
            }
        }
    }
}