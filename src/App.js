import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './App.css';
import {useEffect, useState} from "react";
import drilldown from "highcharts/modules/drilldown.js";

drilldown(Highcharts)



function App() {
    const [options1, setOptions1] = useState({
        title: {
            text: 'Tweets by time of the day.'
        },
        legend:{ enabled:false },
        tooltip: {
            formatter: function () {
                return '<b>' + this.y + '</b> tweets at <b>' +Highcharts.dateFormat("%H:%M", this.x)+ '</b>';
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat("%H:%M", this.value);
                }
            }
        },

        plotOptions: {
            series: {
                pointStart: Date.UTC(2022, 0, 1),
                pointInterval: 36e5, // one hour
                relativeXValue: true
            }
        },

        series: [{
            name: "Tweets",
            data: [],
            type: 'column'
        }]
    });

    const [options2, setOptions2] = useState({


        title: {
            text: 'Tweets per year'
        },
        legend:{ enabled:true },

        tooltip: {
            pointFormat: '<b>{point.y}</b> tweets<br/>'
        },

        xAxis: {
            type: 'category'
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            series: {
                relativeYValue: true
            }
        },
        series: [{
            name: "Tweets",
            type: "column"
        }]
    });

    useEffect(() => {
        fetch("http://127.0.0.1:9000/api/charts/time").then(response => {
                return response.json();
            }).then( (result) => {

                let data = result.map(value => {
                    return [value.hours, value.count]
                });
                setOptions1({
                    series: [{
                        data: data
                    }]
                })
        });
        fetch("http://127.0.01:9000/api/charts/stats").then(response => {
            return response.json();
        }).then( (result) => {

            let data = result.map(value => {
                return {
                    name: value.date,
                    y: value.sum,
                    drilldown: value.date
                }
            });
            let drillDownSeries = result.map(value => {
                return {
                    name: value.date,
                    id: value.date,
                    data: [
                        ["Likes", value.likes],
                        ["Retweets", value.retweets],
                    ],
                    type: "column"
                }
            });

            setOptions2({
                series: [{
                    data: data
                }],
                drilldown: {
                    series: drillDownSeries,
                }
            })
        });
    }, []);

  return (
    <div className="App">
      <header className="App-header">

          <div className="container">

            <div className="row">
                  <div className="col-md-12">
                      <HighchartsReact
                          highcharts={Highcharts}
                          options={options1}
                      />
                  </div>
              </div>

          <p></p>

          <div className="row">
                  <div className="col-md-12">
                      <HighchartsReact
                          highcharts={Highcharts}
                          options={options2}
                      />
                  </div>

              </div>

          </div>

      </header>
    </div>
  );
}

export default App;
