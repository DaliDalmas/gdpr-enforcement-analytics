import * as d3 from 'd3'
import { useRef, useEffect } from 'react'
export default function TimeSeries({data, width, height, title, yAxisLabel}){
    const svgRef = useRef()
    useEffect(()=>{
        if (!data||data.length===0) return;
        
        const margin = {top: 40, right: 30, bottom: 50, left:60}
        const innerHeight = height - margin.top - margin.bottom
        const innerWidth = width - margin.left - margin.right
        const padding = 15

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg.attr("width", width)
            .attr("height", height)
            .style("outline", "1px solid purple")
        
        const drawingCanvas = svg.append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        const yScale = d3.scaleLinear()
                            .domain(d3.extent(data, d=>d.value))
                            .range([innerHeight, 0])
                            .nice()
        const xScale = d3.scaleUtc()
                            .domain(d3.extent(data, d=>new Date(d.date)))
                            .range([0, innerWidth])
                            .nice()
        const xAxis = d3.axisBottom()
                        .scale(xScale)
        
        const tickFormating = val => {
            const billion  = 1000000000
            const million  = 1000000
            const thousand = 1000
            if (val/billion>=1){
                return val/billion + "B";
            }else if (val/million>=1){
                return val/million + "M";
            }else if(val/thousand>=1){
                return val/thousand + "K"
            } else {
                return val
            }
        }
        const yAxis = d3.axisLeft()
                        .scale(yScale)
                        .tickFormat(tickFormating)

        drawingCanvas.append("g")
                        .call(yAxis)

        
        drawingCanvas.append("g")
                        .attr("transform", `translate(0, ${innerHeight})`)
                        .call(xAxis)

        const lineGenerator = d3.line()
                                .x(d=>xScale(new Date(d.date)))
                                .y(d=>yScale(d.value))
        drawingCanvas.append("path")
                        .attr("d", lineGenerator(data))
                        .attr("fill", "none")
                        .attr("stroke", "purple")
                        .attr("stroke-width", 2)
        
        svg.append("text")
            .text(title)
            .attr("transform", `translate(${innerWidth/2}, ${margin.top-padding})`)
        svg.append("text")
            .text("date")
            .attr("transform", `translate(${innerWidth/2}, ${height-padding})`)
        const yLabel = svg.append("g")
                        .attr("transform", `translate(${padding}, ${height/2})`)
            yLabel.append("text")
                    .text(yAxisLabel)
                    .attr("transform", `rotate(-90)`)

    },[data, height, width, title, yAxisLabel])
    return (
            <svg ref={svgRef}></svg>
    )
}