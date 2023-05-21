import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Data, GapminderData } from 'src/types/data';

@Component({
  selector: 'app-gapminder',
  templateUrl: './gapminder.component.html',
  styleUrls: ['./gapminder.component.scss'],
})
export class GapminderComponent implements OnInit {
  private svg: any;
  private g: any;
  private margin = { top: 20, right: 10, bottom: 80, left: 100 };
  private basewidth = 750;
  private baseheight = 400;
  private width = this.basewidth - this.margin.left - this.margin.right;
  private height = this.baseheight - this.margin.bottom - this.margin.top;

  private createSvg(): void {
    this.svg = d3
      .select('figure#gapminder')
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

  private drawChart(): void {
    const xAxisGroup = this.g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`);
    const yAxisGroup = this.g.append('g').attr('class', 'y axis');

    const year = this.g
      .append('text')
      .attr('class', 'year')
      .attr('x', this.width)
      .attr('y', this.height - 10)
      .attr('font-size', '40px')
      .attr('text-anchor', 'end')
      .attr('fill', 'grey');

    const x = d3.scaleLog().domain([100, 150000]).range([0, this.width]);
    const y = d3.scaleLinear().domain([0, 90]).range([this.height, 0]);
    const r = d3.scaleLinear().domain([200, 1400000000]).range([5, 25]);
    const color = d3.scaleOrdinal(d3.schemePastel1);

    const update = (data: GapminderData) => {
      const chart = this.g.selectAll('circle').data(data.countries);

      chart.exit().remove();

      chart
        .attr('cx', (d: any) => x(d.income))
        .attr('cy', (d: any) => y(d.life_exp))
        .attr('r', (d: any) => r(d.population))
        .attr('fill', (d: any) => color(d.continent));

      chart
        .enter()
        .append('circle')
        .attr('cx', (d: any) => x(d.income))
        .attr('cy', (d: any) => y(d.life_exp))
        .attr('r', (d: any) => r(d.population))
        .attr('fill', (d: any) => color(d.continent))
        .attr('stroke', 'gray');

      const xAxis = d3
        .axisBottom(x)
        .tickValues([400, 4000, 40000])
        .tickFormat(d3.format('$'));
      xAxisGroup
        .call(xAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', this.width / 2)
        .attr('y', this.margin.bottom - 15)
        .attr('fill', 'black')
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('GDP per capita ($)');

      const yAxis = d3.axisLeft(y);
      yAxisGroup
        .call(yAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', -this.height / 2)
        .attr('y', -this.margin.left + 20)
        .attr('fill', 'black')
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Life expectancy (years)');

      year.text(data.year);
    };

    d3.json('./assets/data.json').then((data) => {
      let gapminderData = data as GapminderData[];

      gapminderData = gapminderData.map((d) => {
        return {
          countries: d.countries.filter(
            (c) => c.income && c.life_exp && c.population
          ),
          year: d.year,
        };
      });

      color.domain(gapminderData[0].countries.map((d) => d.continent));

      let index = 0;
      d3.interval(() => {
        index = index < gapminderData.length - 1 ? index + 1 : 0;
        update(gapminderData[index]);
      }, 100);

      update(gapminderData[index]);
    });
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }
}
