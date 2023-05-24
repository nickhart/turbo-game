import React from 'react';
import { shuffle } from './shuffle';
import { numPlayers, numRounds, numCards } from './zolite';
import { assert } from 'console';

// TODO: needs interface?
export type Card = {
  index: number;
  suit: number;
  rank: number;
  points: number;
  name: string;
};

export function Card(props: any) {
  return (
    <button className="card" onClick={props.onClick} key={props.cardKey}>
      {props.value}
    </button>
  );
}

export enum Location {
  None = 0,
  Choose,
  Hand,
  Discarded,
  Zole,
  Trick,
  Claimed,
  NumLocations
};


const LocationNames = [
  "None",
  "Choose",
  "Hand",
  "Discarded",
  "Zole",
  "Trick",
  "Claimed"
];

function playerCanSeeCard(cards: Deck, player: Player, index: number): boolean {
  const card = cards[index];
  switch (card.location) {
    case Location.Trick: 
      return true;
    case Location.Hand:
    case Location.Choose:
    case Location.Discarded:
      return player === card.dealt;
    case Location.Claimed:
      return true; // there is some opportunity to filter/control access to memory of what was played
  };

  return false;
}

export function getLocationName(location: Location) {
  assert(location >= Location.None && location < Location.NumLocations);
  return LocationNames[location];
}

export enum Player {
  None = 0,
  Player1,
  Player2,
  Player3,
  NumPlayers
};

const PlayerNames = [
  "None",
  "Player 1",
  "Player 2",
  "Player 3"
];

export function getPlayerName(player: Player) {
  assert(player >= Player.None && player < Player.NumPlayers);
  return PlayerNames[player];
}

function nextPlayer(player: Player): Player {
  return ((player + 1) % Player.NumPlayers) + Player.Player1;
}

export type CardState = {
  dealt: Player;
  location: Location;
  order: number;
  winner: Player;
  wasVoid: boolean;
}

export type Deck = CardState[];
export type CardIndex = number;
export type CardSet = CardIndex[];

export const emptyCard = { dealt: Player.None, location: Location.Hand, winner: Player.None, wasLed: false, wasVoid: false, wasShown: false };

export function emptyDeck(size: number): Deck {
  return new Array(size).fill(emptyCard);
}

function dealCards(cards: Deck, leader: Player) {
  const deckSize = cards.length;
  const newDeck = Array.from({ length: deckSize }, (_, index) => index);
  console.log(`newDeck: ${newDeck}`);
  const shuffled = shuffle(newDeck);
  console.log(`shuffled: ${shuffled}`);

  // deal 8 cards to each
  const playerIds = [ Player.Player1, Player.Player2, Player.Player3];
  let index = 0;
  for (let round = 0; round !== numRounds; ++round) {
    for (let player = 0; player !== numPlayers; ++player) {
      dealCard(cards, shuffled[index++], playerIds[player]);
    }
  }
  // deal the last two to the choose pile and assign to the leader
  makeChooseCard(cards, shuffled[index++], leader);
  makeChooseCard(cards, shuffled[index++], leader);
}

function dealCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(player !== Player.None);
  assert(cardState.dealt === Player.None);
  assert(cardState.location === Location.None);
  assert(cardState.winner === Player.None);
  assert(cardState.order === 0);
  cardState.dealt = player;
  cardState.location = Location.Hand;
}

function makeChooseCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(cardState.dealt === Player.None);
  assert(cardState.order === 0);
  assert(cardState.location === Location.None);
  cardState.dealt = player;
  cardState.location = Location.Choose;
}

function passCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index]; // if this reaches NumPlayers, then game over and add a branch
  assert(cardState.order != numPlayers);
  assert(cardState.dealt === player);
  assert(cardState.location === Location.Choose);
  cardState.dealt = nextPlayer(player);
  cardState.order++;
}

function pickUpCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(cardState.order != numPlayers); // should not have passed around
  assert(cardState.dealt === player);
  assert(cardState.location === Location.Choose);
  cardState.location = Location.Hand;
  cardState.order = 0;
}

function makeZoleCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(cardState.order != numPlayers); // should not have passed around
  assert(cardState.dealt === Player.None);
  assert(cardState.location === Location.Hand);
  cardState.location = Location.Zole;
  cardState.order = 0;
}

function discardCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(cardState.dealt === player);
  assert(cardState.location === Location.Hand);
  cardState.location = Location.Discarded;
}

function playCard(cards: Deck, index: number, player: Player, order: number) {
  let cardState = cards[index];
  assert(cardState.dealt === player);
  assert(cardState.order === 0);
  cardState.location = Location.Trick;
  
  let trickCards = cardsInLocation(cards, Location.Trick);

  cardState.order = trickCards.length;
}

function claimCard(cards: Deck, index: number, player: Player) {
  let cardState = cards[index];
  assert(cardState.winner === Player.None);
  cardState.winner = player;
  cardState.location = Location.Claimed;
}

// rewrite this, sort by the order attribute
// this is the one set of cards where order is actually important
// function orderedCards(cards: CardSet, leader: Player): CardSet {
//   return cards.sort();
// }

export function cardsInLocation(cards: Deck, location: Location, player: Player = Player.None): number[] {
  let result: number[] = [];

  const numCards = cards.length;
  for (let index = 0; index !== numCards; ++index) {
    const card = cards[index];
    if (card.location === location) {
      // Player.None (ie: computer) can look at any card.
      // Otherwise whoever was dealt the card can see it,
      // or it's in the trick (ie: it's in sight),
      // or it's been claimed (ie: we have perfect memory of what has been played)
      if (player === Player.None || 
          player === card.dealt || 
          location === Location.Trick ||
          location === Location.Claimed) {
        result.push(index);
      }
    }
  }

  return result;
}

export type GameState = {
  deck: Deck;
  cardSets: CardSet[];
  currentTurn: Player;
  currentRound: Location; // better terminology?
  bigOne: Player;
  calledZole: boolean;
  branches: number;
}

export function extractGameState(deck: Deck): GameState {
  let gameState: GameState = {
    deck: [...deck], // deliberately making a copy!
    cardSets: Array(Location.NumLocations).fill([]),
    currentTurn: Player.None,
    currentRound: Location.None,
    bigOne: Player.None,
    calledZole: false,
    branches: 0
  };

  for (let index = 0; index !== numCards; ++index) {
    const card = deck[index];
    const cardLocation = card.location;
    gameState.cardSets[cardLocation].push(index);
  }

  if (gameState.cardSets[Location.None].length) {
    assert(gameState.cardSets[Location.None].length === deck.length);
    console.log("new deck");
  }
  else if (gameState.cardSets[Location.Choose].length) {
    assert(gameState.cardSets[Location.Choose].length <= 2);
    const card = deck[gameState.cardSets[Location.Choose][0]]
    if (card.order == numPlayers) {
      console.log(`all players passed--put a branch on the tree`);
      gameState.branches++;
      gameState.currentRound = Location.NumLocations;
    }
    else {
      gameState.currentRound = Location.Choose;
      console.log(`player ${getPlayerName(card.dealt)} must choose`);
    }
  }
  else {
    if (gameState.cardSets[Location.Discarded].length) {
      assert(gameState.cardSets[Location.Zole].length === 0);
      const card = deck[gameState.cardSets[Location.Discarded][0]]
      gameState.bigOne = card.dealt;
      console.log(`big one (${getPlayerName(gameState.bigOne)}) picked up`);
    }
    else if (gameState.cardSets[Location.Zole].length) {
      assert(gameState.cardSets[Location.Discarded].length === 0);
      const card = deck[gameState.cardSets[Location.Zole][0]]
      gameState.bigOne = card.dealt;
      gameState.calledZole = true;
      console.log(`big one (${getPlayerName(gameState.bigOne)}) called zole`);
    }
    else {
      assert(false);
    }

    const cardsLeftInHands = gameState.cardSets[Location.Hand].length;
    const cardsInTrick = gameState.cardSets[Location.Trick].length;
    const cardsClaimed = gameState.cardSets[Location.Claimed].length;
    assert(cardsLeftInHands + cardsInTrick + cardsClaimed === numPlayers * numRounds);

    if (cardsClaimed == numPlayers * numRounds) {
      // game over
      console.log("game over!");
      gameState.currentRound = Location.NumLocations;
      gameState.currentTurn = Player.None;
      // if scores are equal, but a branch on the tree
    }
    else {
      console.log(`playing round ${getLocationName(gameState.currentRound)} and turn ${getPlayerName(gameState.currentTurn)}`);
    }
  }


  return gameState;
}

