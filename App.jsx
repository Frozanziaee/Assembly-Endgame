import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"


export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const numGuessesLeft = languages.length - 1
    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)


    const languagesEl = languages.map((language, index) => {
        const isLanguageLost = index < wrongGuessCount

        return (
            <span
                key={language.name}
                className={`chip  ${isLanguageLost? " lost" : ""}`}
                style={{
                    backgroundColor: language.backgroundColor,
                    color: language.textColor
                }}
            >
                {language.name}
            </span>
        )
    })
    
    const letterEl = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter  = isGameLost || guessedLetters.includes(letter)

        return (
            <span key={index}>
                {shouldRevealLetter && letter.toUpperCase()}
            </span>
        ) 
    })

    const keyboardEl = alphabet.split("").map((letter) => {
        const isGussed = guessedLetters.includes(letter)
        const isGussedCorrect = isGussed && currentWord.includes(letter)
        const isGussedWrong = isGussed && !currentWord.includes(letter)
        const className = clsx(isGussedCorrect && "correct", isGussedWrong && "wrong")

        return (
            <button 
                key={letter} 
                onClick={() => addGuessedLetter(letter)}
                className={className}
                disabled={isGameOver}
                aria-label={`Guess the letter ${letter}`}
                aria-pressed={isGussed}
                >
                {letter.toUpperCase()}
            </button>
        ) 
    })

    function addGuessedLetter(letter) {
        setGuessedLetters((prevGuessedLetters) => 
            prevGuessedLetters.includes(letter) ?
            prevGuessedLetters : [...prevGuessedLetters, letter]
    )    
    }

    const gameStutusClass = clsx("game-status", {
        "won": isGameWon,
        "lost": isGameLost,
        "farewell": !isGameOver && isLastGuessIncorrect,
    })

   function renderGameStatus() {
        if(!isGameOver && isLastGuessIncorrect){
            return (
                <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
            )
        }
        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
        
        return null
    }

    function renderDefeatRain() {
        const symbols = ["💥", "💣", "🐞", "⚠️", "☠️"]
        const rainElements = Array.from({ length: 30 }, (_, i) => {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)]
            const left = Math.random() * 100
    
            return (
                <span
                    key={i}
                    className="defeat-symbol"
                    style={{ left: `${left}vw`, animationDelay: `${Math.random() * 3}s` }}
                >
                    {symbol}
                </span>
            )
        })
    
        return <div className="defeat-rain">{rainElements}</div>
    }
    

    return (
        <main>
            {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }

            {isGameLost && renderDefeatRain()}

            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>

            <section
                aria-live="polite"
                role="status"
                className={gameStutusClass}
            >
                {renderGameStatus()}  

            </section>

            <section className="language-chips">
                {languagesEl}
            </section>

            <section className="word">
                {letterEl}
            </section>

            {/* Combined visually-hidden aria-live region for status updates */}
            <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ?
                        `Correct! The letter ${lastGuessedLetter} is in the word.` :
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank.")
                    .join(" ")}</p>

            </section>

            <section className="keyboard">
                {keyboardEl}
            </section>

            {isGameOver && <button
                className="new-game"
                onClick={() => {
                    setGuessedLetters([])
                    setCurrentWord(getRandomWord())
                }}
                >New Game</button>}
        </main>
    )
}
