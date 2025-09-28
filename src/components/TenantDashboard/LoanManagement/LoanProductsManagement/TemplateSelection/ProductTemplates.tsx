// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/TemplateSelection/productTemplates.ts

export const LOAN_PRODUCT_TEMPLATES = {
  // Collateral-Based Loans
  MORTGAGE: {
    name: "Home Mortgage Loan",
    code: "MORT-001",
    description: "Long-term loan for residential property purchase",
    productCategory: "mortgage",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 50000,
        maxAmount: 2000000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 5,
        maxTerm: 30,
        termUnit: "years"
      },
      interestConfig: {
        calculationMethod: "reducing_balance",
        rateType: "fixed",
        baseRate: 12.5,
        compoundingFrequency: "monthly"
      },
      fees: [
        { name: "Processing Fee", amount: 500, type: "fixed" },
        { name: "Valuation Fee", amount: 1500, type: "fixed" }
      ],
      collateralConfig: {
        isRequired: true,
        collateralTypes: ["real_estate"],
        minLtvRatio: 60,
        maxLtvRatio: 80,
        insuranceRequired: true
      },
      eligibility: {
        minAge: 21,
        maxAge: 65,
        minIncome: 5000,
        minEmployment: 24
      },
      repaymentConfig: {
        frequency: "monthly",
        gracePeriod: 3,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "low",
        maxDebtToIncomeRatio: 40
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 30
      }
    }
  },

  AUTO_LOAN: {
    name: "Vehicle Financing",
    code: "AUTO-001",
    description: "Loan for new or used vehicle purchase",
    productCategory: "auto",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 10000,
        maxAmount: 500000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 1,
        maxTerm: 7,
        termUnit: "years"
      },
      interestConfig: {
        calculationMethod: "reducing_balance",
        rateType: "fixed",
        baseRate: 14.5,
        compoundingFrequency: "monthly"
      },
      fees: [
        { name: "Processing Fee", amount: 300, type: "fixed" },
        { name: "Insurance", amount: 2.5, type: "percentage" }
      ],
      collateralConfig: {
        isRequired: true,
        collateralTypes: ["vehicle"],
        minLtvRatio: 70,
        maxLtvRatio: 90,
        insuranceRequired: true
      },
      eligibility: {
        minAge: 18,
        maxAge: 70,
        minIncome: 2000
      },
      repaymentConfig: {
        frequency: "monthly",
        gracePeriod: 1,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "medium",
        maxDebtToIncomeRatio: 45
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 14
      }
    }
  },

  // Salary-Backed Loans
  SALARY_ADVANCE: {
    name: "Salary Advance",
    code: "SAL-001",
    description: "Short-term loan against upcoming salary",
    productCategory: "payslip",
    loanType: "payday",
    configuration: {
      amountConfig: {
        type: "formula",
        amountFormula: "client.monthlyIncome * 0.3",
        currency: "ZMW"
      },
      termConfig: {
        type: "fixed",
        fixedTerm: 1,
        termUnit: "months"
      },
      interestConfig: {
        calculationMethod: "flat",
        rateType: "fixed",
        baseRate: 5,
        compoundingFrequency: "once"
      },
      fees: [
        { name: "Processing Fee", amount: 100, type: "fixed" }
      ],
      collateralConfig: {
        isRequired: false,
        collateralTypes: [],
        minLtvRatio: 0,
        maxLtvRatio: 0
      },
      eligibility: {
        minAge: 18,
        maxAge: 60,
        minIncome: 1000,
        minEmployment: 6
      },
      repaymentConfig: {
        frequency: "lump_sum",
        gracePeriod: 0,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "medium",
        maxDebtToIncomeRatio: 50
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 2
      }
    }
  },

  // Agricultural Loans
  AGRICULTURAL: {
    name: "Agricultural Input Loan",
    code: "AGRI-001",
    description: "Seasonal loan for farming inputs and equipment",
    productCategory: "agricultural",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 5000,
        maxAmount: 200000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 6,
        maxTerm: 18,
        termUnit: "months"
      },
      interestConfig: {
        calculationMethod: "seasonal",
        rateType: "fixed",
        baseRate: 10,
        compoundingFrequency: "seasonal"
      },
      fees: [
        { name: "Processing Fee", amount: 200, type: "fixed" }
      ],
      collateralConfig: {
        isRequired: false,
        collateralTypes: [],
        minLtvRatio: 0,
        maxLtvRatio: 0
      },
      eligibility: {
        minAge: 18,
        maxAge: 65,
        minIncome: 0
      },
      repaymentConfig: {
        frequency: "seasonal",
        gracePeriod: 6,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "high",
        maxDebtToIncomeRatio: 60
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 7
      }
    }
  },

  // Microfinance Loans
  GROUP_MICROLOAN: {
    name: "Group Microloan",
    code: "MICRO-001",
    description: "Small loan for group-based borrowing",
    productCategory: "microfinance",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 1000,
        maxAmount: 50000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 3,
        maxTerm: 24,
        termUnit: "months"
      },
      interestConfig: {
        calculationMethod: "flat",
        rateType: "fixed",
        baseRate: 18,
        compoundingFrequency: "monthly"
      },
      fees: [
        { name: "Group Registration", amount: 50, type: "fixed" }
      ],
      collateralConfig: {
        isRequired: false,
        collateralTypes: ["guarantor"],
        minLtvRatio: 0,
        maxLtvRatio: 0
      },
      eligibility: {
        minAge: 18,
        maxAge: 65,
        minIncome: 500
      },
      repaymentConfig: {
        frequency: "weekly",
        gracePeriod: 1,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "medium",
        maxDebtToIncomeRatio: 55
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 5
      }
    }
  },

  // Business Loans
  SME_LOAN: {
    name: "SME Business Loan",
    code: "SME-001",
    description: "Working capital and expansion financing for small businesses",
    productCategory: "business",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 10000,
        maxAmount: 500000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 6,
        maxTerm: 60,
        termUnit: "months"
      },
      interestConfig: {
        calculationMethod: "reducing_balance",
        rateType: "variable",
        baseRate: 16,
        compoundingFrequency: "monthly"
      },
      fees: [
        { name: "Processing Fee", amount: 2, type: "percentage" }
      ],
      collateralConfig: {
        isRequired: true,
        collateralTypes: ["real_estate", "equipment", "inventory"],
        minLtvRatio: 50,
        maxLtvRatio: 70
      },
      eligibility: {
        minAge: 21,
        maxAge: 65,
        minIncome: 3000,
        businessAge: 12
      },
      repaymentConfig: {
        frequency: "monthly",
        gracePeriod: 3,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "medium",
        maxDebtToIncomeRatio: 50
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 21
      }
    }
  },

  PERSONAL_LOAN: {
    name: "Personal Loan",
    code: "PERS-001",
    description: "Multi-purpose loan for personal needs",
    productCategory: "personal",
    loanType: "installment",
    configuration: {
      amountConfig: {
        type: "range",
        minAmount: 1000,
        maxAmount: 100000,
        currency: "ZMW"
      },
      termConfig: {
        type: "range",
        minTerm: 3,
        maxTerm: 36,
        termUnit: "months"
      },
      interestConfig: {
        calculationMethod: "reducing_balance",
        rateType: "fixed",
        baseRate: 15,
        compoundingFrequency: "monthly"
      },
      fees: [
        { name: "Processing Fee", amount: 150, type: "fixed" }
      ],
      collateralConfig: {
        isRequired: false,
        collateralTypes: [],
        minLtvRatio: 0,
        maxLtvRatio: 0
      },
      eligibility: {
        minAge: 18,
        maxAge: 65,
        minIncome: 1500
      },
      repaymentConfig: {
        frequency: "monthly",
        gracePeriod: 1,
        allowEarlyRepayment: true
      },
      riskConfig: {
        riskCategory: "medium",
        maxDebtToIncomeRatio: 45
      },
      disbursementConfig: {
        method: "lump_sum",
        maxDisbursementPeriod: 7
      }
    }
  }
};

export const TEMPLATE_CATEGORIES = {
  COLLATERAL_BASED: ['MORTGAGE', 'AUTO_LOAN'],
  SALARY_BACKED: ['SALARY_ADVANCE'],
  AGRICULTURAL: ['AGRICULTURAL'],
  MICROFINANCE: ['GROUP_MICROLOAN'],
  BUSINESS: ['SME_LOAN'],
  PERSONAL: ['PERSONAL_LOAN']
};

export type LoanProductTemplate = typeof LOAN_PRODUCT_TEMPLATES[keyof typeof LOAN_PRODUCT_TEMPLATES];
export type TemplateKey = keyof typeof LOAN_PRODUCT_TEMPLATES;