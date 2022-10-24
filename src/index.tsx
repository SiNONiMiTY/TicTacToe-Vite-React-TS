import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// TYPES
// =====

type TSquare = 'X' | 'O' | null

type TTurnHistory = { squares: TSquare[] }[]

// INTERFACES
// ==========

interface IBoardProps {
    onClick: ( i: number ) => void,
    squares: TSquare[],
}

interface ISquareProps {
    onClick: () => void,
    value: TSquare,
}

// FUNCTION COMPONENTS
// ===================

const Game: React.FC = () => {
    // STATE HOOKS
    const [turnHistory, setTurnHistory] = React.useState<TTurnHistory>( [{ squares: Array( 9 ).fill( null ) }] )
    const [stepNumber, setStepNumber] = React.useState<number>( 0 )
    const [nextTurnX, setNextTurnX] = React.useState<boolean>( true )

    // METHODS
    const handleClick = ( i: number ) => {
        const history = turnHistory.slice( 0, stepNumber + 1 )
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if ( squares[i] || calculateWinner( squares ) ) {
            return
        }

        squares[i] = nextTurnX ? 'X' : 'O'

        setTurnHistory( history.concat( [{ squares: squares }] ) )
        setStepNumber( history.length )
        setNextTurnX( !nextTurnX )
    }

    const jumpTo = ( step: number ) => {
        setStepNumber( step )
        setNextTurnX( ( step % 2 ) === 0 )
    }

    // PRE-RENDER LOGIC
    const history = turnHistory
    const current = history[stepNumber]
    const winner = calculateWinner( current.squares )

    const moves = history.map( ( step, move ) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start'

        return (
            <li key={move}>
                <button
                    onClick={() => jumpTo( move )}
                >
                    {desc}
                </button>
            </li>
        )
    } )

    let status

    if ( winner ) {
        status = `Winner: ${winner}`
    } else if ( current.squares.every( square => square !== null ) ) {
        status = 'Draw!'
    } else {
        status = `Next player: ${nextTurnX ? 'X' : 'O'}`
    }

    // RENDER
    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    squares={current.squares}
                    onClick={i => handleClick( i )}
                />
            </div>
            <div className='game-info'>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

const Board: React.FC<IBoardProps> = ( props ) => {
    // METHODS
    const renderSquare = ( i: number ) => {
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick( i )}
            />
        )
    }

    // RENDER
    return (
        <div>
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

const Square: React.FC<ISquareProps> = ( props ) => {
    // RENDER
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}

// FUNCTIONS
// =========

function calculateWinner( squares: TSquare[] ) {
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

const rootElement = document.getElementById( 'root' )

if ( rootElement ) {
    const root = ReactDOM.createRoot( rootElement )

    root.render(
        <React.StrictMode>
            <Game />
        </React.StrictMode>
    )
} else {
    console.warn( 'No root element found in entry point.' )
}
