import { Component, OnInit } from '@angular/core';

import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  providers: [TransactionsService],
})
export class AppComponent implements OnInit {
  name = 'Angular';
  //from API calls
  allTrans: any;
  currentTrans: any;
  error: any;

  //Global variables to display on page
  allSorted = {}; //grouped by month only
  defaultSorted = {}; //with averages
  donutSorted = {}; //excluding donuts with averages
  crystalSorted = {}; //with crystal ball and averages
  ccSorted = {}; //exluding cc payments with averages
  ccTransactions: any = []; //compiled list of ignored credit card transactions
  displayWhat: string = "defaultSorted";

  constructor(
    private transactionsService: TransactionsService,
  ) { }

  ngOnInit() {
    //get all transactions
    this.transactionsService.getAllTransactions()
      .subscribe(
      allTrans => {
        this.allTrans = allTrans;
        this.allSorted = this.sortData(this.allTrans.transactions, false, false);
        this.defaultSorted = JSON.parse(JSON.stringify(this.allSorted));
        this.appendAverage(this.defaultSorted);
      },
      error => { this.error = error; }
      );
  }


  //on init, get all transactions
  getAllTransactions() {
    this.transactionsService.getAllTransactions()
      .subscribe(
      allTrans => {
        this.allTrans = allTrans;
        this.allSorted = this.sortData(this.allTrans.transactions, false, false);
        this.defaultSorted = JSON.parse(JSON.stringify(this.allSorted));
        this.appendAverage(this.defaultSorted);
      },
      error => { this.error = error; }
      );
  }

  //get crystal ball transactions
  getProjectedTransactionsForMonth() {
    //determine current year/month
    this.displayWhat = "crystalBall";
    let currentTime = new Date();
    var year = currentTime.getFullYear()
    let month = currentTime.getMonth() + 1;
    this.transactionsService.getProjectedTransactionsForMonth(year, month)
      .subscribe(
      currentTrans => {
        this.currentTrans = currentTrans;
        this.mergeCrystalBall(this.currentTrans.transactions, year.toString(), month.toString());
      },
      error => { this.error = error; }
      );

  }

  //group data by YYYY-MM
  sortData(transactions: any, ingoreDonuts: boolean, ignoreCC: boolean): any {
    let sorted = {};

    //group data by YYYY-MM and calculate spent/income
    for (let trans of transactions) {

      if (ingoreDonuts) {
        if (trans.merchant === "Krispy Kreme Donuts" || trans.merchant === "Dunkin #336784") {
          continue;
        }
      }

      if (ignoreCC) {
        if (trans.merchant === "CC Payment" || trans.merchant === "Credit Card Payment") {
          this.ccTransactions.push(trans);
          continue;
        }
      }


      let key = trans['transaction-time'].substring(0, 7);

      //if not exist create
      if (!sorted[key]) {
        sorted[key] = {};
        sorted[key].income = 0;
        sorted[key].spent = 0;
      }

      if (trans.amount > 0) {
        sorted[key].income += Math.abs(trans.amount);
      } else {
        sorted[key].spent += Math.abs(trans.amount);
      }
    }

    return sorted;
  }

  excludeDonuts() {
    this.displayWhat = "excludeDontus";
    this.donutSorted = this.sortData(this.allTrans.transactions, true, false);
    this.appendAverage(this.donutSorted);
  }

  excludeCC() {
    this.displayWhat = "excludeCC";
    this.ccSorted = this.sortData(this.allTrans.transactions, false, true);
    this.appendAverage(this.ccSorted);
  }

  defaultData() {
    this.displayWhat = "defaultSorted";
  }

  //merge in predicted spending for this month
  mergeCrystalBall(transactions: any, year: string, month: string) {
    this.crystalSorted = JSON.parse(JSON.stringify(this.allSorted));
    let appendData = this.sortData(transactions, false, false);

    for (var key in appendData) {
      var appendValue = appendData[key];
      var sortedValue = this.crystalSorted[key];

      let combinedSpent = Math.abs(appendValue.spent) + Math.abs(sortedValue.spent);
      let combinedIncome = Math.abs(appendValue.income) + Math.abs(sortedValue.income);

      this.crystalSorted[key].spent = Math.abs(combinedSpent);
      this.crystalSorted[key].income = Math.abs(combinedIncome);
    }
    this.appendAverage(this.crystalSorted);

  }

  //converts transaction values to $USD and appends average 
  appendAverage(sortedArray: any) {
    //calculate average
    let monthCnt = 0;
    let avgSpent = 0;
    let avgIncome = 0;
    for (var key in sortedArray) {
      var value = sortedArray[key];

      //averages running total
      monthCnt += 1;
      avgSpent += Math.abs(value.spent);
      avgIncome += Math.abs(value.income);

      //resave with $ formatting
      let tmpSpent = "$" + (value.spent / 10000).toFixed(2);
      let tmpIncome = "$" + (value.income / 10000).toFixed(2);
      sortedArray[key] = { "spent": tmpSpent, "income": tmpIncome };

    }

    let outSpent = "$" + (avgSpent / monthCnt / 10000).toFixed(2);
    let outIncome = "$" + (avgIncome / monthCnt / 10000).toFixed(2);

    sortedArray["average"] = { "spent": outSpent, "income": outIncome };

  }
}
