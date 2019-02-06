import { Component, OnInit } from '@angular/core';
import { CustomerRiskProfile } from '../dictionary/dictionary.component';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  id: string;
  name: string;
  productsAllocation: Array<[ProductComponent,number]>;
  customerRiskProfile: CustomerRiskProfile;
  isManagedByPrivateBanker: boolean;

  constructor() { }

  ngOnInit() {
  }

}
