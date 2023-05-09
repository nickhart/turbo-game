import React, { ReactNode } from 'react';
import { Card } from './card'
import { shuffle } from './shuffle';

export type ZoliteContextType = {

};

const ZoliteContext = React.createContext<ZoliteContextType | null>(null);

export type Props = {
  children: ReactNode;
};

function ZoliteProvider(props: Props) {
  const {children} = props;
  const [state, setState] = React.useState(null);
  const value = {state, setState}
  return (
    <ZoliteContext.Provider value={value}>
      {children}
    </ZoliteContext.Provider>
  )
}

const useZolite = () => React.useContext(ZoliteContext);

export {ZoliteProvider, useZolite};

export const numCards = 26;
export const numPlayers = 3;
export const numRounds = 8;
export const numZoleCards = 2;

// should be renamed to locationNames... it's all about the locations
export const handNames = [
  'deck',       // 0
  'p1 hand',    // 1
  'p2 hand',    // 2
  'p3 hand',    // 3

  'unused1',     // 4
  'p1 trick',   // 5
  'p2 trick',   // 6
  'p3 trick',   // 7

  'small won',  // 8
  'p1 won',     // 9
  'p2 won',     // 10
  'p3 won',     // 11

  'unused2',     // 12
  'p1 zole',    // 13
  'p2 zole',    // 14
  'p3 zole',    // 15
];

// rename to consistent locName (locTrick1. etc...)
const handDeck = 0;
const handPlayer1 = 1;
const handPlayer2 = 2;
const handPlayer3 = 3;
// unused 1
const trickPlayer1 = 5;
const trickPlayer2 = 6;
const trickPlayer3 = 7;

const claimedSmallOnes = 8;
const claimedPlayer1 = 9;
const claimedPlayer2 = 10;
const claimedPlayer3 = 11;
// unused 2
const zolePlayer1 = 13;
const zolePlayer2 = 14;
const zolePlayer3 = 15;

const numLocations = 16;

// TODO: need some kind of memory
// const playedPlayer1 = 11;
// const playedPlayer2 = 12;
// const playedPlayer3 = 13;




const gameDeck: Array<Card> = [
  { index: 0, suit: 0, rank: 0, points: 3, name: 'QC'},
  { index: 1, suit: 0, rank: 1, points: 3, name: 'QS'},
  { index: 2, suit: 0, rank: 2, points: 3, name: 'QH'},
  { index: 3, suit: 0, rank: 3, points: 3, name: 'QD'},
  { index: 4, suit: 0, rank: 4, points: 2, name: 'JC'},
  { index: 5, suit: 0, rank: 5, points: 2, name: 'JS'},
  { index: 6, suit: 0, rank: 6, points: 2, name: 'JH'},
  { index: 7, suit: 0, rank: 7, points: 2, name: 'JD'},
  { index: 8, suit: 0, rank: 8, points: 11, name: 'AD'},
  { index: 9, suit: 0, rank: 9, points: 10, name: 'TD'},
  { index: 10, suit: 0, rank: 10, points: 4, name: 'KD'},
  { index: 11, suit: 0, rank: 11, points: 0, name: '9D'},
  { index: 12, suit: 0, rank: 12, points: 0, name: '8D'},
  { index: 13, suit: 0, rank: 13, points: 0, name: '7D'},

  { index: 14, suit: 1, rank: 8, points: 11, name: 'AC'},
  { index: 15, suit: 1, rank: 9, points: 10, name: 'TC'},
  { index: 16, suit: 1, rank: 10, points: 4, name: 'KC'},
  { index: 17, suit: 1, rank: 11, points: 0, name: '9C'},

  { index: 18, suit: 2, rank: 8, points: 11, name: 'AS'},
  { index: 19, suit: 2, rank: 9, points: 10, name: 'TS'},
  { index: 20, suit: 2, rank: 10, points: 4, name: 'KS'},
  { index: 21, suit: 2, rank: 11, points: 0, name: '9S'},

  { index: 22, suit: 2, rank: 8, points: 11, name: 'AH'},
  { index: 23, suit: 2, rank: 9, points: 10, name: 'TH'},
  { index: 24, suit: 2, rank: 10, points: 4, name: 'KH'},
  { index: 25, suit: 2, rank: 11, points: 0, name: '9H'}
];

export function calculateWinner(cards: Array<number>) {
    return null;
}
  
export function extractHands(cards: Array<number>): Array<Array<Card>> {
    let hands: Card[][] = [[], [], [], []];
  
    cards.forEach((item: number, index: number) => {
      const hand: Array<Card> = hands[item];
      const card = gameDeck[index];
      hand.push(card);
    });
  
    return hands;
}

export function dealCards(): Array<number> {
  const newCards = Array.from(Array(numCards).keys());
  const shuffled = shuffle(newCards);

  let cards = Array.from(Array(numCards).keys());

  let index = 0;
  for (let round = 0; round != numRounds; ++round) {
    for (let player = 0; player != numPlayers; ++player) {
      cards[shuffled[index]] = player + handPlayer1;
      index++;
    }
  }
  cards[shuffled[index]] = handDeck;
  index++;
  cards[shuffled[index]] = handDeck;

  return cards;
}

export function pickupCards(cards: Array<number>, player: number): Array<number> {
  // move all the cards in the deck to the specified player's hand
  for (let index = 0; index != numCards; ++index) {
    if (cards[index] === handDeck) {
      cards[index] = player + handPlayer1;
    }
  }

  return cards;
}

export function callZole(cards: Array<number>, player: number): Array<number> {
  // move all the cards in the deck to the specified player's "zole" hand (can't look at them)
  for (let index = 0; index != numCards; ++index) {
    if (cards[index] === handDeck) {
      cards[index] = player + handPlayer1;
    }
  }

  return cards;
}

export function deduceState(cards: Array<number>) {
    console.log('deduceState...');
    let round = 0;
    const leader = 0;
    const turn = 0;
    let calledZole = false;
  
    const hands = extractHands(cards);
  
    const numDeckCards = hands[handDeck].length;
    if (numDeckCards === 0) {
      calledZole = true;
      console.log('called Zole');
    }
    else if (numDeckCards === numZoleCards) {
      console.log('need to select the big one');
    }
    else {
      console.log('indeterminate state--need to finish dealing?');
    }
  
    if (hands[trickPlayer1]) {
      console.log('player 1 played');
    }
    else if (hands[trickPlayer2]) {
      console.log('player 2 played');
    }
    else if (hands[trickPlayer3]) {
      console.log('player 3 played');
    }
  
    let numCardsClaimed = 0;
    if (hands[claimedPlayer1]) {
      numCardsClaimed += hands[claimedPlayer1].length;
    }
    else if (hands[claimedPlayer2]) {
      numCardsClaimed += hands[claimedPlayer2].length;
    }
    else if (hands[claimedPlayer3]) {
      numCardsClaimed += hands[claimedPlayer3].length;
    }
    if (hands[claimedSmallOnes]) {
      numCardsClaimed += hands[claimedSmallOnes].length;
    }
    if (!calledZole) {
      numCardsClaimed -= numZoleCards;
    }
    if (numCardsClaimed > 0) {
      console.log(`numCardsClaimed: ${numCardsClaimed}`);
      round = numCardsClaimed / numPlayers;
      // assert this is an integer?
      console.log(`round: ${round}`);
    }
  
    console.log('...deduceState');
    return { round,
             leader,
             turn,
             calledZole };
  }

  