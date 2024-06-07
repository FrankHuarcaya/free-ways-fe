import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {ChartType} from "./dashboard.model";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTitleSubtitle,
  ChartComponent
} from "ng-apexcharts";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartType> = {}; // Inicializar chartOptions

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.dashboardService.getTrafficFlowReport().subscribe(data => {
      this.setupChart(data);
      console.log(data);
    });

  }

  setupChart(data: any) {
    const transformedData = this.transformData(data);

    this.chartOptions = {
      series: transformedData,
      chart: {
        height: 350,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                color: '#00FF00', // Verde para 'Leve'
                name: 'Leve'
              },
              {
                from: 1,
                to: 1,
                color: '#FFFF00', // Amarillo para 'Moderado'
                name: 'Moderado'
              },
              {
                from: 2,
                to: 2,
                color: '#FF0000', // Rojo para 'Saturado'
                name: 'Saturado'
              }
            ]
          }
        }
      },
      title: {
        text: "HeatMap Chart (Traffic Data)"
      }
    };
  }

  transformData(data: any): ApexAxisChartSeries {
    let series: ApexAxisChartSeries = [];
    const days = Object.keys(data);

    const valueMapping = {
      'Leve': 0,
      'Moderado': 1,
      'Saturado': 2
    };

    days.forEach(day => {
      let seriesData = [];
      const hours = Object.keys(data[day]);

      hours.forEach(hour => {
        seriesData.push({
          x: hour,
          y: valueMapping[data[day][hour]]
        });
      });
      series.push({
        name: day,
        data: seriesData
      });
    });

    return series;
  }
}
