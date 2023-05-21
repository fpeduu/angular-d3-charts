import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Data } from 'src/types/data';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnInit {
  private data: Data[] = [
    { Framework: 'Vue', Stars: '166443', Released: '2014' },
    { Framework: 'React', Stars: '150793', Released: '2013' },
    { Framework: 'Angular', Stars: '62342', Released: '2016' },
    { Framework: 'Backbone', Stars: '27647', Released: '2010' },
    { Framework: 'Ember', Stars: '21471', Released: '2011' },
  ];

  private svg: any;
  private g: any;
  private margin = 50;
  private width = 750;
  private height = 400;

  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d.Framework.toString()))
      .range(d3.schemeOranges[this.data.length]);
  }

  private drawChart(data: Data[]): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

    this.g
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    const labelLocation = d3.arc().innerRadius(60).outerRadius(this.radius);
    this.g
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => d.data.Framework)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.drawChart(this.data);
  }
}
