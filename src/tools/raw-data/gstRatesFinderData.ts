// GST Rate Finder — HSN/SAC-wise GST Rates for common goods & services
// Updated as per 56th GST Council Meeting (Sep 2025) + FY 2025-26

export interface GstRateEntry {
    sNo: number;
    hsnSac: string;
    description: string;
    category: string;
    gstRate: number;
    igst: number;
    cgst: number;
    sgst: number;
    cessApplicable: string;
    remarks: string;
}

export const gstRatesData: GstRateEntry[] = [
{sNo:1,hsnSac:'0401',description:'Fresh Milk (unprocessed)',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated — essential commodity'},
{sNo:2,hsnSac:'0713',description:'Dried Pulses (unbranded)',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated if unbranded & unpackaged'},
{sNo:3,hsnSac:'1001',description:'Wheat (unbranded)',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated if loose/unbranded'},
{sNo:4,hsnSac:'1006',description:'Rice (unbranded)',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated if loose/unbranded'},
{sNo:5,hsnSac:'0702',description:'Fresh Vegetables',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated — all fresh vegetables'},
{sNo:6,hsnSac:'0803',description:'Fresh Fruits',category:'Food & Beverages',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated — all fresh fruits'},
{sNo:7,hsnSac:'4901',description:'Books, Newspapers, Periodicals',category:'Education',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Nil rated'},
{sNo:8,hsnSac:'3006',description:'Life-saving drugs / vaccines',category:'Healthcare',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Specified drugs exempt'},
{sNo:9,hsnSac:'SAC 9992',description:'Educational services',category:'Education',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Pre-school to higher secondary exempt'},
{sNo:10,hsnSac:'SAC 9993',description:'Healthcare services',category:'Healthcare',gstRate:0,igst:0,cgst:0,sgst:0,cessApplicable:'No',remarks:'Clinical & in-patient services exempt'},
{sNo:11,hsnSac:'1905',description:'Bread, Rusk, Pizza bread',category:'Food & Beverages',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'5% if sold below ₹100 per pack'},
{sNo:12,hsnSac:'0402',description:'Milk products (Paneer, Butter)',category:'Food & Beverages',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Branded dairy products'},
{sNo:13,hsnSac:'0901',description:'Coffee beans, Tea leaves',category:'Food & Beverages',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Unprocessed tea & coffee'},
{sNo:14,hsnSac:'1704',description:'Sugar confectionery',category:'Food & Beverages',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Sugar, jaggery, misri'},
{sNo:15,hsnSac:'1507',description:'Edible Oils',category:'Food & Beverages',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Mustard, soybean, groundnut oil'},
{sNo:16,hsnSac:'3004',description:'Medicines & pharma products',category:'Healthcare',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Most medicines at 5%'},
{sNo:17,hsnSac:'4802',description:'Newsprint / printing paper',category:'Paper & Print',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Reduced from 12% in 2022'},
{sNo:18,hsnSac:'2710',description:'Kerosene (PDS)',category:'Petroleum',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Under PDS distribution'},
{sNo:19,hsnSac:'8601-8608',description:'Railway parts & equipment',category:'Transport',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Reduced from 18% post 56th Council'},
{sNo:20,hsnSac:'9608',description:'Pens (Ball point, Marker)',category:'Stationery',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Reduced from 18% post 56th Council'},
{sNo:21,hsnSac:'SAC 9964',description:'Passenger transport (bus/metro)',category:'Transport',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'AC bus & non-AC sleeper'},
{sNo:22,hsnSac:'SAC 9966',description:'Goods transport by road',category:'Transport',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'GTA services (if opted)'},
{sNo:23,hsnSac:'3401',description:'Soap, organic surface-active',category:'FMCG',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard 18% rate'},
{sNo:24,hsnSac:'3402',description:'Detergents, cleaning preparations',category:'FMCG',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:25,hsnSac:'3304',description:'Beauty / make-up preparations',category:'FMCG',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Cosmetics & toiletries'},
{sNo:26,hsnSac:'3306',description:'Toothpaste, Oral hygiene',category:'FMCG',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:27,hsnSac:'6109',description:'T-shirts, vests (>₹1000)',category:'Apparel',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Above ₹1000 per piece: 18%'},
{sNo:28,hsnSac:'6109',description:'T-shirts, vests (≤₹1000)',category:'Apparel',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Up to ₹1000 per piece: 5%'},
{sNo:29,hsnSac:'8471',description:'Computers & laptops',category:'Electronics',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:30,hsnSac:'8517',description:'Mobile phones (≤₹10000)',category:'Electronics',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Revised from 12% in 2020'},
{sNo:31,hsnSac:'8528',description:'Monitors & TV sets',category:'Electronics',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:32,hsnSac:'8418',description:'Refrigerators & freezers',category:'Appliances',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:33,hsnSac:'8450',description:'Washing machines',category:'Appliances',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:34,hsnSac:'8415',description:'Air conditioners',category:'Appliances',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Moved from 28% to 18% slab'},
{sNo:35,hsnSac:'7210',description:'Iron & Steel products',category:'Metals',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:36,hsnSac:'7606',description:'Aluminium products',category:'Metals',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate'},
{sNo:37,hsnSac:'2523',description:'Cement (all kinds)',category:'Construction',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Reduced from 28% to 18%'},
{sNo:38,hsnSac:'SAC 9954',description:'Construction services (commercial)',category:'Real Estate',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'After ITC; residential 5% w/o ITC'},
{sNo:39,hsnSac:'SAC 9971',description:'Financial & insurance services',category:'BFSI',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Bank charges, insurance premium'},
{sNo:40,hsnSac:'SAC 9983',description:'Professional & consultancy services',category:'Professional',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'CA/CS/CMA/Legal/IT services'},
{sNo:41,hsnSac:'SAC 9973',description:'Renting of immovable property',category:'Real Estate',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Commercial rent; residential exempt'},
{sNo:42,hsnSac:'SAC 9961',description:'Courier & postal services',category:'Logistics',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Standard rate for courier services'},
{sNo:43,hsnSac:'SAC 9982',description:'Legal services',category:'Professional',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Advocate services — RCM applicable'},
{sNo:44,hsnSac:'SAC 9987',description:'Hotel accommodation (>₹7500/day)',category:'Hospitality',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Tariff >₹7500: 18%'},
{sNo:45,hsnSac:'SAC 9987',description:'Hotel accommodation (₹1001-₹7500)',category:'Hospitality',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Tariff ₹1001-₹7500: 18%'},
{sNo:46,hsnSac:'SAC 9987',description:'Hotel accommodation (≤₹1000/day)',category:'Hospitality',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'Tariff ≤₹1000: exempt'},
{sNo:47,hsnSac:'SAC 9985',description:'Telecom services',category:'Telecom',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Mobile, internet, broadband'},
{sNo:48,hsnSac:'SAC 9988',description:'IT & software services',category:'IT',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Software development, SaaS, BPO'},
{sNo:49,hsnSac:'SAC 9972',description:'Accounting & audit services',category:'Professional',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'CA firm fee, audit services'},
{sNo:50,hsnSac:'SAC 9985',description:'E-commerce operator services',category:'IT',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'TCS applicable u/s 52'},
{sNo:51,hsnSac:'8703',description:'Motor cars (≤1200cc/1500cc Diesel)',category:'Auto',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'Yes — 1% to 3%',remarks:'Cess varies by length & fuel'},
{sNo:52,hsnSac:'8703',description:'Motor cars (>1500cc / SUV)',category:'Auto',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'Yes — 20% to 22%',remarks:'Luxury cars attract heavy cess'},
{sNo:53,hsnSac:'2402',description:'Cigarettes & tobacco products',category:'Tobacco',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'Yes — up to 290%',remarks:'Compensation Cess applicable'},
{sNo:54,hsnSac:'2202',description:'Aerated / carbonated drinks',category:'Beverages',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'Yes — 12%',remarks:'Moved from 28% + 12% cess'},
{sNo:55,hsnSac:'7113',description:'Precious metal jewellery (Gold)',category:'Jewellery',gstRate:3,igst:3,cgst:1.5,sgst:1.5,cessApplicable:'No',remarks:'Gold: 3% GST on making charges'},
{sNo:56,hsnSac:'7102',description:'Rough diamonds',category:'Gems',gstRate:0.25,igst:0.25,cgst:0.125,sgst:0.125,cessApplicable:'No',remarks:'Special rate for rough diamonds'},
{sNo:57,hsnSac:'SAC 9963',description:'Restaurant services (non-AC)',category:'Food Services',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'5% without ITC'},
{sNo:58,hsnSac:'SAC 9963',description:'Restaurant services (AC / licensed)',category:'Food Services',gstRate:5,igst:5,cgst:2.5,sgst:2.5,cessApplicable:'No',remarks:'5% without ITC (revised from 18%)'},
{sNo:59,hsnSac:'SAC 9963',description:'Restaurant in hotel (tariff >₹7500)',category:'Food Services',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'18% with ITC for premium hotels'},
{sNo:60,hsnSac:'SAC 9996',description:'Government services (fee/licence)',category:'Government',gstRate:18,igst:18,cgst:9,sgst:9,cessApplicable:'No',remarks:'Paid to govt for licence/permission'},
];
