export function createDeck(): string[] {
    const suits = ["Clubs", "Hearts", "Spades", "Diamonds"];
    const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
    return suits.flatMap((suit) => ranks.map((rank) => `${rank} ${suit}`));
  }
  
  export function shuffleDeck(deck: string[]): string[] {
    const shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  }
  
  export function drawCards(deck: string[], count: number): [string[], string[]] {
    const drawnCards = deck.slice(-count);
    const remainingDeck = deck.slice(0, -count);
    return [drawnCards, remainingDeck];
  }
  
  export function calculateScore(hand: string[]): number {
    return hand.reduce((score, card) => {
      const rank = card.split(" ")[0];
      if (["King", "Queen", "Jack", "10"].includes(rank)) return score + 0;
      if (rank === "Ace") return score + 1;
      return score + Number.parseInt(rank, 10);
    }, 0);
  }