import React, { useState, useEffect, useRef } from 'react';

import CompletedWords from './components/CompletedWords'
import Timer from './components/Timer'
import Word from './components/Word'
import Ended from './components/Ended'

import { getWord } from './helpers/strings';
import { isValidKeys } from './helpers/validate';
import { MAX_TYPED_KEYS, TIME_INTERVAL, TIME_DURATION } from './helpers/configs';




const App = () => {

    const [typedKeys, setTypedKeys] = useState(['']);
    const [validKeys, setValidKeys] = useState([]);
    const [completedWords, setCompletedWords] = useState([]);
    const [word, setWord] = useState('');
    const [timerRunning, setTimerRunning] = useState(false);
    const [ended, setEnded] = useState(false);
    const containerRef = useRef(null);

useEffect(() => {
        setWord(getWord());
        if(containerRef) containerRef.current.focus();
    }, []);
useEffect(() => {
const wordFromValidKeys = validKeys.join('').toLowerCase();

let timeout = null;
    if(word && word === wordFromValidKeys) {
       timeout = setTimeout(() => {
        let newWord = null;
       do{
           newWord = getWord();
       } while(completedWords.includes(newWord));
       setWord(newWord);
       setValidKeys([]);
       setCompletedWords((prev) => [...prev, word]);
    }, TIME_INTERVAL)
    }

    return () => {
        if(timeout) clearTimeout(timeout)
    }

}, [word, validKeys, completedWords]);

const getTimerValue = (v) => {
    if(v > 0 ) return;
    setTimerRunning(false);
    setEnded(true);
    console.log(`Time's Up: ${completedWords.length} completed words`)
}
const onRestart = (e) => {
    e.preventDefault();
    setTypedKeys(['']);
    setValidKeys([]);
    setCompletedWords([]);
    setTimerRunning(false);
    setEnded(false);

    setWord(getWord());
    if (containerRef) containerRef.current.focus();
  };

const handleKeyDown = (e) => {
    e.preventDefault();
    if(ended) return;

    const { key } = e;


    if(!timerRunning) setTimerRunning(true);
    setTypedKeys((prev)=> [...prev, key].slice(MAX_TYPED_KEYS * -1));

    if(isValidKeys(key, word)) {
        setValidKeys((prev) => {
        const isValidLength = prev.length <= word.length;
        const isNextChair = isValidLength && word[prev.length] === key;

        console.log('prevValidKeys', prev, prev.length);
        console.log('word', word);
        console.log('isNextChair', isNextChair, key);

        return (isNextChair) ? [...prev, key] : prev;
        })  
}

 
    }
    return(<div className="container" tabIndex="0" onKeyDown={handleKeyDown} ref={containerRef}>
        <Timer duration={TIME_DURATION} isRunning={timerRunning} getValue={getTimerValue} />
        <div className="valid-keys">
        <Word word={word} validKeys={validKeys}/>
        </div>
        <div className="typed-keys">{typedKeys ? typedKeys.join(' ') : null}</div>
        <div className="completed-words"><CompletedWords data={completedWords}/>
        </div>
        <Ended ended={ended} completedWords={completedWords} duration={ TIME_DURATION }onRestart={onRestart} />
    </div>
    );
}
export default App;