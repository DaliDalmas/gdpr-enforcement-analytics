import Home from './pages/Home';
import './App.css';
import { useEffect, useState } from 'react';
import * as d3 from 'd3'

function App() {
  const titleCase = strText => {
    var splitStr = strText.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  const [data, setData] = useState(null)
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
      dataset = dataset.sort((a,b)=> new Date(b.date) - new Date(a.date))
      setData(dataset)
    })
  }, [])
  return (
    <div className="App">
      {data? <Home data={data}/>: <></>}
    </div>
  );
}

export default App;
