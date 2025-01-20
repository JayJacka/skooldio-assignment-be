import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { startGame } from "../game";
import readline from "node:readline";
import { createDeck, shuffleDeck, drawCards, calculateScore } from "../deck";

vi.mock("readline");
vi.mock("../deck");

describe("startGame", () => {
    let questionMock: Mock;
    let closeMock: Mock;

    beforeEach(() => {
        questionMock = vi.fn();
        closeMock = vi.fn();

        vi.mocked(readline.createInterface).mockReturnValue({
            question: questionMock,
            close: closeMock,
        } as unknown as readline.Interface);
    });

    const mockInputSequence = (inputs: string[]) => {
        let callIndex = 0;
        questionMock.mockImplementation((_, callback) => {
            const input = inputs[callIndex];
            callIndex++;
            callback(input);
        });
    };

    it("should play a game and end when user runs out of chips", async () => {
        // arrange
        mockInputSequence(["10", "no"]);

        vi.mocked(createDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(shuffleDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(drawCards)
            .mockReturnValueOnce([["2 H", "3 D"], ["4 S", "5 C"]])
            .mockReturnValueOnce([["4 S", "5 C"], []]);
        vi.mocked(calculateScore)
            .mockReturnValueOnce(5) // Player score
            .mockReturnValueOnce(9); // Dealer score

        // act
        await startGame();

        // assert
        expect(questionMock).toHaveBeenCalledWith(
            "You have 100 chips. Place your bet: ",
            expect.any(Function),
        );
        expect(questionMock).toHaveBeenCalledWith(
            "Play another round? (yes/no): ",
            expect.any(Function),
        );
        expect(closeMock).toHaveBeenCalled();
    });

    it("should handle invalid bet and ask again", async () => {
        // arrange
        mockInputSequence(["invalid", "10", "no"]);

        vi.mocked(createDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(shuffleDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(drawCards)
            .mockReturnValueOnce([["2 H", "3 D"], ["4 S", "5 C"]])
            .mockReturnValueOnce([["4 S", "5 C"], []]);
        vi.mocked(calculateScore)
            .mockReturnValueOnce(5)
            .mockReturnValueOnce(9);

        // act
        await startGame();

        // assert
        expect(questionMock).toHaveBeenCalledWith(
            "You have 100 chips. Place your bet: ",
            expect.any(Function),
        );
        expect(questionMock).toHaveBeenCalledWith(
            "Play another round? (yes/no): ",
            expect.any(Function),
        );
        expect(closeMock).toHaveBeenCalled();
    });

    it("should end game when user chooses not to continue", async () => {
        // arrange
        mockInputSequence(["10", "yes", "10", "no"]);

        // round 1
        vi.mocked(createDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(shuffleDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(drawCards)
            .mockReturnValueOnce([["2 H", "3 D"], ["4 S", "5 C"]])
            .mockReturnValueOnce([["4 S", "5 C"], []]);
        vi.mocked(calculateScore)
            .mockReturnValueOnce(5)
            .mockReturnValueOnce(9);

        // round 2
        vi.mocked(createDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(shuffleDeck).mockReturnValue(["2 H", "3 D", "4 S", "5 C"]);
        vi.mocked(drawCards)
            .mockReturnValueOnce([["2 H", "3 D"], ["4 S", "5 C"]])
            .mockReturnValueOnce([["4 S", "5 C"], []]);
        vi.mocked(calculateScore)
            .mockReturnValueOnce(5)
            .mockReturnValueOnce(9);

        // act
        await startGame();

        // assert
        expect(questionMock).toHaveBeenCalledWith(
            "You have 100 chips. Place your bet: ",
            expect.any(Function),
        );
        expect(questionMock).toHaveBeenCalledWith(
            "Play another round? (yes/no): ",
            expect.any(Function),
        );
        expect(questionMock).toHaveBeenCalledWith(
            "You have 90 chips. Place your bet: ",
            expect.any(Function),
        );
        expect(questionMock).toHaveBeenCalledWith(
            "Play another round? (yes/no): ",
            expect.any(Function),
        );
        expect(closeMock).toHaveBeenCalled();
    });
});