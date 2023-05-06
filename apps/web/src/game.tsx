import React, { ReactNode } from 'react';
import { Card } from './card';
import { Board } from './board';
import { deduceState, dealCards, ZoliteProvider, calculateWinner, extractHands } from './zolite';

interface GameState {
  cards: Array<number>;
}

function gameState() {
  return { cards: Array(26).fill(0) };
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
      // TODO: helper function
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const cards = current.cards.slice();

      if (calculateWinner(cards) || cards[card.index]) {
        return;
      }

      cards[card.index] = this.state.currentPlayer+1;
      const state = deduceState(cards);
      this.setState({
          history: history.concat([{
              cards: cards,
            }]),
            stepNumber: history.length,
            currentPlayer: (this.state.currentPlayer+1)%3,
      });
    }

    beginGame() {
      console.log('beginGame');
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];

      const cards = dealCards();
      console.log(`cards: ${cards}`);
      const state = deduceState(cards);
      console.log(`state: ${state}`);

      this.setState({
        history: history.concat([{
            cards: cards,
          }]),
          stepNumber: history.length,
          // currentPlayer: 0, // parameterize this
      });

    }

    jumpTo(step: number) {
      this.setState({
        stepNumber: step,
        currentPlayer: (step % 2) === 0,
      });
    }
  
    render() {
      console.log('render BEGIN');
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.cards);

      let actions
      if (this.state.stepNumber === 0) {
          const desc = 'Deal Cards'
          actions = [(
            <li key={desc}>
              <button onClick={() => this.beginGame()}>{desc}</button>
            </li>
          )]
      }
      else {
        actions = ''
      }

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
      console.log('render END');

      return (
        <ZoliteProvider>
          <div className="game">
            <div className="game-board">
              <Board
                  cards={current.cards}
                  onClick={(card: Card) => this.handleClick(card)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves} {actions}</ol>
            </div>
          </div>
        </ZoliteProvider>
    );
  }
}

export {Game};

