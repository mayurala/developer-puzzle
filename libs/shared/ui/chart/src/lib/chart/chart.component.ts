import {

  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

interface Chart {
  title: string;
  type: string;
  data: any;
  columnNames: string[];
  options: OptionTypes;
};

interface OptionTypes {
  title: string, width: string, height: string
}

enum ChartValues {
  CHART_TYPE = 'LineChart',
  PERIOD = 'period',
  CLOSE = 'close',
  OPTION_TITLE = 'Stock price',
  WIDTH = '600',
  HEIGHT = '400'
}
@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  chart: Chart;

  constructor() { }

  ngOnInit() {
    const { CHART_TYPE, PERIOD, CLOSE, OPTION_TITLE, WIDTH, HEIGHT } = ChartValues;
    this.chart = {
      title: '',
      type: CHART_TYPE,
      data: [],
      columnNames: [PERIOD, CLOSE],
      options: { title: OPTION_TITLE, width: WIDTH, height: HEIGHT }
    };

  }
}
