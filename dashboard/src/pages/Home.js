import TimeSeries from "../components/TimeSeries"
import CircleChart from "../components/CircleChart"
export default function Home({ data }) {
    // timeseries
    let timeSeriesData = {}
    let cummulativeFine = 0
    data.reduce((accumulator, currentValue) => {
        const currentDate = currentValue['date']
        const currentFine = currentValue['fine']
        cummulativeFine = cummulativeFine + currentFine
        if (!accumulator[currentDate]) {
            accumulator[currentDate] = currentFine
        } else {
            accumulator[currentDate] = accumulator[currentDate] + currentFine
        }
        return accumulator
    }, timeSeriesData)

    var timeSeriesdata2 = Object.keys(timeSeriesData).map(key => {
        return { date: key, value: timeSeriesData[key] }
    })
    timeSeriesdata2 = timeSeriesdata2.sort((a, b) => new Date(a.date) - new Date(b.date))

    var cummulative = 0
    const timeSeriesdata3 = timeSeriesdata2.map(f => {
        cummulative = cummulative + f['value']
        f['cummulative'] = cummulative
        return f
    })
    const df = timeSeriesdata3.map(f=>{
        return {date:f['date'], value:f['cummulative']}
    })
    // circle chart
    let countryFines = {}
    data.reduce((cumm, curr) => {
        const fine = curr['fine']
        const country = curr['country']
        if (!countryFines[country]){
            cumm[country] = fine
        }else{
            cumm[country] = cumm[country]+fine
        }
        return cumm
    }, countryFines)

    
    return (
        <div>
            <TimeSeries
                data={timeSeriesdata2}
                width={500}
                height={400}
                title="GDPR FINES PER DAY"
                yAxisLabel="sum of fines in a day (£)"
            />
            <br />
            <TimeSeries
                data={df}
                width={500}
                height={400}
                title="CUMULATIVE FINES OVER TIME"
                yAxisLabel="cummulative sum of fines (£)"
            />
            <br />
            < CircleChart 
            data = {
                Object.keys(countryFines).map(key=>{
                    return {label:key, value:countryFines[key]}
                })}
            width = {1000}
            height={400}
            />
            <br />
        </div>
    )
}