import React from 'react';
import {XYPlot, XAxis, YAxis, MarkSeries, LabelSeries} from 'react-vis';

const Chart = (props) => {
  var x = props.x.data;
  var y = props.y.data;
  var populations = [];
  var x_percent = [];
  var y_percent = [];
  for (var i = 0; i<x.length; i++) {
    populations.push((x[i].population + y[i].population) / 2);
    x_percent.push(100*x[i].affected/x[i].population);
    y_percent.push(100*y[i].affected/y[i].population);
  }

  var pop_max = Math.max(...populations);
  var pop_min = Math.min(...populations);
  var pop_range = pop_max - pop_min;

  // Normalize population between 0, 1
  var dataArr = [];
  for (i = 0; i<populations.length; i++) {
    dataArr.push({x: x_percent[i], y: y_percent[i], size: (populations[i] - pop_min) / pop_range, label: props.labels[i], style: {fontSize: 4}});
  }

  return (
    <XYPlot width={1000} height={1000}>
      <XAxis orientation='bottom' title={props.x.title} style={{marginTop: '50px'}}/>
      <YAxis orientation='left' title={props.y.title} style={{marginLeft: '50px'}}/>
      <MarkSeries
        className="data-series"
        sizeRange={[.5, 15]}
        data={dataArr}/>
      <LabelSeries animation allowOffsetToBeReversed data={dataArr} />
    </XYPlot>
  );
}

export default Chart;