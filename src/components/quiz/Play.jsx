import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import correctNotification from '../../sounds/correct.mp3';
import wrongNotification from '../../sounds/wrong.mp3';
import buttonNotification from '../../sounds/click-234708.mp3';

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberofQuestions: 0,
            numberofAnsweredQuestion: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null;
    }

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberofQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
                this.handleDisableButton();
            })
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                if (document.getElementById('correct-sound')) {
                    document.getElementById('correct-sound').play();
                }
            }, 500);
            this.correctAnswer();
        }
        else {
            setTimeout(() => {
                if (document.getElementById('wrong-sound')) {
                    document.getElementById('wrong-sound').play();
                }
            }, 500);
            this.wrongAnswer();
        }
    }

    handleNextButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion != undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            })
        }
    };

    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if (this.state.previousQuestion != undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            })
        }
    };

    handleQuitButtonClick = () => {
        this.playButtonSound();
        window.confirm('Are you sure you want to quit?');
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    }

    handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default: break;
        }
        this.playButtonSound();
    };

    playButtonSound = () => {
        if (document.getElementById('button-sound')) {
            document.getElementById('button-sound').play();
        }
    };

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberofAnsweredQuestion: prevState.numberofAnsweredQuestion + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            }
            else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        })
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberofAnsweredQuestion: prevState.numberofAnsweredQuestion + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            }
            else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });

        this.setState({
            usedFiftyFifty: false
        })
    }

    handleHints = () => {
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }))
                        }
                    });
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }
    }

    // handleFiftyFifty = () => {
    //     if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
    //         const options = document.querySelectorAll('.option');
    //         const randomNumbers = [];
    //         let indexOfAnswer;

    //         options.forEach((option, index) => {
    //             if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
    //                 indexOfAnswer = index;
    //             }
    //         });

    //         let count = 0;
    //         do {
    //             const randomNumber = Math.round(Math.random() * 3);
    //             if (randomNumber !== indexOfAnswer) {
    //                 if (randomNumbers.length < 2 && randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
    //                     randomNumbers.push(randomNumber);
    //                     count++;
    //                 } else {
    //                     while (true) {
    //                         const newRandomNumber = Math.round(Math.random() * 3);
    //                         if (!randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
    //                             randomNumbers.push(newRandomNumber);
    //                             count++;
    //                             break;
    //                         }
    //                     }
    //                 }
    //             }
    //         } while (count < 2);
    //         options.forEach((option, index) => {
    //             if (randomNumbers.includes(index)) {
    //                 option.style.visibility = 'hidden';
    //             }
    //         });
    //         this.setState(prevState => ({
    //             fiftyFifty: prevState.fiftyFifty - 1,
    //             usedFiftyFifty: true
    //         }));
    //     }
    // }

        // handleFiftyFifty = () => {
    //     if(this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false){
    //         const options = document.querySelectorAll('.option');
    //         const randomNumbers = [];
    //         let indexOfAnswer;

    //         options.forEach((option,index) => {
    //             if(option.innerHTML.toLowerCase() === this.state.answer.toLowerCase){
    //                 indexOfAnswer = index;
    //             }
    //         });

    //         let count =0;
    //         do {
    //             const randomNumber = Math.round(Math.random() *3);
    //             if(randomNumber !== indexOfAnswer){
    //                 if (randomNumbers.length<2 && randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)){
    //                     randomNumbers.push(randomNumber);
    //                     count++;
    //                 }else {
    //                     while(true){
    //                         const newRandomNumber = Math.round(Math.random() *3);
    //                         if(!randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)){
    //                             randomNumbers.push(newRandomNumber);
    //                             count ++;
    //                             break;
    //                         }
    //                     }
    //                 }
    //             }
    //         } while (count < 2);
    //         options.forEach((option,index)=> {
    //             if(randomNumbers.includes(index)){
    //                 option.style.visibility = 'hidden';
    //             }
    //         });
    //         this.setState(prevState => ({
    //             fiftyFifty: prevState.fiftyFifty -1,
    //             usedFiftyFifty: true
    //         }))
    //     }
    // }

    handleFiftyFifty = () => {
        if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;
    
            // Find the index of the correct answer
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
    
            let count = 0;
            while (count < 2) {
                const randomNumber = Math.floor(Math.random() * 4); // Generate a random number between 0 and 3
                // Ensure the random number is not the index of the correct answer and is not already in the randomNumbers array
                if (randomNumber !== indexOfAnswer && !randomNumbers.includes(randomNumber)) {
                    randomNumbers.push(randomNumber);
                    count++;
                }
            }
    
            // Hide the options corresponding to the random numbers (excluding the correct answer)
            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
    
            // Update the state to reflect that the fifty-fifty option was used
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFiftyFifty: true
            }));
        }
    }
    

    startTimer = () => {
        const countDownTime = Date.now() + 180000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            })
        } else {
            this.setState({
                previousButtonDisabled: false
            })
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberofQuestions) {
            this.setState({
                nextButtonDisabled: true
            })
        } else {
            this.setState({
                nextButtonDisabled: false
            })
        }
    }

    endGame = () => {
        alert('Quiz has ended!');
        const { state } = this;
        const playerStats = {
            numberofQuestions: state.numberofQuestions,
            numberofAnsweredQuestion: (state.correctAnswers+state.wrongAnswers),
            score: state.score,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            hintsUsed: 5 - state.hints,
            fiftyFiftyUsed: 2 - state.fiftyFifty
        };
        console.log(playerStats);
        setTimeout(() => {
            this.props.history.push('/play/quizSummary',playerStats);
        }, 1000);
    }

    render() {
        const {
            currentQuestion,
            currentQuestionIndex,
            numberofQuestions,
            hints,
            fiftyFifty,
            time
        } = this.state;
        return (
            <Fragment>
                <Helmet><title>Quiz page</title></Helmet>
                <Fragment>
                    <audio id="correct-sound" src={correctNotification}></audio>
                    <audio id="wrong-sound" src={wrongNotification}></audio>
                    <audio id="button-sound" src={buttonNotification}></audio>
                </Fragment>
                <div className="questions">
                    <h2>Quiz Mode</h2>
                    <div className="lifeline-container">
                        <p>
                            <span onClick={this.handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
                            <span className="lifeline">{fiftyFifty}</span>
                        </p>
                        <p>
                            <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>
                            <span className="lifeline">{hints}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className='left' style={{ float: 'left' }}> {currentQuestionIndex + 1} of {numberofQuestions}</span>
                            <span className='right'>{time.minutes}:{time.seconds}<span className="mdi mdi-clock-outline mdi-24px"></span></span>
                        </p>
                    </div>
                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>

                    <div className="button-container">
                        <button
                            className={this.state.previousButtonDisabled ? 'disable' : ''}
                            id="previous-button"
                            onClick={this.handleButtonClick}>
                            Previous
                        </button>
                        <button
                            className={this.state.nextButtonDisabled ? 'disable' : ''}
                            id="next-button"
                            onClick={this.handleButtonClick}>
                            Next
                        </button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;
