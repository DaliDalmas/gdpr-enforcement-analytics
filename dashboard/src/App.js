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
    if (data){
      setdf(data.filter(d => d.fine <= maxFine))
    }
  }, [maxFine,data])


  return (
    <div className="App">

      <input type="range"
              name="mySlider"
              id="mySlider"
              min={1000}
              max={50000000} 
              size={100}
              style={{ width: '1000px' }} ></input>
      <span>{maxFine}</span>
      <div>
        MAXIMUM FINE
      </div>
      <div>
        AVERAGE FINE
      </div>
      <div>
        MINIMUM FINE
      </div>
      <div>
        MEDIAN FINE
      </div>
      {data ? <Home data={df} /> : <></>}
    </div>
  );
}

export default App;
