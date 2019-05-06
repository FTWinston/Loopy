import * as React from 'react';
import './App.css';
import { AudioLoop } from './AudioLoop';
import { LoopDisplay } from './LoopDisplay';

interface IState {
    error: boolean;
    looping: boolean;
    numBeats: number;
    beatLengthMs: number;
}

class App extends React.Component<{}, IState> {
    private audioLoop: AudioLoop;

    constructor(props: {}) {
        super(props);

        this.state = {
            beatLengthMs: 1000,
            error: false,
            looping: false,
            numBeats: 8,
        };

        this.audioLoop = new AudioLoop(this.getLoopLength());
    }

    public async componentDidMount() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                this.audioLoop.setSource(stream);
            })
            .catch(err => {
                this.setState({
                    error: true,
                    looping: false,
                });
                // alert(err);
            });
    }

    public render() {
        const loopDisplay = this.state.error
            ? <p className="App-error">Couldn't locate microphone, unable to continue.</p>
            : <LoopDisplay
                playing={this.state.looping}
                numBeats={this.state.numBeats}
                beatLengthMs={this.state.beatLengthMs}
                start={this.startLoop}
                stop={this.stopLoop}
                loop={this.nextLoop}
            />

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Loopy sound recorder</h1>
                    <p className="App-intro">You probably <em>don't</em> want to use headphones.</p>
                </header>

                {loopDisplay}
            </div>
        );
    }

    private getLoopLength() { return this.state.numBeats * this.state.beatLengthMs / 1000; }

    private startLoop() {
        this.audioLoop.start();
    }

    private stopLoop() {
        this.audioLoop.stop();
    }

    private nextLoop() {
        // TODO: do something
    }
}

export default App;
