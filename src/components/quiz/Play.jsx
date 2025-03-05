import React,{Component, Fragment} from 'react'
import { Helmet } from 'react-helmet';

class Play extends Component {
    // constructor (props) {
    //     super(props);
    // }

    increaseCount = () => {
        this.setState ({
            counter :5
        });
    };
    render (){
        return (
            <Fragment>
                <Helmet><title>Quiz page</title></Helmet>
                    <div className="questions">
                        <div className="lifeline-container">
                            <p>
                                <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>2
                            </p>
                            <p>
                                <span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>5
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>1 of 15</span>
                                2:15<span className="mdi mdi-clock-outline mdi-24px"></span>
                            </p>
                        </div>
                    <h1>Google was founded in what year?</h1>
                    <div className="options-container">
                    <p className="option">1998</p>
                    <p className="option">1997</p>
                    </div>
                    <div className="options-container">
                    <p className="option">1999</p>
                    <p className="option">2000</p>
                    </div>

                    <div className="button-container">
                        <button>Previous</button>
                        <button>Next</button>
                        <button>Quit</button>
                    </div>
                    </div>
            </Fragment>
        );
    }

}

export default Play;