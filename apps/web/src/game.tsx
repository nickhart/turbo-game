import React, { ReactNode } from 'react';
import { Card } from './card';
import { Board } from './board';
import { deduceState, dealCards, ZoliteProvider, calculateWinner, pickupCards, callZole } from './zolite';

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
      const state = deduceState(cards);

      this.setState({
        history: history.concat([{
            cards: cards,
          }]),
          stepNumber: history.length,
      });

    }

    pickupCards() {
      console.log('pickupCards');
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];

      // const state = deduceState(current);

      const cards = pickupCards(current, this.state.currentPlayer);

      this.setState({
        history: history.concat([{
            cards: cards,
          }]),
          stepNumber: history.length,
      });
    }

    callZole() {
      console.log('callZole');
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];

      // const state = deduceState(current);

      const cards = callZole(current, this.state.currentPlayer);

      this.setState({
        history: history.concat([{
            cards: cards,
          }]),
          stepNumber: history.length,
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

      const state = deduceState(current.cards);

      let actions;
      if (this.state.stepNumber === 0) {
          actions = [(
            <button onClick={() => this.beginGame()}>Deal Cards</button>
          )]
      }
      else {
        actions = [(
          <button onClick={() => this.pickupCards()}>Pickup Cards</button>        )]
      // actions = '';
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

      return (
        <ZoliteProvider>
          <div className="game">
            <div className="game-board">
              <Board
                  cards={current.cards}
                  onClick={(card: Card) => this.handleClick(card)}
              />
              <div className="board-row" id={'actions'}>
                <h3>Actions</h3>
                  {actions}
              </div>
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        </ZoliteProvider>
    );
  }
}

export {Game};

