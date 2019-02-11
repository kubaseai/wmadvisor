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
import { CdkAccordion } from '@angular/cdk/accordion';
import { Observable, merge , of} from 'rxjs';
import { toArray, mergeAll } from 'rxjs/operators';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private chartPortfolioReal: am4charts.PieChart3D;
  private chartPortfolioModel: am4charts.PieChart3D;
  private valueChart: am4charts.XYChart;
  private selectedRealPortfolioGrouping : string = 'product';
  private selectedModelPortfolioGrouping : string = 'product';
  private mapReal = new Map<string, number>();
  private mapModel = new Map<string, number>();
  private static selectedRealProduct = new Set();
  private static selectedModelProduct = new Set();
  
  constructor(private zone: NgZone, @Inject(DOCUMENT) private document: any, private renderer: Renderer) {
    this.customerPortfolio = CustomerDataService.getCustomerPortfolio(this.customerId);
  }

  private makeChartPortfolioReal() {
    if (this.chartPortfolioReal)
      this.chartPortfolioReal.dispose();
    let chartPortfolioReal = am4core.create("chartPortfolioReal", am4charts.PieChart3D);
    chartPortfolioReal.radius = 175;
    chartPortfolioReal.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chartPortfolioReal.legend = new am4charts.Legend();
    let data = [];
    if (this.selectedRealPortfolioGrouping!='product') {
      let it : Iterator<string> = this.mapReal.keys();
      while (true) {
        let result = it.next();
        if (result.done)
          break;
        data.push({ product: result.value, share: this.mapReal.get(result.value)});
      }      
    }
    else {
      for (let i : number = 0; i < this.customerPortfolio.productsAllocation.length; i++) {
        let product : ProductComponent = this.customerPortfolio.productsAllocation[i][0];
        let share : number = this.customerPortfolio.productsAllocation[i][1];
        data.push({ product: product.name, share: share, symbol: product.id });
      }  
    }    
    chartPortfolioReal.data = data;
    var series = chartPortfolioReal.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "share";
    series.dataFields.category = "product";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;
    series.slices.template.events.on("hit", function(event) {
      let symbol = data[event.target.dataItem.index].symbol;
      if (AppComponent.selectedRealProduct.has(symbol))
        AppComponent.selectedRealProduct.delete(symbol);
      else
        AppComponent.selectedRealProduct.add(symbol);
      console.log(AppComponent.selectedRealProduct);
    });
    chartPortfolioReal.svgContainer.htmlElement.style.height = 
      (data.length*45 + chartPortfolioReal.radius*2) + "px";
    this.chartPortfolioReal = chartPortfolioReal;
  }

  private makeChartPortfolioModel() {
    if (this.chartPortfolioModel)
      this.chartPortfolioModel.dispose();
    let chartPortfolioModel = am4core.create("chartPortfolioModel", am4charts.PieChart3D);
    chartPortfolioModel.radius = 175;
    chartPortfolioModel.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chartPortfolioModel.legend = new am4charts.Legend();
    let data = [];
    if (this.selectedModelPortfolioGrouping!='product') {
      let it : Iterator<string> = this.mapModel.keys();
      while (true) {
        let result = it.next();
        if (result.done)
          break;
        data.push({ product: result.value, share: this.mapModel.get(result.value)});
      }      
    }
    else {
      for (let i : number = 0; i < this.customerPortfolio.customerModelPortfolio.productsAllocation.length; i++) {
        let product : ProductComponent = this.customerPortfolio.productsAllocation[i][0];
        let share : number = this.customerPortfolio.productsAllocation[i][1];
        data.push({ product: product.name, share: share, symbol: product.id });
      }
    }    
    chartPortfolioModel.data = data;    

    chartPortfolioModel.colors.list = [
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("#FF9671"),
      am4core.color("black"),
      am4core.color("#F9F871"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("#FF9671"),
      am4core.color("black"),
      am4core.color("#F9F871"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("black"),
      am4core.color("#FF9671"),
      am4core.color("black"),
      am4core.color("#F9F871")
    ];  

    var series = chartPortfolioModel.series.push(new am4charts.PieSeries3D());
    series.propertyFields.stroke = "color";
    series.dataFields.value = "share";
    series.dataFields.category = "product";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;
    series.slices.template.events.on("hit", function(event) {
      let symbol = data[event.target.dataItem.index].symbol;
      if (AppComponent.selectedModelProduct.has(symbol))
        AppComponent.selectedModelProduct.delete(symbol);
      else
        AppComponent.selectedModelProduct.add(symbol);
      console.log(AppComponent.selectedModelProduct);
    });
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
    //this.zone.runOutsideAngular(() => {
      this.enableRwd();
      this.addGoogleFont('Archivo');    
      this.addGoogleFont('Lato');  
      this.addGoogleFont('Material Icons');    
      this.makeChartPortfolioReal();
      this.makeChartPortfolioModel();
    //});
  }

  ngOnDestroy() {  
      if (this.chartPortfolioReal) {
        this.chartPortfolioReal.dispose();
      }
      if (this.chartPortfolioModel) {
        this.chartPortfolioModel.dispose();
      }   
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
    let map : Map<string, number> = 
      (kind=='model' ? this.mapModel : this.mapReal);
    map.clear();
    
    if (by!='product') {
      let arr : Array<[ProductComponent,number]> = kind=='model' ?
        this.customerPortfolio.customerModelPortfolio.productsAllocation :
        this.customerPortfolio.productsAllocation;    
      for (let i : number = 1; i < arr.length; i++) {
        let product : ProductComponent = arr[i][0];
        let key : string = this.makeGroupingKey(product, by);
        let num : number = map.get(key);
        if (num==null)
          num = 0;
        num += arr[i][1];
        map.set(key, num);        
      }
    }

    if (kind=='model') {
      this.selectedModelPortfolioGrouping = by;
      this.makeChartPortfolioModel();
    }
    else if (kind=='real') {
      this.selectedRealPortfolioGrouping = by;
      this.makeChartPortfolioReal();
    }
    else {
      console.log('Wrong kind of chart for grouping: '+kind);
    }
  }

  onHistory(kind: string): void {
    if (this.valueChart)
      this.valueChart.dispose();

    let stockSymbols = kind=='real' ? AppComponent.selectedRealProduct :
      AppComponent.selectedModelProduct;
    let httpGets : Observable<any>[] = [];
    let it : Iterator<string> = stockSymbols.keys();
    let stockSymbol : string;
    while (true) {
      let result = it.next();
      if (result.done) {        
        break;
      }
      stockSymbol = result.value;
      httpGets.push(CustomerDataService.getStockData(stockSymbol, 360));
    }
    console.log("waiting for merge");
    merge(...httpGets).pipe(mergeAll()).pipe(toArray()).subscribe((stockData: any[]) => {
      console.log("combining stock data "+stockData.length);
      let chart = am4core.create("valueChart", am4charts.XYChart);      
      let chartData = CustomerDataService.mergeStockMultiData(stockData);
      CustomerDataService.sortByDate(chartData);
      chart.data = chartData;
      chart.svgContainer.htmlElement.style.height = "500px";

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      dateAxis.renderer.minGridDistance = 30;
      valueAxis.minX = 0;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "zoomX";
      chart.cursor.xAxis = dateAxis;
      let scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      chart.scrollbarY = new am4core.Scrollbar();      
      chart.scrollbarY.parent = chart.leftAxesContainer;
      chart.scrollbarY.toBack();

      // Create series
      let it : Iterator<string> = stockSymbols.keys();
      let stockSymbol : string;
      while (true) {
        let result = it.next();
        if (result.done) {        
          break;
        }
        stockSymbol = result.value;
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = stockSymbol;
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.tooltipText = stockSymbol + " {"+stockSymbol+"}";
        series.tooltip.pointerOrientation = "vertical";
        chart.cursor.snapToSeries = series;
        scrollbarX.series.push(series);
      }      
      
      this.valueChart = chart;
      document.getElementById('valueChart').scrollIntoView();
    });
  }
  
  predictGrowth(data: any[]) {
    CustomerDataService.sortByDate(data);
    let stock : number[];
    let symbol : string = '';
    for (let i : number = 0; i < 5; i++) {
      let obj = data[data.length-i*12];
      let value = Object.getOwnPropertyDescriptor(obj, "value").value as number;
      symbol = Object.getOwnPropertyDescriptor(obj, "symbol").value as string;
      stock[i] = value;
    }
    let stock1Y = (stock[0] - stock[1])/stock[1];
    let stock2Y = (stock[1] - stock[2])/stock[2];
    let stock3Y = (stock[2] - stock[3])/stock[3];
    let stock2Ys = (stock[0] - stock[3])/stock[3];
    let stock5Ys = (stock[0] - stock[5])/stock[5];
    let predictPerfMin1Y = Math.min(stock1Y, stock2Y, stock3Y);
    let predictPerfMax1Y = Math.max(stock1Y, stock2Y, stock3Y);
    let predictPerfMin2Y = Math.min(2*predictPerfMin1Y, stock2Ys);
    let predictPerfMax2Y = Math.max(2*predictPerfMax1Y, stock2Ys);
    let predictPerfMin5Y = Math.min(5*predictPerfMin1Y, stock5Ys);
    let predictPerfMax5Y = Math.max(5*predictPerfMax1Y, stock5Ys);
    let p1 = { year: 1};
    Object.defineProperty(p1, "min"+symbol, { value: predictPerfMin1Y });
    Object.defineProperty(p1, "max"+symbol, { value: predictPerfMax1Y });
    Object.defineProperty(p1, "avg"+symbol, { value: (predictPerfMin1Y + predictPerfMax1Y)/2 });
    let p2 = { year: 2};
    Object.defineProperty(p2, "min"+symbol, { value: predictPerfMin2Y });
    Object.defineProperty(p2, "max"+symbol, { value: predictPerfMax2Y });
    Object.defineProperty(p2, "avg"+symbol, { value: (predictPerfMin2Y + predictPerfMax2Y)/2 });
    let p5 = { year: 5}
    Object.defineProperty(p5, "min"+symbol, { value: predictPerfMin5Y });
    Object.defineProperty(p5, "max"+symbol, { value: predictPerfMax5Y });
    Object.defineProperty(p5, "avg"+symbol, { value: (predictPerfMin5Y + predictPerfMax5Y)/2 });
    return [ p1, p2, p5 ];
  }

  onPrediction(kind: string) {
      if (this.valueChart)
        this.valueChart.dispose();
  
      let stockSymbols = kind=='real' ? AppComponent.selectedRealProduct :
        AppComponent.selectedModelProduct;
      let httpGets : Observable<any>[] = [];
      let it : Iterator<string> = stockSymbols.keys();
      let stockSymbol : string;
      while (true) {
        let result = it.next();
        if (result.done) {        
          break;
        }
        stockSymbol = result.value;
        httpGets.push(CustomerDataService.getStockData(stockSymbol, 60));
      }
      let predictions = [];
      let finishCounter : number = 0;
      of(...httpGets).pipe().subscribe((o : Observable<any>) => {
        o.pipe(toArray()).subscribe( (data: any[]) => {
          predictions.push(this.predictGrowth(data));
          if (++finishCounter == httpGets.length) {
            let chart = am4core.create("valueChart", am4charts.XYChart);      
            chart.data = predictions;
            chart.svgContainer.htmlElement.style.height = "500px";

            // Create axes
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            dateAxis.renderer.minGridDistance = 30;
            valueAxis.minX = 0;

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "zoomX";
            chart.cursor.xAxis = dateAxis;
            let scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX = scrollbarX;
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            chart.scrollbarY = new am4core.Scrollbar();      
            chart.scrollbarY.parent = chart.leftAxesContainer;
            chart.scrollbarY.toBack();

            // Create series
            let it : Iterator<string> = stockSymbols.keys();
            let stockSymbol : string;
            while (true) {
              let result = it.next();
              if (result.done) {        
                break;
              }
              stockSymbol = result.value;
              let series = chart.series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "avg"+stockSymbol;
              series.dataFields.dateX = "year";
              series.strokeWidth = 2;
              series.tooltipText = stockSymbol;
              series.tooltip.pointerOrientation = "vertical";
              chart.cursor.snapToSeries = series;
              scrollbarX.series.push(series);
            }      
            
            this.valueChart = chart;
            document.getElementById('valueChart').scrollIntoView();
          }          
        });
      });
  }  
}
