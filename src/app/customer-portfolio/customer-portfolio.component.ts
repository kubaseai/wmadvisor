import { Component, OnInit } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { CustomerRiskProfile } from '../dictionary/dictionary.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';

@Component({
  selector: 'app-customer-portfolio',
  templateUrl: './customer-portfolio.component.html',
  styleUrls: ['./customer-portfolio.component.css']
})
export class CustomerPortfolioComponent implements OnInit {

  customerId: string;
  productsAllocation: Array<[ProductComponent,number]>;
  customerRiskProfile: CustomerRiskProfile;
  customerModelPortfolio: PortfolioComponent;

  constructor() { }

  ngOnInit() {
  }

}
