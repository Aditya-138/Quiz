import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import '../../styles/components/_Summary.scss';

class QuizSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberofQuestions: 0,
            numberofAnsweredQuestion: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hintsUsed: 0,
            fiftyFiftyUsed: 0
        };
    }

    componentDidMount() {
        const { state } = this.props.location;
        
        // Check if the state object is available
        if (state) {
            this.setState({
                numberofQuestions: state.numberofQuestions,
                numberofAnsweredQuestion: state.numberofAnsweredQuestion,
                score: (state.score / state.numberofQuestions) * 100,
                correctAnswers: state.correctAnswers,
                wrongAnswers: state.wrongAnswers,
                hintsUsed: state.hintsUsed,
                fiftyFiftyUsed: state.fiftyFiftyUsed
            });
        }
    }

    render() {
        const { state } = this.props.location;
        let stats, remark;
        const userscore = this.state.score;
        if (state) {
            // Calculate the remark based on score
            if (this.state.score <= 30) {
                remark = 'You need more practice!';
            } else if (this.state.score > 30 && this.state.score <= 50) {
                remark = 'Better luck next time!';
            } else if (this.state.score > 50 && this.state.score <= 70) {
                remark = 'You can do better!';
            } else if (this.state.score > 70 && this.state.score <= 84) {
                remark = 'You did great!';
            } else {
                remark = 'You are an absolute genius';
            }

            stats = (
                <Fragment>
                    <div>
                        <span className="mdi mdi-check-circle-outline success-icon"></span>
                    </div>
                    <h1>Quiz has ended</h1>
                    <div className="container">
                        <h4>{remark}</h4>
                        <h2>Your score: {this.state.score.toFixed(0)}&#37;</h2>

                        <span className="stat left">Total number of questions:</span>
                        <span className="right">{this.state.numberofQuestions}</span><br />

                        <span className="stat left">Answered questions:</span>
                        <span className="right">{this.state.numberofAnsweredQuestion}</span><br />

                        <span className="stat left">Correct answers:</span>
                        <span className="right">{this.state.correctAnswers}</span><br />

                        <span className="stat left">Wrong answers:</span>
                        <span className="right">{this.state.wrongAnswers}</span><br />

                        <span className="stat left">Hints used:</span>
                        <span className="right">{this.state.hintsUsed}</span><br />

                        <span className="stat left">50/50 used:</span>
                        <span className="right">{this.state.fiftyFiftyUsed}</span><br />
                    </div>
                    <section>
                        <ul>
                            <li>
                                <Link to="/">Back to Home</Link>
                            </li>
                            <li>
                                <Link to="/play/quiz">Play again</Link>
                            </li>
                        </ul>
                    </section>
                </Fragment>
            );
        } else {
            // If no state is available
            stats = (
                <section>
                    <h1 className="no-stats">No statistics Available</h1>
                    <ul>
                        <li>
                            <Link to="/">Back to Home</Link>
                        </li>
                        <li>
                            <Link to="/play/quiz">Take a Quiz</Link>
                        </li>
                    </ul>
                </section>
            );
        }

        return (
            <Fragment>
                <Helmet><title>Quiz - App Summary</title></Helmet>
                {stats}
            </Fragment>
        );
    }
}

export default QuizSummary;

