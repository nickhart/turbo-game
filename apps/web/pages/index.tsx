import React, { MouseEvent } from 'react';
import ReactDOM from 'react-dom/client';

const handNames = [
  'deck',
  'p1',
  'p2',
  'p3'
];

type Card = {
  index: number;
  suit: number;
  rank: number;
  points: number;
  name: string;
};

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


function Card(props: any) {
  return (
    <button className="card" onClick={props.onClick} key={props.cardKey}>
      {props.value}
    </button>
  );
}


interface BoardProps {
  cards: Array<number>;
  onClick: (card: Card) => void;
}

class Board extends React.Component<BoardProps, any> {
  renderCard(card: Card, handName: string, index: number) {
    const cardKey = `${handName}_${index}`;
    return (
      <Card
        value={card.name}
        cardKey={cardKey}
        onClick={() => this.props.onClick(card)}
      />
    );
  }

  renderHand(hand: Array<Card>, handName: string) {
    return (
      <div className="board-row" id={handName}>
        <h3>{handName}</h3>
      { 
        hand.map((card, index) => this.renderCard(card, handName, index))
      }
      </div>
    );
}

  render() {
    const hands = extractHands(this.props.cards);
    return (
      <div>
        {
          hands.map((hand, index) => this.renderHand(hand, handNames[index]))
        }
      </div>
    );
  }
}

interface GameState {
  cards: Array<number>;
}

function gameState() {
  return { cards: Array(26).fill(0) };
}

function extractHands(cards: Array<number>): Array<Array<Card>> {
  let hands: Card[][] = [[], [], [], []];

  cards.forEach((item: number, index: number) => {
    const hand: Array<Card> = hands[item];
    hand.push(gameDeck[index]);
  });

  return hands;
}

interface GameProps {
  history?: Array<GameState>;
  stepNumber?: number;
  currentPlayer?: number;

}

class Game extends React.Component<GameProps, any> {
  constructor(props: any) {
      super(props);
      this.state = {
        history: [ gameState() ],
        stepNumber: 0,
        currentPlayer: 0,
      };
    }

    handleClick(card: Card) {
      console.log(`handleClick: ${card.name}`);
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const cards = current.cards.slice();
          if (calculateWinner(cards) || cards[card.index]) {
        return;
      }
      cards[card.index] = this.state.currentPlayer+1;
      this.setState({
          history: history.concat([{
              cards: cards,
            }]),
            stepNumber: history.length,
            currentPlayer: (this.state.currentPlayer+1)%3,
      });
    }

    jumpTo(step: number) {
      this.setState({
        stepNumber: step,
        currentPlayer: (step % 2) === 0,
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.cards);

      const moves = history.map((step: any, move: React.Key) => {
          const desc = move ?
            'Go to move #' + move :
            'Go to game start';
          return (
              <li key={move}>
              <button onClick={() => this.jumpTo(Number(move))}>{desc}</button>
            </li>
          );
        });
    
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = `Next player: ${this.state.currentPlayer}`;
      }

      return (
      <div className="game">
        <div className="game-board">
          <Board
              cards={current.cards}
              onClick={(card: Card) => this.handleClick(card)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(cards: Array<number>) {
  return null;
}

// ========================================

function App() {
  return <Game />
}

export default App
