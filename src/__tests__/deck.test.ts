import { describe, it, expect } from "vitest";
import { createDeck, shuffleDeck, drawCards, calculateScore } from "../deck";

describe("Deck utilities", () => {
  it("should create a deck of 52 cards", () => {
    // arrange
    
    // act
    const deck = createDeck();

    // assert
    expect(deck).toHaveLength(52);
  });

  it("should shuffle the deck", () => {
    // arrange
    const deck = createDeck();

    // act
    const shuffledDeck = shuffleDeck(deck);

    // assert
    expect(shuffledDeck).not.toEqual(deck);
  });

  it("should draw cards and return remaining deck", () => {
    // arrange
    const deck = createDeck();

    // act
    const [drawnCards, remainingDeck] = drawCards(deck, 2);

    // assert
    expect(drawnCards).toHaveLength(2);
    expect(remainingDeck).toHaveLength(50);
  });

  it("should calculate correct score for a hand", () => {
    // arrange
    const hand = ["Ace Hearts", "10 Spades", "5 Diamonds"];

    // act
    const score = calculateScore(hand);

    // assert
    expect(score).toBe(6);
  });
});