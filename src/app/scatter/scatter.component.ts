import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Data } from 'src/types/data';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss'],
})
export class ScatterComponent implements OnInit {
  private data: Data[] = [
    { Framework: 'Vue', Stars: '166443', Released: '2014' },
    { Framework: 'React', Stars: '150793', Released: '2013' },
    { Framework: 'Angular', Stars: '62342', Released: '2016' },
    { Framework: 'Backbone', Stars: '27647', Released: '2010' },
    { Framework: 'Ember', Stars: '21471', Released: '2011' },
  ];

  private svg: any;
  private g: any;
  private margin = { top: 20, right: 10, bottom: 80, left: 100 };
  private basewidth = 750;
  private baseheight = 400;
  private width = this.basewidth - this.margin.left - this.margin.right;
  private height = this.baseheight - this.margin.bottom - this.margin.top;

  private createSvg(): void {
    this.svg = d3
      .select('figure#scatter')
      .append('svg')
      .attr('width', this.basewidth)
      .attr('height', this.baseheight);

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private drawBars(data: Data[]): void {
    const x = d3.scaleLinear().range([0, this.width]).domain([2008, 2023]);

    this.g
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    const max = d3.max(data, (d) => Number(d.Stars)) || 200000;
    const y = d3.scaleLinear().range([this.height, 0]).domain([0, max]);

    this.g.append('g').call(d3.axisLeft(y));

    const chart = this.g.selectAll('circles').data(data);

    chart
      .enter()
      .append('circle')
      .attr('cx', (d: Data) => x(Number(d.Released)))
      .attr('cy', (d: Data) => y(Number(d.Stars)))
      .attr('r', 8)
      .attr('fill', '#d04a35');

    chart
      .enter()
      .append('text')
      .attr('x', (d: Data) => x(Number(d.Released)))
      .attr('y', (d: Data) => y(Number(d.Stars)))
      .text((d: Data) => d.Framework);

    this.svg
      .append('text')
      .attr('x', -(this.height / 2) - this.margin.top)
      .attr('y', this.margin.left / 2.4)
      .attr('transform', 'rotate(-90)')
      .text('Stars')
      .style('font-size', 16)
      .style('font-weight', 'bold');

    this.svg
      .append('text')
      .attr('x', this.width / 2 + this.margin.left)
      .attr('y', this.height + this.margin.top + 60)
      .text('Year of release')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .attr('text-anchor', 'middle');
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }
}
