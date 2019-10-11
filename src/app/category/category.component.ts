import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category';
import { Chart } from 'chart.js';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  categories: any;
  chart = [];
  value = [];
  labales = [];

  constructor(private serive: CategoryService) {
    this.loadData();
  }

  ngOnInit() {
  }

  private loadData() {
    /*this.serive.getCategories().subscribe((data) => {
      this.categories = data;
      this.setValues(this.categories);
      this.drawChart();
    });*/
    
    this.serive.getCategories().subscribe((isSave) => {
      if (isSave) {
        this.serive.loadCategories().subscribe((data) => {
          this.categories = data;
          this.setValues(this.categories);
          this.drawChart();
        });
      }
    });
  }

  private setValues(data: Category[]) {
    data.forEach(item => {
      this.labales.push(item.name);
      this.value.push(item.value);
    });
  }

  private drawChart() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labales,
        datasets: [
          {
            data: this.value,
            borderColor: '#3cb371',
            backgroundColor:'rgba(0, 0, 0, 0.1)'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
