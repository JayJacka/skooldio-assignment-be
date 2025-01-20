import readline from "node:readline";
import { createDeck, shuffleDeck, drawCards, calculateScore } from "./deck";

async function askQuestion(query: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer);
		}),
	);
}

async function getBet(chips: number): Promise<number> {
	let bet: number;
	while (true) {
		const betInput = await askQuestion(
			`You have ${chips} chips. Place your bet: `,
		);
		bet = Number.parseInt(betInput, 10);
		if (!Number.isNaN(bet) && bet > 0 && bet <= chips) {
			break;
		}
		console.log("Invalid bet amount. Try again.");
	}
	return bet;
}

async function playRound(chips: number): Promise<number> {
	const bet = await getBet(chips);

	const deck = shuffleDeck(createDeck());
	const [playerHand, updatedDeck] = drawCards(deck, 2);
	const [dealerHand, _] = drawCards(updatedDeck, 2);

	const playerScore = calculateScore(playerHand);
	const dealerScore = calculateScore(dealerHand);

	console.log(
		`Your hand: ${playerHand.map((card) => `${card.split(" ")[1]}-${card.split(" ")[0]}`).join(", ")} (Score: ${playerScore})`,
	);
	console.log(
		`Dealer's hand: ${dealerHand.map((card) => `${card.split(" ")[1]}-${card.split(" ")[0]}`).join(", ")} (Score: ${dealerScore})`,
	);

	let updatedChips = chips;
	if (playerScore > dealerScore) {
		console.log("You win!");
		updatedChips += bet;
	} else if (playerScore === dealerScore) {
		console.log("It's a tie!");
	} else {
		console.log("You lose!");
		updatedChips -= bet;
	}

	console.log(`Chips remaining: ${updatedChips}`);
	return updatedChips;
}

export async function startGame(): Promise<void> {
	console.log("Welcome to the Pok Deng!");
	console.log(
		"Rules: Ace = 1 point, 2-9 = face value, King/Queen/Jack/10 = 0 points.",
	);
	console.log(
		"You will start with 100 chips. Place your bet and try to beat the dealer!",
	);
	let chips = 100;

	while (chips > 0) {
		chips = await playRound(chips);

		if (chips > 0) {
			let continuePlaying: string;
			while (true) {
				continuePlaying = await askQuestion("Play another round? (yes/no): ");
				if (
					continuePlaying.toLowerCase() === "yes" ||
					continuePlaying.toLowerCase() === "no"
				) {
					break;
				}
				console.log("Invalid input. Please type 'yes' or 'no'.");
			}
			if (continuePlaying.toLowerCase() !== "yes") break;
		} else {
			console.log("You are out of chips!");
		}
	}

	console.log(`Game over! You finished with ${chips} chips.`);
}
