import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface TimePeriods {
  viewValue: string,
  value: string,
}

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  //Adding incase we need switch to diff view or use route
  // unsubscribe observable on view destory
  private destroy$ = new Subject();
  quotes$ = this.priceQuery.priceQueries$;

  timePeriods: TimePeriods[] = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) { }

  ngOnInit() {
    //On Form control Value change.
    this.stockPickerForm = this.fb.group({
      symbol: ['', Validators.required],
      period: ['', Validators.required]
    });

    this.stockPickerForm.valueChanges.pipe(debounceTime(1000)
      , distinctUntilChanged()
      , takeUntil(this.destroy$))
      .subscribe(newValue => this.fetchQuote(newValue));
  }

  fetchQuote({ symbol, period }) {
    if (this.stockPickerForm.valid) {
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
