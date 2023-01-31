import * as _ from 'lodash';
// Taken from here: https://github.com/wix-private/fed-infra/blob/master/locale-dataset/locale-dataset-data/resources/data.json
// When using the original library the bundle increasing too much so we copied only what we need from the data.json
// Original Library: https://github.com/wix-private/fed-infra/tree/master/locale-dataset/locale-dataset-javascript
export var CURRENCIES = _.keyBy([{
        key: 'BIF',
        symbol: 'FBu',
        fraction: 0,
    },
    {
        key: 'CVE',
        symbol: '$',
        fraction: 0,
    },
    {
        key: 'KMF',
        symbol: 'CF',
        fraction: 0,
    },
    {
        key: 'CDF',
        symbol: 'FC',
        fraction: 2,
    },
    {
        key: 'DJF',
        symbol: 'Fdj',
        fraction: 0,
    },
    {
        key: 'ERN',
        symbol: 'ናቕፋ',
        fraction: 2,
    },
    {
        key: 'GNF',
        symbol: 'FG',
        fraction: 0,
    },
    {
        key: 'LSL',
        symbol: 'L',
        fraction: 2,
    },
    {
        key: 'LYD',
        symbol: 'ل.د',
        fraction: 3,
    },
    {
        key: 'MWK',
        symbol: 'MK',
        fraction: 2,
    },
    {
        key: 'MRO',
        symbol: 'UM',
        fraction: 1,
    },
    {
        key: 'MZM',
        symbol: 'MT',
        fraction: 2,
    },
    {
        key: 'ROL',
        symbol: 'ROL',
        fraction: 2,
    },
    {
        key: 'SLL',
        symbol: 'LE',
        fraction: 2,
    },
    {
        key: 'SZL',
        symbol: 'L',
        fraction: 2,
    },
    {
        key: 'TJS',
        symbol: 'TJS',
        fraction: 2,
    },
    {
        key: 'TOP',
        symbol: 'T$',
        fraction: 2,
    },
    {
        key: 'TMM',
        symbol: 'T',
        fraction: 2,
    },
    {
        key: 'ZMK',
        symbol: 'ZMW',
        fraction: 2,
    },
    {
        key: 'XPF',
        symbol: 'F',
        fraction: 2,
    },
    {
        key: 'XOF',
        symbol: 'CFA',
        fraction: 2,
    },
    {
        key: 'XAF',
        symbol: 'FCFA',
        fraction: 0,
    },
    {
        key: 'WST',
        symbol: 'WS$',
        fraction: 2,
    },
    {
        key: 'VUV',
        symbol: 'VT',
        fraction: 0,
    },
    {
        key: 'UGX',
        symbol: 'USh',
        fraction: 0,
    },
    {
        key: 'TZS',
        symbol: '/=',
        fraction: 2,
    },
    {
        key: 'STD',
        symbol: 'Db',
        fraction: 2,
    },
    {
        key: 'RWF',
        symbol: 'R₣',
        fraction: 0,
    },
    {
        key: 'PGK',
        symbol: 'K',
        fraction: 2,
    },
    {
        key: 'MVR',
        symbol: 'Rf',
        fraction: 2,
    },
    {
        key: 'MOP',
        symbol: 'MOP$',
        fraction: 2,
    },
    {
        key: 'MMK',
        symbol: 'K',
        fraction: 2,
    },
    {
        key: 'MDL',
        symbol: 'L',
        fraction: 2,
    },
    {
        key: 'HTG',
        symbol: 'G',
        fraction: 2,
    },
    {
        key: 'GMD',
        symbol: 'D',
        fraction: 2,
    },
    {
        key: 'GEL',
        symbol: 'GEL',
        fraction: 2,
    },
    {
        key: 'ETB',
        symbol: 'Br',
        fraction: 2,
    },
    {
        key: 'BTN',
        symbol: 'Nu.',
        fraction: 2,
    },
    {
        key: 'BDT',
        symbol: '৳',
        fraction: 2,
    },
    {
        key: 'AOA',
        symbol: 'Kz',
        fraction: 2,
    },
    {
        key: 'AED',
        symbol: 'AED',
        fraction: 2,
    },
    {
        key: 'MGA',
        symbol: 'Ar',
        fraction: 1,
    },
    {
        key: 'GHS',
        symbol: 'GH₵',
        fraction: 2,
    },
    {
        key: 'TMT',
        symbol: 'T',
        fraction: 2,
    },
    {
        key: 'DZD',
        symbol: 'دج',
        fraction: 2,
    },
    {
        key: 'MAD',
        symbol: 'د.م.',
        fraction: 2,
    },
    {
        key: 'KWD',
        symbol: 'د.ك',
        fraction: 3,
    },
    {
        key: 'TND',
        symbol: 'د.ت',
        fraction: 3,
    },
    {
        key: 'RUB',
        symbol: 'руб.',
        fraction: 2,
        groupFrom: 4,
        withSpace: true,
        symbolAlignment: 'right',
        groupSeparator: ' ',
        decimalSeparator: ',',
    },
    {
        key: 'AZN',
        symbol: 'AZN',
        fraction: 2,
    },
    {
        key: 'BGL',
        symbol: 'лв',
        fraction: 2,
    },
    {
        key: 'BGN',
        symbol: 'лв',
        fraction: 2,
    },
    {
        key: 'UZS',
        symbol: 'сум',
        fraction: 2,
    },
    {
        key: 'KZT',
        symbol: '₸',
        fraction: 2,
    },
    {
        key: 'KGS',
        symbol: 'сом',
        fraction: 2,
    },
    {
        key: 'RSD',
        symbol: 'РСД',
        fraction: 2,
    },
    {
        key: 'MKD',
        symbol: 'ден',
        fraction: 2,
    },
    {
        key: 'PLN',
        symbol: 'zł',
        fraction: 2,
    },
    {
        key: 'TTD',
        symbol: 'TT$',
        fraction: 2,
    },
    {
        key: 'PEN',
        symbol: 'S/.',
        fraction: 2,
    },
    {
        key: 'SOS',
        symbol: 'S',
        fraction: 2,
    },
    {
        key: 'IDR',
        symbol: 'Rp',
        fraction: 2,
    },
    {
        key: 'MYR',
        symbol: 'RM',
        fraction: 2,
    },
    {
        key: 'DOP',
        symbol: 'RD$',
        fraction: 2,
    },
    {
        key: 'BRL',
        symbol: 'R$',
        fraction: 2,
    },
    {
        key: 'ZAR',
        symbol: 'R',
        fraction: 2,
    },
    {
        key: 'GTQ',
        symbol: 'Q',
        fraction: 2,
    },
    {
        key: 'BYR',
        symbol: 'p.',
        fraction: 2,
    },
    {
        key: 'BYN',
        symbol: 'p.',
        fraction: 2,
    },
    {
        key: 'BWP',
        symbol: 'P',
        fraction: 2,
    },
    {
        key: 'TWD',
        symbol: 'NT$',
        fraction: 2,
    },
    {
        key: 'MZN',
        symbol: 'MT',
        fraction: 2,
    },
    {
        key: 'LTL',
        symbol: 'Lt',
        fraction: 2,
    },
    {
        key: 'ALL',
        symbol: 'Lek',
        fraction: 2,
    },
    {
        key: 'RON',
        symbol: 'lei',
        fraction: 2,
    },
    {
        key: 'HNL',
        symbol: 'L',
        fraction: 2,
    },
    {
        key: 'KES',
        symbol: 'Ksh',
        fraction: 2,
    },
    {
        key: 'SEK',
        symbol: 'kr',
        fraction: 2,
    },
    {
        key: 'NOK',
        symbol: 'kr',
        fraction: 2,
    },
    {
        key: 'ISK',
        symbol: 'kr',
        fraction: 0,
    },
    {
        key: 'DKK',
        symbol: 'kr',
        fraction: 2,
    },
    {
        key: 'HRK',
        symbol: 'kn',
        fraction: 2,
    },
    {
        key: 'BAM',
        symbol: 'KM',
        fraction: 2,
    },
    {
        key: 'CZK',
        symbol: 'Kč',
        fraction: 2,
    },
    {
        key: 'JOD',
        symbol: 'JD',
        fraction: 3,
    },
    {
        key: 'JMD',
        symbol: 'J$',
        fraction: 2,
    },
    {
        key: 'PYG',
        symbol: 'Gs',
        fraction: 0,
    },
    {
        key: 'AWG',
        symbol: 'ƒ',
        fraction: 2,
    },
    {
        key: 'ANG',
        symbol: 'ƒ',
        fraction: 2,
    },
    {
        key: 'HUF',
        symbol: 'Ft',
        fraction: 2,
    },
    {
        key: 'CHF',
        symbol: 'CHF',
        fraction: 2,
    },
    {
        key: 'NIO',
        symbol: 'C$',
        fraction: 2,
    },
    {
        key: 'BZD',
        symbol: 'BZ$',
        fraction: 2,
    },
    {
        key: 'VEF',
        symbol: 'Bs',
        fraction: 2,
    },
    {
        key: 'PAB',
        symbol: 'B/.',
        fraction: 2,
    },
    {
        key: 'YER',
        symbol: '﷼',
        fraction: 2,
    },
    {
        key: 'SAR',
        symbol: '﷼',
        fraction: 2,
    },
    {
        key: 'QAR',
        symbol: '﷼',
        fraction: 2,
    },
    {
        key: 'OMR',
        symbol: '﷼',
        fraction: 3,
    },
    {
        key: 'SCR',
        symbol: '₨',
        fraction: 2,
    },
    {
        key: 'PKR',
        symbol: '₨',
        fraction: 2,
    },
    {
        key: 'NPR',
        symbol: '₨',
        fraction: 2,
    },
    {
        key: 'MUR',
        symbol: '₨',
        fraction: 2,
    },
    {
        key: 'LKR',
        symbol: '₨',
        fraction: 2,
    },
    {
        key: 'UAH',
        symbol: '₴',
        fraction: 2,
    },
    {
        key: 'PHP',
        symbol: '₱',
        fraction: 2,
    },
    {
        key: 'MNT',
        symbol: '₮',
        fraction: 2,
    },
    {
        key: 'LAK',
        symbol: '₭',
        fraction: 2,
    },
    {
        key: 'EUR',
        symbol: '€',
        fraction: 2,
    },
    {
        key: 'VND',
        symbol: '₫',
        fraction: 0,
    },
    {
        key: 'ILS',
        symbol: '₪',
        fraction: 2,
    },
    {
        key: 'KRW',
        symbol: '₩',
        fraction: 0,
    },
    {
        key: 'NGN',
        symbol: '₦',
        fraction: 2,
    },
    {
        key: 'CRC',
        symbol: '₡',
        fraction: 2,
    },
    {
        key: 'KHR',
        symbol: '៛',
        fraction: 2,
    },
    {
        key: 'THB',
        symbol: '฿',
        fraction: 2,
    },
    {
        key: 'AFN',
        symbol: '؋',
        fraction: 2,
    },
    {
        key: 'JPY',
        symbol: '¥',
        fraction: 0,
    },
    {
        key: 'CNY',
        symbol: '¥',
        fraction: 2,
    },
    {
        key: 'FKP',
        symbol: '£',
        fraction: 2,
    },
    {
        key: 'SHP',
        symbol: '£',
        fraction: 2,
    },
    {
        key: 'GIP',
        symbol: '£',
        fraction: 2,
    },
    {
        key: 'LBP',
        symbol: '.ل.ل',
        fraction: 2,
    },
    {
        key: 'GBP',
        symbol: '£',
        fraction: 2,
    },
    {
        key: 'EGP',
        symbol: 'EGP',
        fraction: 2,
    },
    {
        key: 'UYU',
        symbol: '$U',
        fraction: 2,
    },
    {
        key: 'BOB',
        symbol: '$b',
        fraction: 2,
    },
    {
        key: 'USD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'BMD',
        symbol: 'BD$',
        fraction: 2,
    },
    {
        key: 'SBD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'XCD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'SGD',
        symbol: 'S$',
        fraction: 2,
    },
    {
        key: 'NZD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'MXN',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'LRD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'KYD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'HKD',
        symbol: 'HK$',
        fraction: 2,
    },
    {
        key: 'GYD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'FJD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'COP',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'CLP',
        symbol: '$',
        fraction: 0,
    },
    {
        key: 'CAD',
        symbol: 'C$',
        fraction: 2,
    },
    {
        key: 'BSD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'BND',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'BBD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'AUD',
        symbol: 'AU$',
        fraction: 2,
    },
    {
        key: 'ARS',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'NAD',
        symbol: 'N$',
        fraction: 2,
    },
    {
        key: 'SRD',
        symbol: '$',
        fraction: 2,
    },
    {
        key: 'GHC',
        symbol: '¢',
        fraction: 2,
    },
    {
        key: 'BHD',
        symbol: '.د.ب',
        fraction: 3,
    },
    {
        key: 'AMD',
        symbol: 'AMD',
        fraction: 2,
    },
    {
        key: 'TRY',
        symbol: '₺',
        fraction: 2,
    },
    {
        key: 'INR',
        symbol: '₹',
        fraction: 2,
    },
    {
        key: 'IQD',
        symbol: 'ع.د',
        fraction: 2,
    },
    {
        key: 'ZMW',
        symbol: 'ZK',
        fraction: 2,
    },
], 'key');
//# sourceMappingURL=currencies.js.map