export type Tile = {
	letter: string;
	color: string;
	position?: number;
};

export type WordleFilter = {
	greyLetters: string[];
	greenTiles: Tile[];
	yellowTiles: Tile[];
};
