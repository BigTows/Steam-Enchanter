class Currency {
  private static readonly currencyMapping = {
    0: "$",
    1: "$",
    2: "£",
    3: "€",
    4: "₣",
    5: "₽",
    6: "PLN",
    7: "BRL",
    8: "JPY",
    9: "NOK",
    10: "IDR",
    11: "MYR",
    12: "PHP",
    13: "SGD",
    14: "THB",
    15: "VND",
    16: "KRW",
    17: "TRY",
    18: "UAH",
    19: "MXN",
    20: "CAD",
    21: "AUD",
    22: "NZD",
    23: "CNY",
    24: "INR",
    25: "CLP",
    26: "PEN",
    27: "COP",
    28: "ZAR",
    29: "HKD",
    30: "TWD",
    31: "SAR",
    32: "AED",
    33: "$",
    34: "ARS",
    35: "ILS",
    36: "$",
    37: "KZT",
    38: "KWD",
    39: "QAR",
    40: "CRC",
    41: "UYU",
    42: "$",
    43: "$",
    44: "$",
    45: "$",
    46: "$",
    47: "$"
  };


  public static getCurrencySymbolByWalletCurrencyNumber(walletCurrency: number): string {
    // @ts-ignore
    return Currency.currencyMapping[walletCurrency] as string;
  }

}

export default Currency;