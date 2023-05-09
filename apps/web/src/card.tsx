import React from 'react';
import { shuffle } from './shuffle';


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

enum Location {
  None,
  Hand, // visible to the owner
  Trick, // visible to all
  Claimed, // memory for all
  Discarded, // memory for the owner
  Zole, // invisible to all
  NumLocations
};

const LocationNames = [
  "None",
  "Hand", // TODO: combine "none and hand" since there's functionally no distinction?
  "Trick",
  "Claimed",
  "Discarded",
  "Zole"
];

function getLocationName(location: Location) {
  return LocationNames[location];
}

enum Player {
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

function getPlayerName(player: Player) {
  return PlayerNames[player];
}

type CardState = {
  dealt: Player; // 2 bits
  location: Location; // 2 bits
  winner: Player; // 2 bits
  wasLed: boolean; // 1 bit
  wasVoid: boolean; // 1 bit

  // constructor(dealt: Player, location: Location, winner: Player, wasLed: boolean, wasVoid: bool) {
  //   this.dealt = dealt;
  //   this.location = location;
  //   this.winner = winner;
  //   this.wasLed = wasLed;
  //   this.wasVoid = wasVoid;
  // }

}

type Deck = CardState[];

function newDeck(size: number): Deck | undefined {
  if (size > 0) {
    const newCard: CardState = { dealt: Player.None, location: Location.Hand, winner: Player.None, wasLed: false, wasVoid: false };
    return new Array(size).fill(newCard);
  }
  // throw?
  return undefined;
}

function dealCards(cards: Deck, leader: Player) {
  const deckSize = cards.length;
  const newDeck = Array.from({ length: deckSize }, (_, index) => index);
  console.log(`newDeck: ${newDeck}`);
  const shuffled = shuffle(newDeck);
  console.log(`shuffled: ${shuffled}`);


}

function dealCard(cards: Deck, index: number, player: Player): Deck {
  cards[index].dealt = player;
  return cards;
}

function pickupCard(cards: Deck, index: number, player: Player): Deck {
  // assert that the player owns it?
  let newCard = cards[index];
  // newCard.dealt = player;
  newCard.location = Location.Hand;
  cards[index] = newCard;
  return cards;
}

function discardCard(cards: Deck, index: number, player: Player) {
  // assert that the player owns it?
  let newCard = cards[index];
  // newCard.dealt = player;
  newCard.location = Location.Discarded;
  cards[index] = newCard;
  return cards;
}

function claimCard(cards: Deck, index: number, player: Player): Deck {
  // assert that the player owns it?
  let newCard = cards[index];
  // newCard.dealt = player;
  newCard.location = Location.Discarded;
  cards[index] = newCard;
  return cards;
}

