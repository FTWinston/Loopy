import * as React from 'react';
import './App.css';
import { LoopDisplay } from './LoopDisplay';

const startLoop = () => {
    // console.log('loop started');
}

const stopLoop = () => {
    // console.log('loop stopped');
}

const nextLoop = () => {
    // console.log('looping');
}

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Loopy sound recorder</h1>
        </header>
        <p className="App-intro">
          You probably want to use headphones.
        </p>

        <LoopDisplay
            numBeats={8}
            beatLengthMs={1000}
            start={startLoop}
            stop={stopLoop}
            loop={nextLoop}
        />
      </div>
    );
  }
}

export default App;
