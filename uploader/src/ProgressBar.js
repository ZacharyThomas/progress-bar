import React, {Component} from 'react';
import './App.css';

class ProgressBar extends Component {
    render() {
        if (this.props.progressValue >= 0) {
            return <progress value={this.props.progressValue}></progress>
        } else {
            return <div></div>
        }
    }
}

export default ProgressBar;
