import React,{Component,Fragment} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Helmet } from "react-helmet";

const QuizInstructions = () =>(
    <Fragment>
        <Helmet><title>Quiz - Instructions - Quiz App</title></Helmet>
        <div className="instuctions container">
            <h1>How to play the game</h1>
            <p>Ensure you read this guide from start to finish</p>
            <ul className="browser-default" id= "main-list">
                <li>the game has duration of 15 min and ends as soon as your time up</li>
                <li>Each game consists of 15 questions.</li>
                <li>Every question contains 4 options.</li>
                <li>Select the option which best answers by clicking (or selecting) it.</li>
                <li>Each game has 2 lifelines namely
                    <ul>
                        <li>50-50 chances</li>
                        <li>Hints</li>
                    </ul>
                </li>
                <li>
                    Selecting a 50-50 lifeline by clicking the icon will remove 2 wrong answers,
                     leaving the correct answer and wrong answer
                </li>
                <li>
                    Using a hint by clicking the icon will remove one wrong answer leaving two wrong answer and one correct answer.
                    you can use as many hints as possible on asingle question
                </li>
                <li>Feel free to quit (or retire icon) the game at any time in that case 
                    your score revealed adfterwards </li>
                <li>The timer starts as soon as the game loads</li>
                <li>Lets do this if you think you have got what it takes?</li>
            </ul>
            <div>
                <span className="left"><Link to ="/">No take me back</Link></span>
                <span className="right"><Link to="/play/quiz">Okay,lets do this</Link></span>
            </div>
        </div>
    </Fragment>
);

export default QuizInstructions;