import React from 'react';


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
  