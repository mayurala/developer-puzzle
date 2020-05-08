import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';



@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  maxDate: Date = new Date();

  quotes$ = this.priceQuery.priceQueries$;


  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) { }

  ngOnInit() {
    this.stockPickerForm = this.fb.group({
      symbol: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
    //The date-pickers should not allow selection of dates after the current day.
    this.stockPickerForm.valueChanges.subscribe(formValue => {
      const { fromDate, toDate } = formValue;
      if (toDate < fromDate) {
        this.stockPickerForm.get('fromDate').setValue(toDate);
      }
    })
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      const timeDiff = Math.abs(fromDate - toDate);
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const period = this.findPeriodByDays(diffDays); //find period based on custom dates;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

  findPeriodByDays(days: number) {
    if (days <= 30) {
      return '1m';
    } else if (days > 30 && days <= 91) {
      return '3m';
    }
    else if (days > 91 && days <= 182) {
      return '6m';
    }
    else if (days > 182 && days <= 365) {
      return '1y';
    } else if (days > 365 && days <= 730) {
      return '2y';
    } else if (days > 1095 && days <= 1095) {
      return '3y';
    }
    else {
      return 'max';
    }
  }
}
