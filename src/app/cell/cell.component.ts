import { Component, OnInit } from '@angular/core';
import {Field, FieldComponent} from "../field/field.component";

export class Cell {
  id: number
  x: number
  y: number
  clicked = false
  text: string = ''

  constructor(id: number, x: number, y: number) {
    this.id = id
    this.x = x
    this.y = y
  }

}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})

export class CellComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
