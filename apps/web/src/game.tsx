import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { Card } from './card'
import { handNames, deduceState, extractHands, ZoliteProvider, calculateWinner } from './zolite'

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
  
      dealCards() {
        // TODO: helper function
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const hands = extractHands(current.cards);
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
                <ol>{moves}</ol>
              </div>
            </div>
          </ZoliteProvider>
      );
    }
  }
  
  export {Game};

