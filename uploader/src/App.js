import React, {Component} from 'react';
import FileList from './FileList.js';
import ProgressBar from './ProgressBar.js';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            value: -1,
            beenClicked: false
        };
    }

    render() {
        return (
            <div>
                <form id="upload_form">
                    <label htmlFor="file_input">Select Files:</label>
                    <input id="file_input" type="file" multiple onChange={(event) => {
                        let fileList;
                        if (this.state.beenClicked) {
                            fileList = [];
                            this.setState({beenClicked: false, fileList: [], value: -1})
                        } else {
                            fileList = this.state.fileList;
                        }

                        let newFiles = event.target.files;
                        for (let i = 0; i < newFiles.length; i++) {
                            fileList.push(newFiles[i]);
                        }
                        this.setState({fileList: fileList})
                        }
                    }/>
                    <div>
                        <input id="submit_btn" type="button" value="Upload" onClick={this.uploadFiles.bind(this)}/>
                    </div>
                </form>
                <ProgressBar progressValue={this.state.value}/>
                <FileList fileList={this.state.fileList}/>
            </div>
        )
    }

    uploadFiles() {
        if (this.state.fileList.length === 0) {
            return;
        }
        let formData = new FormData();
        for (let x = 0; x < this.state.fileList.length; x++) {
            formData.append("file" + x, this.state.fileList[x]);
        }

        let uploadId = Date.now() + (Math.random().toString(36) + '00000000000000000').slice(2, 10 + 2);
        formData.append("uploadId", uploadId);

        let oReq = new XMLHttpRequest();
        oReq.open("POST", "http://localhost:5000/upload", true);
        oReq.send(formData);
        this.setState({value: 0}, () => {
            this.checkUploadStatus.bind(this);
            this.checkUploadStatus(uploadId)
        });
    };

    checkUploadStatus(uploadId) {
        let parent = this;
        let oReq = new XMLHttpRequest();
        oReq.onload = function () {
            let res = JSON.parse(this.response)['data'];
            parent.setState({value: res});
            if (res < 1) {
                parent.checkUploadStatus(uploadId);
            } else {
                parent.setState({'beenClicked': true})
            }
        };

        oReq.open("GET", "http://localhost:5000/getStatus/" + uploadId, true);
        oReq.send()
    }
}


export default App;
