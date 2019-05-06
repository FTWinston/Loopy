import * as React from 'react';
import './LoopDisplay.css';

interface IProps {
    beatLengthMs: number;
    numBeats: number;
    setNumBeats: (num: number) => void;
    setBeatLength: (length: number) => void;
    
    playing: boolean;
    start: () => void;
    stop: () => void;
    loop: () => void;
}

interface IState {
    beatsRemaining: number;
    loopNumber: number;
}

export class LoopDisplay extends React.PureComponent<IProps, IState> {
    private interval: NodeJS.Timer | undefined;

    constructor(props: IProps) {
        super(props);

        this.state = {
            beatsRemaining: props.numBeats,
            loopNumber: 1,
        };
    }

    public componentWillUnmount() {
        this.stop();
    }
    
    public render() {
        const classes = this.props.playing
            ? 'loop loop--playing'
            : 'loop loop--stopped';

        const startStopAction = this.props.playing
            ? () => this.stop()
            : () => this.start()

        const startStop = this.props.playing
            ? <button className="loop__button loop__stop" onClick={startStopAction}>stop</button>
            : <button className="loop__button loop__stop" onClick={startStopAction}>start</button>

        const numBeatsChanged = (e: React.ChangeEvent<HTMLInputElement>) => this.props.setNumBeats(parseInt(e.target.value, 10));
        const beatLengthChanged = (e: React.ChangeEvent<HTMLInputElement>) => this.props.setBeatLength(parseInt(e.target.value, 10));

        return (
            <div className={classes}>
                {startStop}

                <label>
                    Number of beats: 
                    <input
                        type="number"
                        value={this.props.numBeats}
                        onChange={numBeatsChanged}
                        disabled={this.props.playing}
                        min={1}
                        max={200}
                        step={1}
                    />
                </label>
                
                <label>
                    Length of each beat (milliseconds): 
                    <input
                        type="number"
                        value={this.props.beatLengthMs}
                        onChange={beatLengthChanged}
                        disabled={this.props.playing}
                        min={1}
                        max={10000}
                        step={1}
                    />
                </label>

                <div className="loop__beatsRemaining">{this.state.beatsRemaining} beats remaining</div>
                <div className="loop__loopNumber">Loop #{this.state.loopNumber}</div>
            </div>
        );
    }

    private start() {
        if (this.props.playing) {
            return;
        }

        this.interval = setInterval(() => this.beat(), this.props.beatLengthMs)

        this.setState({
            beatsRemaining: this.props.numBeats,
            loopNumber: 1,
        });

        this.props.start();
    }

    private stop() {
        if (!this.props.playing) {
            return;
        }

        if (this.interval !== undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        this.props.stop();
    }

    private beat() {
        if (this.state.beatsRemaining <= 1) {
            this.setState(state => { return {
                beatsRemaining: this.props.numBeats,
                loopNumber: state.loopNumber + 1,
            }});

            this.props.loop();
        }
        else {
            this.setState(state => { return {
                beatsRemaining: state.beatsRemaining - 1,
            }});
        }
    }
}