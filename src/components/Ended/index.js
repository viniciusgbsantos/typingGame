import React from "react";

const Ended = ({ended, duration, completedWords = [], onRestart=() => {}}) => {
    if(!ended) return null;
    return <div className="ended"> 
    <h2> Time's Up</h2>
    <p>{completedWords.length} Completed Words in {duration} seconds.</p>
    <button onClick={onRestart}>RESTART</button>
    </div>;
}

export default Ended;