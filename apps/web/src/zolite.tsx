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

export const handNames = [
  'deck',
  'p1',
  'p2',
  'p3'
];

const handDeck = 0;
const handPlayer1 = 1;
const handPlayer2 = 2;
const handPlayer3 = 3;
const trickPlayer1 = 4;
const trickPlayer2 = 5;
const trickPlayer3 = 6;
const claimedPlayer1 = 7; // if P1 is big one
const claimedPlayer2 = 8; // if P2 is big one
const claimedPlayer3 = 9; // if P3 is big one
const claimedSmallOnes = 10;

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
      cards[shuffled[index]] = player + 1;
      index++;
    }
  }
  cards[shuffled[index]] = 0;
  index++;
  cards[shuffled[index]] = 0;

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
      console.log('zole not called or need to choose big one');
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

  