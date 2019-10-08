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
    this.setData();
  }

  ngOnInit() {
  }

  setData() {
    this.serive.getCategories().subscribe((data) => {
      this.categories = data;
      this.bindData(this.categories);
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.labales,
          datasets: [
            {
              data: this.value,
              borderColor: '#3cb371',
              backgroundColor: "#0000FF",
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
    });
  }

  bindData(data: Category[]) {
    data.forEach(item => {
      this.labales.push(item.name);
      this.value.push(item.value);
    });
  }
}
