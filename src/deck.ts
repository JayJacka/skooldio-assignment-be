export function createDeck(): string[] {
	const suits = ["Clubs", "Hearts", "Spades", "Diamonds"];
	const ranks = [
		"Ace",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"Jack",
		"Queen",
		"King",
	];

	const deck: string[] = [];
	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push(`${rank} ${suit}`);
		}
	}
	return deck;
}

export function shuffleDeck(deck: string[]): void {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
}

export function drawCards(deck: string[], count: number): [string[], string[]] {
	const drawnCards = deck.splice(deck.length - count, count);
	return [drawnCards, deck];
}

export function calculateScore(hand: string[]): number {
	const faceCards = new Set(["King", "Queen", "Jack", "10"]);

	return hand.reduce((score, card) => {
		const rank = card.split(" ")[0];

		if (faceCards.has(rank)) return score + 0;
		if (rank === "Ace") return score + 1;
		return score + Number.parseInt(rank, 10);
	}, 0);
}
