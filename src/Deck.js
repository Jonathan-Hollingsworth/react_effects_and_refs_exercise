import React, {useState, useEffect, useRef} from "react";
import axios from "axios";

function Deck() {
    const initialDrawn = []
    const [drawn, setDrawn] = useState(initialDrawn)
    const deckId = useRef()

    useEffect(function initializeDeck() {
        async function getDeck() {
           const ajaxDeck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
           deckId.current = ajaxDeck.data.deck_id
        }
        getDeck()
    }, [])

    async function drawCard() {
        const deckResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`)
        const draw = deckResponse.data
        if(draw.success) {
            const card = draw.cards[0]
            setDrawn([...drawn, {code: card.code, image: card.image}])
        } else {
            if(draw.remaining === 0){
                alert("Error: no cards remaining!")
            } else {
                alert("An error has occured with the api, please try again later")
            }
        }
    }

    return(
        <div className="deck">
            <button onClick={drawCard}>Draw Card</button>
            <div className="drawn">
                {drawn.map((card) => 
                  <img key={card.code} src={card.image}/>
                )}
            </div>
        </div>
    )
}

export default Deck