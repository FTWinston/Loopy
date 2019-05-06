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

        this.audioLoop = new AudioLoop(this.getLoopLength(this.state));
    }

    public componentDidMount() {
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

    public componentWillUpdate(nextProps: {}, nextState: IState) {
        if (nextState.beatLengthMs !== this.state.beatLengthMs || nextState.numBeats !== this.state.numBeats) {
            this.audioLoop.setDelay(this.getLoopLength(nextState));
        }
    }

    public render() {
        if (this.state.error) {
            return (
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Loopy sound recorder</h1>
                        <p className="App-error">Couldn't locate microphone, unable to continue.</p>
                    </header>
                </div>
            )
        }

        const startLoop = () => this.startLoop();
        const stopLoop = () => this.stopLoop();
        const nextLoop = () => this.nextLoop();
        const setNumBeats = (num: number) => this.setNumBeats(num);
        const setBeatLength = (length: number) => this.setBeatLength(length);

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Loopy sound recorder</h1>
                    <p className="App-intro">You probably <em>don't</em> want to use headphones.</p>
                </header>

                <LoopDisplay
                    numBeats={this.state.numBeats}
                    beatLengthMs={this.state.beatLengthMs}
                    setNumBeats={setNumBeats}
                    setBeatLength={setBeatLength}

                    playing={this.state.looping}
                    start={startLoop}
                    stop={stopLoop}
                    loop={nextLoop}
                />
            </div>
        );
    }

    private getLoopLength(state: IState) { return state.numBeats * state.beatLengthMs / 1000; }

    private setNumBeats(num: number) {
        if (this.state.looping) {
            return;
        }

        this.setState({
            numBeats: num,
        });
    }

    private setBeatLength(length: number) {
        if (this.state.looping) {
            return;
        }

        this.setState({
            beatLengthMs: length,
        });
    }

    private startLoop() {
        this.audioLoop.start();

        this.setState({
            looping: true,
        })
    }

    private stopLoop() {
        this.audioLoop.stop();

        this.setState({
            looping: false,
        })
    }

    private nextLoop() {
        // TODO: do something
    }
}

export default App;
