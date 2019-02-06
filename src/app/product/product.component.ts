import { Component, OnInit } from '@angular/core';
import { namespaceHTML } from '@angular/core/src/render3';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  id: string;
  isin?: string;
  name: string;
  liquidityLevel?: ProductLiquidityLevel;
  geoCode?: string;
  originalCurrency: string;
  typeCode?: ProductTypeCode;
  isOfferable?: boolean;
  isBenchmark?: boolean;
  isComplex?: boolean;
  recommendationByBank?: ProductRecommendation;
  recommendationByIssuer?: ProductRecommendation;  
  returnInPercents1Y?: number;
  profitabilityInPercents5Y?: number;
  profitabilityInPercents2Y?: number;
  expectedReturnInPercents?: number;
  isUnderCampaign?: boolean;
  maxConcentrationInPercents?: number;
  mifidFamilyId?: string;
  isEmergingMarket?: boolean;
  isHedgeOnFxRate?: boolean;
  referenceBenchmark?: string;
  benchmarkProfitabilityInPerecents1Y?: number;
  benchmarkProfitabilityInPerecents2Y?: number;
  roaInPercents?: number;
  focusListId?: string;
  currentMarketPrice?: number;
  ratingByIssuer?: ProductRating;
  advisoryClassificationGroupName?: string;
  issuerGroupId?: string;
  expirationDate?: Date;
  isGuaranteed?: boolean;
  fundClassId?: string;
  fundManagementFee?: number;
  distributionFee?: number;
  isDividendCapable?: boolean;
  buyingCurrency?: string;
  isFundAccumulationVsDistribution?: boolean;
  initialChargePercentage?: number;
  exitChargePercentage?: number;
  transactionCommisionPercentage?: number;
  mifidIncidentialCosts?: number;
  mifidOngoingCosts?: number;
  mifidManagementCommissionPercentage?: number;
  mifidPerformanceFee?: number;
  mifidRetailInvestorEligible?: boolean;
  mifidProfessionalInvestorEligible?: boolean;
  mifidCounterpartyInvestorEligible?: boolean;
  mifidBasicInvestorEligible?: boolean;
  mifidInformedInvestorEligible?: boolean;
  mifidAdvancedInvestorEligible?: boolean;
  mifidRiskTolerancePrisp?: MifidRiskTolerancePrispLevel;
  mifidRiskToleranceNonPrisp?: MifidRiskToleranceNonPrispLevel;
  mifidIsBeyondCapitalLoss?: boolean;
  mifidIsNoCapitalGuarantee?: boolean;
  mifidIsLimitedCapitalLoss?: boolean;
  mifidIsHedgingProfile?: boolean;
  mifidTimeHorizon?: MifidInvestmentTimeHorizon;

  public static createShare(id: string, name: string, currency: string, industry: string) : ProductComponent {
    let product: ProductComponent = new ProductComponent();
    product.id = id;
    product.name = name;
    product.originalCurrency = currency;
    product.advisoryClassificationGroupName = industry;
    product.typeCode = ProductTypeCode.Equity;
    return product;    
  }

  public static createDeposit(id: string, name: string, currency: string) : ProductComponent {
    let product: ProductComponent = new ProductComponent();
    product.id = id;
    product.name = name;
    product.originalCurrency = currency;
    product.advisoryClassificationGroupName = "Deposit"
    product.typeCode = ProductTypeCode.FixedIncome;
    return product;    
  }  

  ngOnInit() {
  }
}

export enum ProductLiquidityLevel {
  L1, L2, L3, L4, L5, L6, L7
}

export enum MifidRiskTolerancePrispLevel {
  L1, L2, L3, L4, L5, L6, L7
}

export enum MifidRiskToleranceNonPrispLevel {
  Low,
  Medium,
  High
}

export enum ProductTypeCode {
  FixedIncome = 1,
  Equity = 2,
  Funds = 5,
  Derivatives = 7,
  Structured = 8
}

export enum ProductRecommendation {
  BUY,
  SELL,
  SELECTIVE,
  NOT_CLASSIFIED
}

export enum ProductRating {
  STAR1 = 1,
  STAR2 = 2,
  STAR3 = 3,
  STAR4 = 4,
  STAR5 = 5
}

export enum MifidInvestmentTimeHorizon {
  VERY_SHORT_TERM /* < 12m */,
  SHORT_TERM /* 1-3 years */,
  MEDIUM_TERM /* 3-6 years */,
  LONG_TERM /* > 6 years */,
  NEUTRAL /* not defined */
}
