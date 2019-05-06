// const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

export class AudioLoop {
    private readonly audioCtx: AudioContext;
    private source: MediaStreamAudioSourceNode | undefined;
    private readonly gain: GainNode;
    private delay: DelayNode | null;
    
    constructor(private delaySeconds: number) {
        this.audioCtx = new AudioContext();
        this.gain = this.audioCtx.createGain();
        this.delay = null;
    }

    public setSource(sourceStream: MediaStream) {
        if (this.source) {
            this.source.disconnect(this.gain);
        }

        this.source = this.audioCtx.createMediaStreamSource(sourceStream);
        this.source.connect(this.gain);
    }

    public setVolume(volume: number) {
        this.gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    }

    public setDelay(delay: number) {
        this.delaySeconds = delay;
    }

    public start() {
        if (this.delay !== null) {
            return;
        }
        
        // we (re)create the delay node every time to ensure it doesn't hold onto the previous loop
        this.delay = this.audioCtx.createDelay(60);
        this.delay.delayTime.setValueAtTime(this.delaySeconds, this.audioCtx.currentTime);

        this.gain.connect(this.delay);
        this.delay.connect(this.audioCtx.destination);
        
        this.audioCtx.resume();
    }

    public stop() {
        if (this.delay === null) {
            return;
        }

        this.gain.disconnect(this.delay);
        this.delay.disconnect(this.audioCtx.destination);
        this.delay = null;

        this.audioCtx.suspend();
    }
}