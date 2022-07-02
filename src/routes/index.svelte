<script>
	import sowpods from '../sowpods.json';
	const fiveLetterWordList = sowpods.filter(
		(/** @type {string | any[]} */ word) => word.length == 5
	);

	let keyboard = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm', 'bck']
	];

	let filteredWords = [];

	let wordleQuery = [];
	let emptyTiles = [];
	for (let i = 0; i < 30; i++) {
		emptyTiles.push(' ');
	}
	function checkWord(word, filter) {
		let letterArr = word.split('');
		let isValid = true;
		filter.greenTiles.forEach((tile) => {
			if (!letterArr.includes(tile.letter)) {
				// console.log("word doesn't contain green tile");
				isValid = false;
			}
		});

		if (!isValid) return false;
		filter.yellowTiles.forEach((tile) => {
			if (!letterArr.includes(tile.letter)) {
				// console.log("word doesn't contain yellow tile");
				isValid = false;
			}
		});

		if (!isValid) return false;
		filter.greyLetters.forEach((letter) => {
			if (letterArr.includes(letter)) {
				// console.log('word contains grey letter');
				isValid = false;
			}
		});

		if (!isValid) return false;
		letterArr.forEach((letter, i) => {
			filter.greenTiles.forEach((tile) => {
				if (tile.pos == i) {
					if (tile.letter != letter) {
						// console.log("letter in green position doesn't match", tile.letter, letter);
						isValid = false;
					}
				}
			});
			filter.yellowTiles.forEach((tile) => {
				if (tile.pos == i) {
					if (tile.letter == letter) {
						// console.log('letter in yellow position matches');

						isValid = false;
					}
				}
			});
		});
		if (isValid) {
			return true;
		} else {
			return false;
		}
	}

	function handleKeydown(event) {
		console.log(event.key);
		console.log(wordleQuery);
		if (event.key == 'Backspace') {
			if (wordleQuery.length == 0) return;
			wordleQuery.pop();
			emptyTiles.push(' ');
		} else {
			if (wordleQuery.length == 30) return;
			emptyTiles.pop();
			wordleQuery.push({
				letter: event.key,
				color: 'grey'
			});
		}

		wordleQuery = wordleQuery;
		emptyTiles = emptyTiles;
	}

	function handleKeypress(letter) {
		if (letter == 'bck') {
			if (wordleQuery.length == 0) return;
			wordleQuery.pop();
			emptyTiles.push(' ');
		} else {
			if (wordleQuery.length == 30) return;
			emptyTiles.pop();
			wordleQuery.push({
				letter: letter,
				color: 'grey'
			});
		}

		wordleQuery = wordleQuery;
		emptyTiles = emptyTiles;
	}

	function handleFindWords() {
		var arrays = [],
			size = 5;

		for (let i = 0; i < wordleQuery.length; i += size) {
			arrays.push(wordleQuery.slice(i, i + size));
		}

		let filter = {
			greenTiles: [],
			yellowTiles: [],
			greyLetters: []
		};

		arrays.forEach((line) => {
			line.forEach((letter, i) => {
				if (letter.color == 'green') {
					letter.pos = i;
					filter.greenTiles.push(letter);
				}
				if (letter.color == 'yellow') {
					letter.pos = i;
					filter.yellowTiles.push(letter);
				}
				if (letter.color == 'grey') {
					letter.pos = i;
					filter.greyLetters.push(letter.letter);
				}
			});
		});

		filteredWords = fiveLetterWordList.filter((word) =>
			checkWord(word.toLocaleLowerCase(), filter)
		);

		console.log('filter:', filter);
		console.log(filteredWords);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<body class=" text-white gap-4 flex flex-col pt-10">
	<div class="flex flex-col gap-2 mx-auto">
		<div class="mx-auto grid gap-2 grid-cols-5">
			{#each wordleQuery as wordleQueryTile}
				<div
					on:click={() => {
						if (wordleQueryTile.color == 'grey') {
							wordleQueryTile.color = 'yellow';
						} else if (wordleQueryTile.color == 'yellow') {
							wordleQueryTile.color = 'green';
						} else if (wordleQueryTile.color == 'green') {
							wordleQueryTile.color = 'grey';
						}
					}}
					class="md:w-16 md:h-16 w-14 h-14 flex cursor-pointer font-bold text-2xl uppercase"
					class:yellowtile={wordleQueryTile.color == 'yellow'}
					class:greentile={wordleQueryTile.color == 'green'}
					class:greytile={wordleQueryTile.color == 'grey'}
				>
					<span class="m-auto">{wordleQueryTile.letter}</span>
				</div>
			{/each}
			{#each emptyTiles as emptyTile}
				<div class="md:w-16 md:h-16 w-14 h-14 flex cursor-pointer font-bold text-2xl greytile">
					{emptyTile}
				</div>
			{/each}
		</div>
	</div>
	<button
		on:click={handleFindWords}
		class="bg-[#818384] hover:bg-[#8e9091] text-white font-bold rounded-sm mx-auto px-4 py-3"
	>
		Find Words
	</button>
	<div class=" flex flex-col gap-1">
		{#each keyboard as keyboardLine}
			<div class="flex gap-1 mx-auto">
				{#each keyboardLine as key}
					<button
						class=" flex md:p-0 w-8 h-12 md:w-10 md:h-14 bg-[#818384] rounded-sm disable-dbl-tap-zoom"
						on:click={() => handleKeypress(key)}
					>
						<span class="m-auto">
							{key}
						</span>
					</button>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col w-32 mx-auto">
		{#each filteredWords as word}
			<p>{word.toLocaleLowerCase()}</p>
		{/each}
	</div>
</body>
