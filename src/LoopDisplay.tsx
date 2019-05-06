import * as React from 'react';
import './LoopDisplay.css';

interface IProps {
    beatLengthMs: number;
    numBeats: number;
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

        return (
            <div className={classes}>
                {startStop}
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