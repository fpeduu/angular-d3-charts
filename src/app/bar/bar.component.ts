import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Data } from 'src/types/data';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {
  private data: Data[] = [
    { Framework: 'Vue', Stars: '166443', Released: '2014' },
    { Framework: 'React', Stars: '150793', Released: '2013' },
    { Framework: 'Angular', Stars: '62342', Released: '2016' },
    { Framework: 'Backbone', Stars: '27647', Released: '2010' },
    { Framework: 'Ember', Stars: '21471', Released: '2011' },
  ];

  private svg: any;
  private g: any;
  private margin = { top: 10, right: 10, bottom: 80, left: 100 };
  private basewidth = 750;
  private baseheight = 400;
  private width = this.basewidth - this.margin.left - this.margin.right;
  private height = this.baseheight - this.margin.bottom - this.margin.top;

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
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
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.Framework))
      .padding(0.2);

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

    const chart = this.g.selectAll('bars').data(data);

    chart
      .enter()
      .append('rect')
      .attr('x', (d: Data) => x(d.Framework))
      .attr('y', (d: Data) => y(Number(d.Stars)))
      .attr('width', x.bandwidth())
      .attr('height', (d: Data) => this.height - y(Number(d.Stars)))
      .attr('fill', '#d04a35');

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
      .text('Frameworks')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .attr('text-anchor', 'middle');
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }
}
