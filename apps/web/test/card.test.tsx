import {emptyDeck} from "../src/card"

describe('card module', () => {

    test('empty deck', () => {
        const deckSize = 10
        let cards = emptyDeck(deckSize)
        expect(cards.length).toBe(deckSize)
    });
});
