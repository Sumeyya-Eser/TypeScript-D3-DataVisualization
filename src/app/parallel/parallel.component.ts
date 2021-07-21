import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

// Adopted from Basic pie chart example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/pie_basic.html
@Component({
    selector: 'app-parallel',
    templateUrl: './parallel.component.html',
    styleUrls: ['./parallel.component.scss']
})
export class ParallelComponent implements OnInit {
    private data = [
        { "Framework": "Vue", "Stars": "166443", "Released": "2014" },
        { "Framework": "React", "Stars": "150793", "Released": "2013" },
        { "Framework": "Angular", "Stars": "62342", "Released": "2016" },
        { "Framework": "Backbone", "Stars": "27647", "Released": "2010" },
        { "Framework": "Ember", "Stars": "21471", "Released": "2011" },
    ];
    private svg;
    private margin = 50;
    private width = 750;
    private height = 600;
    // The radius of the pie chart is half the smallest side
    private radius = Math.min(this.width, this.height) / 2 - this.margin;
    private colors;

    ngOnInit(): void {
        this.createSvg();
        this.createColors();
        this.drawChart();
    }

    private createSvg(): void {
        this.svg = d3.select("figure#parallel")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr(
                "transform",
                "translate(" + this.width / 2 + "," + this.height / 2 + ")"
            );
    }

    private createColors(): void {
        this.colors = d3.scaleOrdinal()
            .domain(this.data.map(d => d.Stars.toString()))
            .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
    }

    private drawChart(): void {
        var margin = { top: 30, right: 50, bottom: 10, left: 50 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#parallel")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var color = d3.scaleOrdinal()
            .domain(["Vue", "React", "Angular"])
            .range(["#440154ff", "#21908dff", "#fde725ff"])

        var dimensions = ["Released", "Framework", "Stars"]

        var y = {}
        for (let i in dimensions) {
            let name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain([0, 8]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([height, 0])
        }

        let x = d3.scalePoint()
            .range([0, width])
            .domain(dimensions);


        var highlight = function (d) {

            let selected_specie = d.data

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + selected_specie)
                .transition().duration(200)
                .style("opacity", "1")
        }


        function path(d) {
            return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
        }

        svg
            .selectAll("myPath")
            .data(this.data)
            .enter()
            .append("path")
            .attr("class", function (d) { return "line " }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("opacity", 0.5)
            .on("mouseover", highlight)


        svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            .attr("class", "axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
            // And I build the axis with the call function
            .each(function (d) { d3.select(this); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) { return d; })
            .style("fill", "black")


    

    }

}
