import { Component, NgZone } from '@angular/core';
import { CustomerPortfolioComponent } from './customer-portfolio/customer-portfolio.component';
import { ProductComponent, ProductLiquidityLevel, ProductTypeCode, ProductRecommendation, ProductRating, MifidRiskTolerancePrispLevel, MifidRiskToleranceNonPrispLevel, MifidInvestmentTimeHorizon } from './product/product.component';
import { CustomerDataService } from './customer-data.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Renderer, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import 'hammerjs';
import {MatButtonModule} from '@angular/material/button';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private chartPortfolioReal: am4charts.PieChart3D;
  private chartPortfolioModel: am4charts.PieChart3D;
  private selectedRealPortfolioGrouping : string = 'product';
  private selectedModelPortfolioGrouping : string = 'product';
  private mapReal = new Map<string, number>();
  private mapModel = new Map<string, number>();
  
  constructor(private zone: NgZone, @Inject(DOCUMENT) private document: any, private renderer: Renderer) {
    this.customerPortfolio = CustomerDataService.getCustomerPortfolio(this.customerId);
  }

  private makeChartPortfolioReal() {
    let chartPortfolioReal = am4core.create("chartPortfolioReal", am4charts.PieChart3D);
    chartPortfolioReal.radius = 200;
    chartPortfolioReal.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chartPortfolioReal.legend = new am4charts.Legend();
    let data = [];
    for (let i : number = 0; i < this.customerPortfolio.productsAllocation.length; i++) {
      let product : ProductComponent = this.customerPortfolio.productsAllocation[i][0];
      let share : number = this.customerPortfolio.productsAllocation[i][1];
      console.log(product.name + ": "+share);
      data.push({ product: product.name, share: share });
    }      
    chartPortfolioReal.data = data;
    var series = chartPortfolioReal.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "share";
    series.dataFields.category = "product";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;
    chartPortfolioReal.svgContainer.htmlElement.style.height = 
      (data.length*45 + chartPortfolioReal.radius*2) + "px";
    this.chartPortfolioReal = chartPortfolioReal;
  }

  private makeChartPortfolioModel() {
    let chartPortfolioModel = am4core.create("chartPortfolioModel", am4charts.PieChart3D);
    chartPortfolioModel.radius = 200;
    chartPortfolioModel.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chartPortfolioModel.legend = new am4charts.Legend();
    let data = [];
    for (let i : number = 0; i < this.customerPortfolio.customerModelPortfolio.productsAllocation.length; i++) {
      let product : ProductComponent = this.customerPortfolio.productsAllocation[i][0];
      let share : number = this.customerPortfolio.productsAllocation[i][1];
      console.log(product.name + ": "+share);
      data.push({ product: product.name, share: share });
    }      
    chartPortfolioModel.data = data;
    chartPortfolioModel.colors.list = [
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("#FF9671"),
      am4core.color("black"),
      am4core.color("#F9F871")
    ];
    var series = chartPortfolioModel.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "share";
    series.dataFields.category = "product";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;
    chartPortfolioModel.svgContainer.htmlElement.style.height = 
      (data.length*45 + chartPortfolioModel.radius*2) + "px";
    this.chartPortfolioModel = chartPortfolioModel;
  }

  private addGoogleFont(name: string) {
    const elem = this.renderer.createElement(this.document.head, 'link');
    this.renderer.setElementProperty(elem, 'href', 'https://fonts.googleapis.com/css?family='+name.replace(' ','+'));
    this.renderer.setElementProperty(elem, 'rel', 'stylesheet');
  }

  private enableRwd() {
    const elem = this.renderer.createElement(this.document.head, 'meta');
    this.renderer.setElementProperty(elem, 'content', 'width=device-width, initial-scale=1');
    this.renderer.setElementProperty(elem, 'name', 'viewport');
  }
 
  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.enableRwd();
      this.addGoogleFont('Archivo');    
      this.addGoogleFont('Lato');  
      this.addGoogleFont('Material Icons');    
      this.makeChartPortfolioReal();
      this.makeChartPortfolioModel();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartPortfolioReal) {
        this.chartPortfolioReal.dispose();
      }
    });
  }
  title = 'Investment Advisory Calculator';
  customerId = "1";  
  customerPortfolio? : CustomerPortfolioComponent;

  makeGroupingKey(product: ProductComponent, by: string) : string {
    if (by=='industry')
      return product.advisoryClassificationGroupName;
    else if (by=='currency')
      return product.originalCurrency;
    return product.name;
  }

  onSelected(kind: string, by: string): void {
    console.log("grouping requested for "+kind+" by "+by);
    let map : Map<string, number> = 
      (kind=='model' ? this.mapModel : this.mapReal);
    map.clear();

    if (by=='product')
      return;
    
    for (let i : number = 1; i < this.customerPortfolio.productsAllocation.length; i++) {
      let product : ProductComponent = this.customerPortfolio.productsAllocation[i][0];
      let key : string = this.makeGroupingKey(product, by);
      let num : number = map[key];
      if (num==null)
        num = 0;
      num += this.customerPortfolio.productsAllocation[i][1];
      map[key] = num;
    }

    if (kind=='model')
      this.makeChartPortfolioModel();
    else if (kind=='real')
      this.makeChartPortfolioReal();
  }
}
