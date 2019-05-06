// const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

export class AudioLoop {
    private readonly audioCtx: AudioContext;
    private source: MediaStreamAudioSourceNode | undefined;
    private readonly gain: GainNode;
    private readonly delay: DelayNode;

    constructor(delaySeconds: number) {
        this.audioCtx = new AudioContext();

        this.gain = this.audioCtx.createGain();
        this.delay = this.audioCtx.createDelay(60);

        this.delay.delayTime.setValueAtTime(delaySeconds, this.audioCtx.currentTime);
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
        this.delay.delayTime.setValueAtTime(delay, this.audioCtx.currentTime);
    }

    public start() {
        this.gain.connect(this.delay);
        this.delay.connect(this.audioCtx.destination);
    }

    public stop() {
        // fade out, to avoid a "pop" from the sudden cutoff
        const gain = this.gain;
        gain.gain.setValueAtTime(gain.gain.value, this.audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);

        const delay = this.delay;
        const audioCtx = this.audioCtx;
        
        setTimeout(() => {
            gain.disconnect(delay);
            delay.disconnect(audioCtx.destination);
        }, 25);
    }
}