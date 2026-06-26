// Cost Inflation Index (CII) — FY 2001-02 to 2025-26
// Base Year 2001-02 = 100 (as per CBDT notification)

export interface CiiEntry {
    sNo: number;
    financialYear: string;
    assessmentYear: string;
    ciiValue: number;
    yoyChange: string;
    notification: string;
}

export const costInflationIndexData: CiiEntry[] = [
{sNo:1,financialYear:'2001-02',assessmentYear:'2002-03',ciiValue:100,yoyChange:'Base Year',notification:'Base Year (S.O. 1790(E) dt 05-06-2017)'},
{sNo:2,financialYear:'2002-03',assessmentYear:'2003-04',ciiValue:105,yoyChange:'+5.00%',notification:'CBDT Notification'},
{sNo:3,financialYear:'2003-04',assessmentYear:'2004-05',ciiValue:109,yoyChange:'+3.81%',notification:'CBDT Notification'},
{sNo:4,financialYear:'2004-05',assessmentYear:'2005-06',ciiValue:113,yoyChange:'+3.67%',notification:'CBDT Notification'},
{sNo:5,financialYear:'2005-06',assessmentYear:'2006-07',ciiValue:117,yoyChange:'+3.54%',notification:'CBDT Notification'},
{sNo:6,financialYear:'2006-07',assessmentYear:'2007-08',ciiValue:122,yoyChange:'+4.27%',notification:'CBDT Notification'},
{sNo:7,financialYear:'2007-08',assessmentYear:'2008-09',ciiValue:129,yoyChange:'+5.74%',notification:'CBDT Notification'},
{sNo:8,financialYear:'2008-09',assessmentYear:'2009-10',ciiValue:137,yoyChange:'+6.20%',notification:'CBDT Notification'},
{sNo:9,financialYear:'2009-10',assessmentYear:'2010-11',ciiValue:148,yoyChange:'+8.03%',notification:'CBDT Notification'},
{sNo:10,financialYear:'2010-11',assessmentYear:'2011-12',ciiValue:167,yoyChange:'+12.84%',notification:'CBDT Notification'},
{sNo:11,financialYear:'2011-12',assessmentYear:'2012-13',ciiValue:184,yoyChange:'+10.18%',notification:'CBDT Notification'},
{sNo:12,financialYear:'2012-13',assessmentYear:'2013-14',ciiValue:200,yoyChange:'+8.70%',notification:'CBDT Notification'},
{sNo:13,financialYear:'2013-14',assessmentYear:'2014-15',ciiValue:220,yoyChange:'+10.00%',notification:'CBDT Notification'},
{sNo:14,financialYear:'2014-15',assessmentYear:'2015-16',ciiValue:240,yoyChange:'+9.09%',notification:'CBDT Notification'},
{sNo:15,financialYear:'2015-16',assessmentYear:'2016-17',ciiValue:254,yoyChange:'+5.83%',notification:'CBDT Notification'},
{sNo:16,financialYear:'2016-17',assessmentYear:'2017-18',ciiValue:264,yoyChange:'+3.94%',notification:'CBDT Notification'},
{sNo:17,financialYear:'2017-18',assessmentYear:'2018-19',ciiValue:272,yoyChange:'+3.03%',notification:'CBDT Notification'},
{sNo:18,financialYear:'2018-19',assessmentYear:'2019-20',ciiValue:280,yoyChange:'+2.94%',notification:'CBDT Notification'},
{sNo:19,financialYear:'2019-20',assessmentYear:'2020-21',ciiValue:289,yoyChange:'+3.21%',notification:'CBDT Notification'},
{sNo:20,financialYear:'2020-21',assessmentYear:'2021-22',ciiValue:301,yoyChange:'+4.15%',notification:'CBDT Notif. 73/2021'},
{sNo:21,financialYear:'2021-22',assessmentYear:'2022-23',ciiValue:317,yoyChange:'+5.32%',notification:'CBDT Notif. 62/2022'},
{sNo:22,financialYear:'2022-23',assessmentYear:'2023-24',ciiValue:331,yoyChange:'+4.42%',notification:'CBDT Notif. 21/2023'},
{sNo:23,financialYear:'2023-24',assessmentYear:'2024-25',ciiValue:348,yoyChange:'+5.14%',notification:'CBDT Notif. 44/2024'},
{sNo:24,financialYear:'2024-25',assessmentYear:'2025-26',ciiValue:363,yoyChange:'+4.31%',notification:'CBDT Notif. 58/2024'},
{sNo:25,financialYear:'2025-26',assessmentYear:'2026-27',ciiValue:376,yoyChange:'+3.58%',notification:'CBDT Notif. 70/2025'},
];
