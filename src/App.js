import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isFieldActive: true,
      currentToe: 'x',
      clickedX: [],
      clickedO: [],
      size: '3',
      winCombinations: this.getWinCombinations(),
      winLane: []
    };
  }

  getFieldArray() {
    let size = this.state.size;
    let fieldArr = [];
    for (let i=1; i<=size; i++) {
      let rowArr = [];
      for (let j=1; j<=size; j++) {
        rowArr.push(`${i}${j}`)
      }
      fieldArr.push(rowArr);
    }

    return fieldArr;
  }

  getFieldComponent() {
    let fieldArray = this.getFieldArray();
    let field = fieldArray.map(row => {
      return (
        <tr key={row[0][0]}>
          {row.map(cell =>
            <td
              key={cell}
              data-position={cell}
              className={this.state.winLane.includes(cell) ? 'App-win-cell' : ''}
            >
              {this.state.clickedX.includes(cell)
                ? <img src="./images/x.png" alt="X"/>
                : ''}
              {this.state.clickedO.includes(cell)
                ? <img src="./images/o.png" alt="O"/>
                : ''}
            </td>
          )}
        </tr>
      )
    });

    return field;
  }

  clickHandler(event) {
    let td = event.target.closest('td');
    if(!this.state.isFieldActive || !td) {
      return;
    }

    let turnHistory = [...this.state.clickedX, ...this.state.clickedO];
    if (turnHistory.includes(td.dataset.position)) {
      return;
    }

    if (this.state.currentToe === 'x') {
      this.setState(
        prevState => {
          return {
            ...prevState,
            currentToe: 'o',
            clickedX: [...prevState.clickedX, td.dataset.position]
          }
        },
        () => this.isWin());

    } else {
      this.setState(
        prevState => {
          return {
            ...prevState,
            currentToe: 'x',
            clickedO: [...prevState.clickedO, td.dataset.position]
          }
        },
        () => this.isWin());
    }
  }

  restartClickHandler() {
    this.setState(prevState => {
      return {
        ...prevState,
        isFieldActive: true,
        currentToe: 'x',
        clickedX: [],
        clickedO: [],
        winLane: []
      }
    });
  }

  selectSizeHandler(event) {
    let value = event.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        currentToe: 'x',
        clickedX: [],
        clickedO: [],
        size: value,
        winCombinations: this.getWinCombinations(value),
        winLane: []
      }
    })
  }

  getWinCombinations(size) {
    let winComb = [];
    switch (size) {
      case '4':
         winComb = [
            ['11', '12', '13', '14'],
            ['21', '22', '23', '24'],
            ['31', '32', '33', '34'],
            ['41', '42', '43', '44'],

            ['11', '21', '31', '41'],
            ['12', '22', '32', '42'],
            ['13', '23', '33', '43'],
            ['14', '24', '34', '44'],

            ['11', '22', '33', '44'],
            ['41', '32', '23', '13']
         ];
         break;

      case '5':
         winComb = [
            ['11', '12', '13', '14', '15'],
            ['21', '22', '23', '24', '25'],
            ['31', '32', '33', '34', '35'],
            ['41', '42', '43', '44', '45'],
            ['51', '52', '53', '54', '55'],

            ['11', '21', '31', '41', '51'],
            ['12', '22', '32', '42', '52'],
            ['13', '23', '33', '43', '53'],
            ['14', '24', '34', '44', '54'],
            ['15', '25', '35', '45', '55'],

            ['11', '22', '33', '44', '55'],
            ['51', '42', '33', '23', '13']
         ];
         break;

      default:
        winComb = [
          ['11', '12', '13'],
          ['21', '22', '23'],
          ['31', '32', '33'],

          ['11', '21', '31'],
          ['12', '22', '32'],
          ['13', '23', '33'],

          ['11', '22', '33'],
          ['31', '22', '13']
        ];
        break;
    }

    return winComb;
  }

  isWin() {
    for (let lane of this.state.winCombinations) {
      let isXWin = lane.every(winToe => this.state.clickedX.includes(winToe));
      let isOWin = lane.every(winToe => this.state.clickedO.includes(winToe));

      if (isXWin || isOWin) {
        this.setState(
          prevState => {
            return {
              ...prevState,
              isFieldActive: false,
              winLane: lane,
            }
          });

        return;
      }
    }
  }

  render() {
    this.getWinCombinations();
    return (
      <div className="App">
        <span>Size: </span>
        <select className="App-select" onChange={(event) => this.selectSizeHandler(event)}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
        <table>
          <tbody onClick={(event) => this.clickHandler(event)}>
          {this.getFieldComponent()}
          </tbody>
        </table>
        <br/>
        <button
          className="App-restart-btn"
          onClick={() => {this.restartClickHandler()}}
        >
          Restart
        </button>
      </div>
    )
  }
};

export default App;