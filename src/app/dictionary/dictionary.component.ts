import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export enum CustomerRiskProfile {
  AGGRESSIVE = "Aggressive",
  BALANCED = "Balanced",
  DYNAMIC = "Dynamic"
}
