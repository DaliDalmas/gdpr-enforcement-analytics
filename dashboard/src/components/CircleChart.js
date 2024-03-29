import * as d3 from 'd3'
import { useRef, useEffect } from "react"
export default function CircleChart({data, width, height}){
    data.sort((a,b)=>a.value-b.value)
    const svgRef = useRef()
    useEffect(()=>{
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg.attr('width', width)
            .attr('height', height)
            .style('outline', '1px solid purple')

        const margin = {top: 20, right: 40, bottom: 30, left: 40}
        const innerHeight = height - margin.top - margin.bottom
        const innerWidth = width - margin.left - margin.right

        const radiusScale = d3.scaleLinear().domain(d3.extent(data, d=>d.value)).range([4, 20])
        const drawingCanvas = svg.append('g')
                                .attr('transform', `translate(${margin.left}, ${margin.top})`)
        drawingCanvas.selectAll('g.country')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'country')
                .attr('transform', (d,i)=>`translate(${i*(innerWidth/data.length)}, ${innerHeight/2})`)
                .each(function(datum,index){
                    d3.select(this)
                        .append('circle')
                        .attr('r', radiusScale(datum.value))
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .style('fill', '#FF36AB')
                        .style('stroke', 'purple')
                    d3.select(this)
                        .append('text')
                        .text(datum.label)
                        .attr('transform','translate(0,30)rotate(90)')
                })

        svg.append('text')
                .text("sum of GDPR fines by county")
                .attr('transform', `translate(${width/2},${margin.top})`)

    },[data, width, height])

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    )
}