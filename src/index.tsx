import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// TYPES & INTERFACES
// ==================

type TSquare = Array<string | null>

interface IGameState {
    squares: TSquare,
    nextTurnX: boolean,
}

interface ISquareProps {
    onClick: () => void,
    value: string | null,
}

// FUNCTION COMPONENTS
// ===================

const Board: React.FC = () => {
    // STATE HOOKS
    const [squares, setSquares] = useState<TSquare>( Array( 9 ).fill( null ) )
    const [nextTurnX, setNextTurnX] = useState<boolean>( true )

    // METHODS
    const handleClick = ( i: number ) => {
        const copyOfSquares: TSquare = squares.slice()

        if ( copyOfSquares[i] || calculateWinner( copyOfSquares ) ) {
            return
        }

        copyOfSquares[i] = nextTurnX ? 'X' : 'O'

        setSquares( copyOfSquares )
        setNextTurnX( !nextTurnX )
    }

    const renderSquare = ( i: number ) => {
        return (
            <Square
                value={squares[i]}
                onClick={() => handleClick( i )}
            />
        )
    }

    // PRE-RENDER LOGIC
    const winner = calculateWinner( squares )

    let status

    if ( winner ) {
        status = `Winner: ${winner}`
    } else {
        status = `Next player: ${nextTurnX ? 'X' : 'O'}`
    }

    // RENDER
    return (
        <div>
            <div className='status'>{status}</div>
            <div className='board-row'>
                {renderSquare( 0 )}
                {renderSquare( 1 )}
                {renderSquare( 2 )}
            </div>
            <div className='board-row'>
                {renderSquare( 3 )}
                {renderSquare( 4 )}
                {renderSquare( 5 )}
            </div>
            <div className='board-row'>
                {renderSquare( 6 )}
                {renderSquare( 7 )}
                {renderSquare( 8 )}
            </div>
        </div>
    )
}

const Game: React.FC = () => {
    return (
        <div className='game'>
            <div className='game-board'>
                <Board />
            </div>
            <div className='game-info'>
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    )
}

const Square: React.FC<ISquareProps> = ( props ) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

// FUNCTIONS
// =========

function calculateWinner( squares: TSquare ) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for ( let i = 0; i < lines.length; i++ ) {
        const [a, b, c] = lines[i]

        if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
            return squares[a]
        }
    }

    return null
}

// ENTRY POINT
// ===========

const root = ReactDOM.createRoot( document.getElementById( 'root' )! )
root.render( <Game /> )
