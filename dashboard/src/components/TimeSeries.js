import * as d3 from 'd3'
import { useRef, useEffect } from 'react'
export default function TimeSeries({data, width, height, title}){
    const svgRef = useRef()
    useEffect(()=>{
        if (!data||data.length===0) return;
        
        const margin = {top: 40, right: 30, bottom: 30, left:80}
        const innerHeight = height - margin.top - margin.bottom
        const innerWidth = width - margin.left - margin.right

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg.attr("width", width)
            .attr("height", height)
            .style("outline", "1px solid pink")
        
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
                        
        const yAxis = d3.axisLeft()
                        .scale(yScale)

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
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
        
        svg.append("text")
            .text(title)
            .attr("transform", `translate(${innerWidth/2}, ${margin.top-5})`)
        
    },[data, height, width, title  ])
    return (
            <svg ref={svgRef}></svg>
    )
}