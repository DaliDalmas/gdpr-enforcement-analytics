import Home from './pages/Home';
import './App.css';
import { useEffect, useState } from 'react';
import * as d3 from 'd3'

function App() {

  const [maxFine, setMaxFine] = useState(1000000)
  // Listen to the slider?
  d3.select("#mySlider").on("change", function (d) {
    const selectedValue = this.value
    setMaxFine(selectedValue)
  })

  const titleCase = strText => {
    var splitStr = strText.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  const [data, setData] = useState(null)
  const [df, setdf] = useState(null)

  useEffect(() => {
    const parseTime = d3.timeParse('%Y-%m-%d')
    const rowConverter = row => {
      return {
        id: row['etid'],
        date: parseTime(row['date_of_decision']),
        country: titleCase(row['country']),
        fine: +row['fine'],
        fineType: row['fine_type'],
        controller: row['controller_or_processor']
      }
    }
    d3.json(
      'http://127.0.0.1:8000/fines/?skip=0&limit=5000'
    ).then(dataset => {
      dataset = dataset.map(rowConverter)
      dataset = dataset.sort((a, b) => new Date(b.date) - new Date(a.date))
      setData(dataset)
      setdf(dataset)
    })


  }, [])


  useEffect(() => {
    if (data) {
      setdf(data.filter(d => d.fine <= maxFine))
    }
  }, [maxFine, data])

  let maximumFine = 0
  let minimunFine = 0
  let averageFine = 0
  let medianFina = 0
  if(data){
    maximumFine = d3.max(df, d=>d.fine)
    minimunFine = d3.min(df, d=>d.fine)
    averageFine = d3.mean(df, d=>d.fine)
    medianFina = d3.median(df, d=>d.fine)
  }

  return (
    <div className="App">
      <h1 className='text-4xl font-helvetica font-bold'>GDPR ENFORCEMENT DASHBOARD</h1>
      <div className='flex justify-center items-center space-x-20 mt-6 mb-6'>
        <div className='flex justify-center items-center flex-col height-40 bg-[#ffb8e1]	w-48 h-24 rounded-lg'>
          <span className='text-xl font-bold font-helvetica'>MAXIMUM FINE</span>
          <span>{maximumFine}</span>
        </div>
        <div className='flex justify-center items-center flex-col height-40 bg-[#ffb8e1]	w-48 h-24 rounded-lg'>
          <span className='text-xl font-bold font-helvetica'>AVERAGE FINE</span>
          <span>{averageFine}</span>
        </div>
        <div className='flex justify-center items-center flex-col height-40 bg-[#ffb8e1]	w-48 h-24 rounded-lg'>
          <span className='text-xl font-bold font-helvetica'>MINIMUM FINE</span>
          <span>{minimunFine}</span>
        </div>
        <div className='flex justify-center items-center flex-col height-40 bg-[#ffb8e1]	w-48 h-24 rounded-lg'>
          <span className='text-xl font-bold font-helvetica'>MEDIAN FINE</span>
          <span>{medianFina}</span>
        </div>
      </div>
      
      <input type="range"
        className='mb-6 slider'
        name="mySlider"
        id="mySlider"
        min={1000}
        max={50000000}
        size={100}
        style={{ width: '1040px' }} ></input>
      

      {data ? <Home data={df} /> : <></>}
    </div>
  );
}

export default App;
