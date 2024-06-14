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
import {AverageVehicleDay} from "../models/average-vehicle-day.model";
import {first} from "rxjs/operators";
import {Intersection} from "../../operation/intersection/models/intersection.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartType> = {}; // Inicializar chartOptions

    lineAverageVehicleDay: ChartType = {};
    averageVehicleDay: AverageVehicleDay[] = [];

    intersections: Intersection[] = [];
    selectedIntersection: string = 'INTERSECTION JAVIER PRADO - IQUITOS'; // Valor por defecto


    constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
        this.getIntersections();
        this.getAverageVehicleDay();
  }

    getIntersections() {
        this.dashboardService.listIntersection()
            .pipe(first())
            .subscribe(
                (response: Intersection[]) => {
                    if (response) {
                        this.intersections = response;
                        this.selectedIntersection = this.intersections[0]?.name || this.selectedIntersection;
                        this.loadTrafficFlowReport(this.selectedIntersection);
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Lista',
                            text: 'Se pudieron obtener las intersecciones.',
                        });
                    }
                },
                error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron obtener las intersecciones.',
                    });
                }
            );
    }

    getAverageVehicleDay() {
        this.dashboardService.getAverageVehicleDay().subscribe(
            (response) => {
                this.averageVehicleDay = response.average_vehicle_per_day;
                this.setupLineChart(this.averageVehicleDay);
            },
            (error) => {
                console.error('Error fetching data', error);
            }
        );
    }


    setupLineChart(averageVehicleDays: AverageVehicleDay[]) {
        this.lineAverageVehicleDay = {
            chart: {
                height: 450,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#556ee6', '#34c38f', '#74788d', '#f1b44c', '#f46a6a', '#50a5f1'],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(2); // Formatea a 2 decimales
                }
            },
            stroke: {
                width: [4, 4],
                curve: 'straight'
            },
            series: [{
                name: 'Cantidad - Vehiculos',
                data: averageVehicleDays.map(item => item.average)
            }],
            title: {
                text: 'Cantidad de vehículos por día',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                },
                borderColor: '#f1f1f1'
            },
            markers: {
                style: 'inverted',
                size: 6
            },
            xaxis: {
                categories: averageVehicleDays.map(item => item.day),
                title: {
                    text: 'Días'
                }
            },
            yaxis: {
                title: {
                    text: 'Cantidad'
                },
                labels: {
                    formatter: function (val) {
                        return val.toFixed(2); // Formatea a 2 decimales
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,
                itemMargin: {
                    horizontal: 20
                }
            },
            tooltip: {
                shared: true,
                y: {
                    formatter: function (val) {
                        return val.toFixed(2); // Formatea a 2 decimales
                    }
                }
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    legend: {
                        show: false
                    }
                }
            }]
        };
    }

    onIntersectionChange() {
        this.loadTrafficFlowReport(this.selectedIntersection);
    }

    loadTrafficFlowReport(intersectionName: string) {
        this.dashboardService.getTrafficFlowReport(intersectionName)
            .pipe(first())
            .subscribe(
                data => {
                    this.setupChart(data);
                    console.log(data)
                },
                error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron obtener los datos del tráfico.',
                    });
                }
            );
    }



  setupChart(data: any) {
    const transformedData = this.transformData(data);
    const hours = this.getAllHours(data);

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
      xaxis: {
        categories: hours,
        tickPlacement: 'on'
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

  getAllHours(data: any): string[] {
    const firstDay = Object.keys(data)[0];
    return Object.keys(data[firstDay]);
  }
}
