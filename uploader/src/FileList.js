import React, {Component} from 'react';
import './App.css';

class FileList extends Component {
    render() {
        if (this.props.fileList && this.props.fileList.length > 0) {
            return (
                <ul id="file-list">
                    {this.props.fileList.map(file => {
                        return <li> {file.name + " (" + file.size + " )"} </li>
                    })}
                </ul>
            )
        } else {
            return (
                <ul id="file-list" style={{display: "none"}}/>
            )
        }

    }
}

export default FileList;
