import { Injectable } from '@angular/core';
import { CustomerPortfolioComponent } from '../app/customer-portfolio/customer-portfolio.component';
import { CustomerRiskProfile } from '../app/dictionary/dictionary.component';
import { ProductComponent } from '../app/product/product.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HttpClientModule, HttpClient, HttpHandler, HttpXhrBackend, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injector} from '@angular/core';
import { Observable, pipe, from } from 'rxjs';
import { map, flatMap, filter, skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {

  private static API_KEY : string = 'N4MJ59ALJQQV88T4';

  private static injector = Injector.create({
    providers: [
        { provide: HttpClient, deps: [HttpHandler] },
        { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) },
    ],
  });
  private static http: HttpClient = CustomerDataService.injector.get(HttpClient);
  
  public static getCustomerPortfolio(clientId: string) : CustomerPortfolioComponent {
    let aCustomerRiskProfile: CustomerRiskProfile = CustomerRiskProfile.BALANCED;
    let portfolio : CustomerPortfolioComponent = {
      customerId: clientId,
      customerRiskProfile: aCustomerRiskProfile,
      productsAllocation: [ 
        /* https://www.nasdaq.com/quotes/institutional-portfolio/vanguard-group-inc-61322 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/price-t-rowe-associates-inc-md-2145 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/blackrock-inc-711679 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/franklin-resources-inc-8481 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/state-street-corp-6697 */
          [ProductComponent.createShare("MSFT", "Microsoft Corporation", "USD", "Technology"), 12.12],
          [ProductComponent.createShare("AAPL", "Apple Inc.",  "USD", "Technology"), 11.51],   
          [ProductComponent.createShare("AMZN", "Amazon.com Inc", "USD", "Consumer Services"), 9.81],    
          [ProductComponent.createShare("JNJ", "Johnson & Johnson", "USD", "Health Care"), 5.84], 
          [ProductComponent.createShare("FB", "Facebook Inc.", "USD", "Technology"), 5.82],
          [ProductComponent.createShare("BRK", "Berkshire Hathaway Inc.", "USD", "Conglomerate"), 5.63],
          [ProductComponent.createShare("JPM", "J.P. Morgan Chase & Co", "USD", "Financial"), 5.41],
          [ProductComponent.createShare("GOOG", "Alphabet Inc.", "USD", "Technology"), 9.79],
          [ProductComponent.createShare("BAC", "Bank of America Corp.", "USD", "Financial"), 3.88],
          [ProductComponent.createShare("PFE", "Pfitzer Inc.", "USD", "Health Care"), 3.88],
          [ProductComponent.createShare("V", "Visa Inc.", "USD", "Miscellaneous"), 3.82],
          [ProductComponent.createShare("REGN", "Procter & Gamble", "USD", "Health Care"), 3.73],
          [ProductComponent.createShare("INTC", "Intel Corporation", "USD", "Technology"), 3.57],
          [ProductComponent.createShare("CSCO", "Cisco Systems", "USD", "Technology"), 3.47],
          [ProductComponent.createShare("VZ", "Verizon Communications Inc", "USD", "Public Utilities"), 3.37],
          [ProductComponent.createShare("BA", "Boeing", "USD", "Capital Goods"), 3.26],
          [ProductComponent.createDeposit("DEPOSIT_EUR_3M", "Deposit in Euro for 3 months", "EUR"), 5.09],
      ],
      customerModelPortfolio: CustomerDataService.getModelPortfolio(CustomerRiskProfile[aCustomerRiskProfile]),
      
      ngOnInit() {
      }
    }
    return portfolio;
  }

  public static getModelPortfolio(idOf: string) : PortfolioComponent {
    let portfolio : PortfolioComponent = {
      id: idOf,
      name: idOf,
      productsAllocation: [ 
        /* https://www.nasdaq.com/quotes/institutional-portfolio/vanguard-group-inc-61322 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/price-t-rowe-associates-inc-md-2145 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/blackrock-inc-711679 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/franklin-resources-inc-8481 */
        /* https://www.nasdaq.com/quotes/institutional-portfolio/state-street-corp-6697 */
        [ProductComponent.createShare("MSFT", "Microsoft Corporation", "USD", "Technology"), 9],
        [ProductComponent.createShare("AAPL", "Apple Inc.",  "USD", "Technology"), 9],   
        [ProductComponent.createShare("AMZN", "Amazon.com Inc", "USD", "Consumer Services"), 9],    
        [ProductComponent.createShare("JNJ", "Johnson & Johnson", "USD", "Health Care"), 9], 
        [ProductComponent.createShare("FB", "Facebook Inc.", "USD", "Technology"), 9],
        [ProductComponent.createShare("BRK", "Berkshire Hathaway Inc.", "USD", "Conglomerate"), 9],
        [ProductComponent.createShare("JPM", "J.P. Morgan Chase & Co", "USD", "Financial"), 9],
        [ProductComponent.createShare("GOOG", "Alphabet Inc.", "USD", "Technology"), 9],
        [ProductComponent.createShare("BAC", "Bank of America Corp.", "USD", "Financial"), 9],
        [ProductComponent.createShare("PFE", "Pfitzer Inc.", "USD", "Health Care"), 9],
        [ProductComponent.createDeposit("DEPOSIT_EUR_3M", "Deposit in Euro for 3 months", "EUR"), 10], 
      ],
      customerRiskProfile: CustomerRiskProfile.BALANCED,
      isManagedByPrivateBanker: false,

      ngOnInit() {
      }

    }
    return portfolio;
  }

  public static mergeStockMultiData(data: any[]) : any[] {
    let map : Map<string,any> = new Map();
    for (let entry of data) {
      let date = Object.getOwnPropertyDescriptor(entry, 'date').value;
      let existing = map.get(date);
      if (existing!=null) {
        for (let p of Object.getOwnPropertyNames(existing)) {
          let pDesc = Object.getOwnPropertyDescriptor(existing, p);
          Object.defineProperty(entry, p, pDesc);
        }
      }
      map.set(date, entry);      
    }
    return Array.from(map.values());
  }

  public static dailyStocksTransform(arr: any, symbol: string) : any {
    if (arr==null || arr==undefined)
      return [];
    let symbols : Array<string> = Object.getOwnPropertyNames(arr);
    let data = [];
    for (let name of symbols) {
      let val = Object.getOwnPropertyDescriptor(arr, name).value;
      let price = val["4. close"];
      let obj = { date: name, value: price};
      Object.defineProperty(obj, symbol, { value: price });
      data.push(obj);
    }
    return data;
  }

  public static getStockData(symbol: string, points: number) : Observable<any> {
    console.log('Requested stock data for '+symbol);
    let payload = CustomerDataService.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol='
      +symbol+'&outputSize='+points+'&apikey='+CustomerDataService.API_KEY).pipe(
        map(root => CustomerDataService
          .dailyStocksTransform(root["Monthly Time Series"], symbol))
    );
    return payload;
  }
  
  public static sortByDate(data: any[]) {
    data.sort( (o1, o2) => {
      let o1date = Object.getOwnPropertyDescriptor(o1, "date").value as string;
      let o2date = Object.getOwnPropertyDescriptor(o2, "date").value as string;
      return o1date.localeCompare(o2date);
    });
  }
}
