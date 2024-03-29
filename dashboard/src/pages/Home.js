import TimeSeries from "../components/TimeSeries"
import CircleChart from "../components/CircleChart"
import BarChart from "../components/BarChart"
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
    const df = timeSeriesdata3.map(f => {
        return { date: f['date'], value: f['cummulative'] }
    })
    // circle chart
    let countryFines = {}
    data.reduce((cumm, curr) => {
        const fine = curr['fine']
        const country = curr['country']
        if (!countryFines[country]) {
            cumm[country] = fine
        } else {
            cumm[country] = cumm[country] + fine
        }
        return cumm
    }, countryFines)

    // bar chart
    var fineTypes = {}
    data.reduce((cum, cur) => {
        const fine = cur['fine']
        const fineType = cur['fineType']
        if (!fineTypes[fineType]) {
            cum[fineType] = fine
        } else {
            cum[fineType] = cum[fineType] + fine
        }
        return cum
    }, fineTypes)

    fineTypes = Object.keys(fineTypes).map(key => {
        return { label: key, value: fineTypes[key] }
    })

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center  space-x-10">
                <TimeSeries
                    data={timeSeriesdata2}
                    width={500}
                    height={350}
                    title="GDPR FINES PER DAY"
                    yAxisLabel="sum of fines in a day (£)"
                />

                <TimeSeries
                    data={df}
                    width={500}
                    height={350}
                    title="CUMULATIVE FINES OVER TIME"
                    yAxisLabel="cummulative sum of fines (£)"
                />
            </div>
            <br />
            < CircleChart
                data={
                    Object.keys(countryFines).map(key => {
                        return { label: key, value: countryFines[key] }
                    })}
                width={1040}
                height={350}
            />
            <br />
            <BarChart
                data={fineTypes}
                width={1040}
                height={400}
                title="sum of GDPR fines by fine type"
            />
            <br />
        </div>
    )
}