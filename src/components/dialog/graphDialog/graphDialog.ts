import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

declare const Chart;

@Component({
  selector: 'app-graph-dialog',
  templateUrl: './graphDialog.html',
  styleUrls: ['./graphDialog.css'],
})
export class GraphDialogComponent implements OnInit {

  name: string;
  argData;
  chart;

  constructor(
    public dialogRef: MatDialogRef < GraphDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.name = this.data.name;
    this.argData = this.data.graphData;
  }

  ngOnInit() {
    console.log(this.argData);
    this.makeChart();
  }

  makeChart = () => {
    // 整形
    const chartData = {
      labels: [this.name],
      datasets: []
    };
    Object.keys(this.argData).forEach((key) => {
      chartData.datasets.push({
        label: key,
        data: [this.argData[key]]
      });
    });
    console.log(chartData);

    const chartArea = document.getElementById('chartArea');
    this.chart = new Chart(chartArea, {
      type: 'bar',
      data: chartData
    });

  }

  onOK = (): void => {
    this.dialogRef.close();
  }

}
