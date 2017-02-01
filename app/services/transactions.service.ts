import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionsService {

    constructor(private http: Http) {   }



    //Get all transactions from API
    getAllTransactions() {
        let args = {"args": {"uid": 1110590645, "token": "90277FB8DD244F8B05F697293AE0413E", "api-token": "AppTokenForInterview", "json-strict-mode": false, "json-verbose-response": false}};
        let url = 'https://2016.api.levelmoney.com/api/v2/core/get-all-transactions';

        return this.http.post(url, JSON.stringify(args))
            .map(res => res.json())
            .catch(this.handleError);
    }

    //Get Projected Transactions for given month
    getProjectedTransactionsForMonth(year: number, month: number) {
        let args = {"args": {"uid": 1110590645, "token": "90277FB8DD244F8B05F697293AE0413E", "api-token": "AppTokenForInterview", "json-strict-mode": false, "json-verbose-response": false}, "year": year, "month": month};
        let url = 'https://2016.api.levelmoney.com/api/v2/core/projected-transactions-for-month';

        return this.http.post(url, JSON.stringify(args))
            .map(res => res.json())
            .catch(this.handleError);
    }


    private handleError(error: any) {
        return Observable.throw(error.json());
    }



}