import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  maxDate: Date = new Date();

  private destroy$ = new Subject();
  quotes$ = this.priceQuery.priceQueries$;


  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) { }

  ngOnInit() {
    this.stockPickerForm = this.fb.group({
      symbol: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
    //The date-pickers should not allow selection of dates after the current day.
    this.stockPickerForm.valueChanges.pipe(debounceTime(1000)
      , distinctUntilChanged()
      , takeUntil(this.destroy$))
      .subscribe(formValue => {
        const { fromDate, toDate } = formValue;
        if (this.stockPickerForm.get('toDate').valid && toDate < fromDate) {
          this.stockPickerForm.get('fromDate').setValue(toDate);
        }
      })
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      const period = 'max'; // calling maximum data of the stock
      this.priceQuery.fetchQuote(symbol, period, fromDate, toDate);
    }
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
