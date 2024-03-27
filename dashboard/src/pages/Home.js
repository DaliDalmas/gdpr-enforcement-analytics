import TimeSeries from "../components/TimeSeries"
export default function Home({data}){
    let timeSeriesData = {}
    let cummulativeFine = 0
    data.reduce((accumulator, currentValue)=>{
        const currentDate = currentValue['date']
        const currentFine = currentValue['fine']
        cummulativeFine = cummulativeFine + currentFine
        if (!accumulator[currentDate]){
            accumulator[currentDate] = currentFine
        }else{
            accumulator[currentDate] = accumulator[currentDate] + currentFine
        }
        return accumulator
    }, timeSeriesData)
    var timeSeriesdata2 = Object.keys(timeSeriesData).map(key=>{
        return {date: key, value: timeSeriesData[key]}
    })
    timeSeriesdata2 = timeSeriesdata2.sort((a,b)=> new Date(a.date) - new Date(b.date))
    return (
        <div>
            <TimeSeries
                data = {timeSeriesdata2}
                width = {1000}
                height = {500}
                title = "GDPR FINES PER DAY"
                yAxisLabel = "sum of fines in a day (£)"
                />
        </div>
    )
}