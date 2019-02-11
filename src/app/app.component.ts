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
      httpGets.push(CustomerDataService.getStockData(stockSymbol, 360, true));
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
      dateAxis.title.text = "Market price history";
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
    let stock : number[] = [];
    let symbol : string = '';
    for (let i : number = 0; i <= 5; i++) {
      let idx : number = data.length - i*12;
      if (idx>=0 && idx <= data.length-1) {
        let obj = data[data.length-i*12];   
        let value = Object.getOwnPropertyDescriptor(obj, "value").value as number;
        symbol = Object.getOwnPropertyDescriptor(obj, "symbol").value as string; 
        stock.push(value);             
      }
    }
    let stock1Y = 100*(stock[0] - stock[1])/stock[1];
    let stock2Y = 100*(stock[1] - stock[2])/stock[2];
    let stock3Y = 100*(stock[2] - stock[3])/stock[3];
    let stock2Ys = 100*(stock[0] - stock[2])/stock[2];
    let stock5Ys = 100*(stock[0] - stock[5])/stock[5];
    let predictPerfMin1Y = Math.min(stock1Y, stock2Y, stock3Y);
    let predictPerfMax1Y = Math.max(stock1Y, stock2Y, stock3Y);
    let predictPerfMin2Y = Math.min(2*predictPerfMin1Y, stock2Ys);
    let predictPerfMax2Y = Math.max(2*predictPerfMax1Y, stock2Ys);
    let predictPerfMin5Y = Math.min(5*predictPerfMin1Y, stock5Ys);
    let predictPerfMax5Y = Math.max(5*predictPerfMax1Y, stock5Ys);
    return { 
      label: symbol,
      min1y: predictPerfMin1Y,
      max1yDiff: predictPerfMax1Y - predictPerfMin1Y,
      min2y: predictPerfMin2Y,
      max2yDiff: predictPerfMax2Y - predictPerfMin2Y,
      min5y: predictPerfMin5Y,
      max5yDiff: predictPerfMax5Y - predictPerfMin5Y,
    }
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
        httpGets.push(CustomerDataService.getStockData(stockSymbol, 60, false));
      }
      let predictions = [];
      let finishCounter : number = 0;
      of(...httpGets).pipe().subscribe((o : Observable<any>) => {
        o.pipe().subscribe( (data: any[]) => {
          predictions.push(this.predictGrowth(data));
          if (++finishCounter == httpGets.length) {
            let chart = am4core.create("valueChart", am4charts.XYChart);      
            chart.data = predictions;
            chart.svgContainer.htmlElement.style.height = "500px";

            // Create axes
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "label";
            categoryAxis.title.text = "Previous results projected into future, change in %";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "zoomX";
            chart.cursor.xAxis = categoryAxis;
            let scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX = scrollbarX;
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            chart.scrollbarY = new am4core.Scrollbar();      
            chart.scrollbarY.parent = chart.leftAxesContainer;
            chart.scrollbarY.toBack();

            // Add legend
            chart.legend = new am4charts.Legend();

            // Create series
            for (let label of [
              ["min1y", "min 1yr"],
              ["max1yDiff", "max 1yr"],
              ["min2y", "min 2yrs"],
              ["max2yDiff", "max 2yrs"],
              ["min5y", "min 5yrs"],
              ["max5yDiff", "max 5yrs"]])
            {
              let series = chart.series.push(new am4charts.ColumnSeries());
              series.dataFields.valueY = label[0];
              series.dataFields.categoryX = "label";
              series.name = label[1];
              series.columns.template.tooltipText = "{label}: "+label[1]+" {"+label[0]+"}%";
              series.stacked = label[0].indexOf("Diff")>0;
              series.columns.template.width = am4core.percent(95);
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
