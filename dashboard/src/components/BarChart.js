import { useRef, useEffect } from "react"
import * as d3 from 'd3'

export default function BarChart({data, width, height, title}){
    data.sort((a,b)=>a.value-b.value)
    const svgRef = useRef()
    useEffect(()=>{
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
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg.attr('height', height)
            .attr('width', width)
            .style('outline', '1px solid purple')

        const margin = {top: 30, left: 390, bottom: 30, right: 30}
        const innerHeight =  height - margin.top - margin.bottom
        const innerWidth = width - margin.right - margin.left

        const xScale = d3.scaleLinear()
                            .domain(d3.extent(data, d=>d.value))
                            .range([0, innerWidth])
        const yScale = d3.scaleBand()
                            .domain(data.map(d=>d.label))
                            .range([innerHeight, 0])
        const xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickFormat(tickFormating)
        const yAxis = d3.axisLeft()
                        .scale(yScale)
        const drawingCanvas = svg.append('g')
                                .attr('transform', `translate(${margin.left}, ${margin.top})`)
        drawingCanvas.append('g').call(xAxis).attr('transform', `translate(0, ${innerHeight})`)
        drawingCanvas.append('g').call(yAxis)

        svg.append('text').text(title).attr('transform', `translate(${width/2}, ${margin.top/2})`)
        
        drawingCanvas.selectAll('rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('width', d=>xScale(d.value))
                        .attr('height', 20)
                        .attr('x', 2)
                        .attr('y', d=>yScale(d.label))
                        .style('fill', '#FF36AB')
                        .style('stroke', 'purple')

    },[data,  width, height, title])
    return (
        <div>
               <svg ref={svgRef}></svg>
        </div>
     
    )
}