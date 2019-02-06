import { Injectable } from '@angular/core';
import { CustomerPortfolioComponent } from '../app/customer-portfolio/customer-portfolio.component';
import { CustomerRiskProfile } from '../app/dictionary/dictionary.component';
import { ProductComponent } from '../app/product/product.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {

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
          [ProductComponent.createShare("BRK.A", "Berkshire Hathaway Inc.", "USD", "Conglomerate"), 5.63],
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
        [ProductComponent.createShare("BRK.A", "Berkshire Hathaway Inc.", "USD", "Conglomerate"), 9],
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

  constructor() { }
}
