
class Game{
    constructor(p1, p2, hieght = 6, width =7,){
        this.player = [p1, p2]
        this.hieght = hieght
        this.width = width
        this.currentPlayer = p1
        this.makeBoard()
        this.makeHtmlBoard()
        this.gameOver = false;

    }
    makeBoard() {
        this.board = []
        for (let row = 0; row < this.hieght; row++) {
          this.board.push(Array.from({length: this.width }));
        }
      }
    
    makeHtmlBoard() {
        const board = document.getElementById('board');
      
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.handleClick.bind(this));
      
        for (let column = 0; column < this.width; column++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', column);
          top.append(headCell);
        }
      
        board.append(top);
      
        // make main part of board
        for (let row = 0; row < this.hieght; row++) {
          const tr = document.createElement('tr');
      
          for (let column = 0; column < this.width; column++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${row}-${column}`);
            tr.append(cell);
          }
      
          board.append(tr);
        }
      }

    findSpotForCol(column) {
        for (let row = this.hieght - 1; row >= 0; row--) {
          if (!this.board[row][column]) {
            return row;
          }
        }
        return null;
    }
      
      /** placeInTable: update DOM to place piece into HTML table of board */
      
    placeInTable(row, column) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currentPlayer.color

      
        const spot = document.getElementById(`${row}-${column}`);
        spot.append(piece);
    }
      
      /** endGame: announce game end */
      
    endGame(msg) {
        alert(msg);
    }




    handleClick(evt) {
        const column = +evt.target.id;
        // get next spot in column (if none, ignore click)
        const row = this.findSpotForCol(column);
        if (row === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[row][column] = this.currentPlayer;
        this.placeInTable(row, column);
        
        // check for win
        if (this.checkForWin()) {
          return this.endGame(`Player ${this.currentPlayer.color} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        this.currentPlayer = this.currentPlayer === this.player[0] ? this.player[1] : this.player[0];
    }
    
    checkForWin() {
       const _win = (cells) => 
        cells.every(
          ([row, column]) => 
            row >= 0 &&
            row < this.hieght &&
            column >= 0 &&
            column < this.width &&
            this.board[row][column] === this.currentPlayer
        );
      
    
      for (let row = 0; row < this.hieght; row++) {
        for (let column = 0; column < this.width; column++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[row, column], [row, column + 1], [row, column + 2], [row, column + 3]];
          const vert = [[row, column], [row + 1, column], [row + 2, column], [row + 3, column]];
          const diagDR = [[row, column], [row + 1, column + 1], [row + 2, column + 2], [row + 3, column + 3]];
          const diagDL = [[row, column], [row + 1, column - 1], [row + 2, column - 2], [row + 3, column - 3]];
    
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
}


class Player{
  constructor(color){
    this.color = color
  }
}

document.getElementById('start').addEventListener('click', ()=>{
  let p1 = new Player(document.getElementById('playerOne').value);
  let p2 = new Player(document.getElementById('playerTwo').value);
  new Game(p1, p2);
});

document.querySelector('#Restart').addEventListener('click', ()=> location.reload())

