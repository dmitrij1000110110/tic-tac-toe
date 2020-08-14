import {Component, Injectable, OnInit} from '@angular/core';
import {Cell} from "../cell/cell.component";

@Injectable()
export class Field {

  private n: number = 3
  private end: boolean = false
  cells: Cell[] = []

  constructor() {
    var id = 0
    for (var i = 1; i <= this.n; i++) {
      for (var j = 1; j <= this.n; j++) {
        var cell = new Cell(id++, i, j)
        this.cells.push(cell)
      }
    }
  }

  onFirstDiagonal(x: number, y: number): boolean {
    return x === y
  }

  onSecondDiagonal(x: number, y: number): boolean {
    return x + y === 1 + this.n
  }

  row(i: number) {
    return this.cells.filter(cell => cell.x === i)
  }

  column(j: number) {
    return this.cells.filter(cell => cell.y === j)
  }

  firstDiagonal() {
    return this.cells.filter(cell => this.onFirstDiagonal(cell.x, cell.y))
  }

  secondDiagonal() {
    return this.cells.filter(cell => this.onSecondDiagonal(cell.x, cell.y))
  }

  checkLine(l: Cell[]): boolean {
    return l.every(cell => cell.text === 'X') || l.every(cell => cell.text === 'O')
  }

  endOfGame(x: number, y: number): boolean {
    if (this.onFirstDiagonal(x, y) && this.checkLine(this.firstDiagonal())) return true
    if (this.onSecondDiagonal(x, y) && this.checkLine(this.secondDiagonal())) return true
    return this.checkLine(this.row(x)) || this.checkLine(this.column(y))
  }

  score(cell: Cell) {
    cell.text = 'O'
    var score = 0
    if (this.endOfGame(cell.x, cell.y)) score = 4
    if (this.row(cell.x).filter(cell => cell.text === 'O').length === 2) {
      if (score < 2) score = 2
    }
    if (this.column(cell.y).filter(cell => cell.text === 'O').length === 2) {
      if (score < 2) score = 2
    }
    if (this.onFirstDiagonal(cell.x, cell.y) && this.firstDiagonal().filter(cell => cell.text === 'O').length === 2) {
      if (score < 2) score = 2
    }
    if (this.onSecondDiagonal(cell.x, cell.y) && this.secondDiagonal().filter(cell => cell.text === 'O').length === 2) {
      if (score < 2) score = 2
    }
    cell.text = 'X'
    if (this.endOfGame(cell.x, cell.y)) score = 3
    if (this.row(cell.x).filter(cell => cell.text === 'X').length === 2) {
      if (score < 1) score = 1
    }
    if (this.column(cell.y).filter(cell => cell.text === 'X').length === 2) {
      if (score < 1) score = 1
    }
    if (this.onFirstDiagonal(cell.x, cell.y) && this.firstDiagonal().filter(cell => cell.text === 'X').length === 2) {
      if (score < 1) score = 1
    }
    if (this.onSecondDiagonal(cell.x, cell.y) && this.secondDiagonal().filter(cell => cell.text === 'X').length === 2) {
      if (score < 1) score = 1
    }
    cell.text = ''
    return score
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onClick(cell: Cell) {
    if (this.end) return;
    cell.clicked = true;
    cell.text = 'X'
    const x = cell.x
    const y = cell.y
    if (this.endOfGame(x, y)) {
      await this.delay(10)
      window.alert("Вы победили!")
      this.newGame()
      return;
    }
    const freeCells = this.cells.filter(cell => !cell.clicked)
    if (freeCells.length === 0) {
      await this.delay(10)
      window.alert("Ничья!")
      this.newGame()
      return;
    }
    var maxScore = this.score(freeCells[0])
    var bestMove = freeCells[0]
    for (let i = 1; i < freeCells.length; i++) {
      if (this.score(freeCells[i]) > maxScore) {
        maxScore = this.score(freeCells[i])
        bestMove = freeCells[i]
      }
    }
    bestMove.clicked = true
    bestMove.text = 'O'
    if (this.endOfGame(bestMove.x, bestMove.y)) {
      await this.delay(10)
      window.alert("Вы проиграли!")
      this.newGame()
    }
  }

  newGame() {
    document.getElementById("start").style.display = "block"
    const freeCells = this.cells.filter(cell => !cell.clicked)
    for (let i = 0; i < freeCells.length; i++) freeCells[i].clicked = true
    this.end = true
    document.getElementById("startButton").innerText = "Начать новую игру"
  }

}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  public field: Field

  ngOnInit(): void {
  }

  startGame() {
    this.field = new Field()
    document.getElementById('start').style.display = 'none'
    document.getElementById('field').style.display = 'block'
  }

}
