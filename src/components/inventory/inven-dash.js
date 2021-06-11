import React, { useState, useEffect } from 'react'
import { Row, Col, Divider } from 'antd'
import { Line, Doughnut } from 'react-chartjs-2'
// import 'chartjs-plugin-datalabels'

const InvenDash = () => {

	const [cData, setCData ] = useState({})
	const [cDataIncident, setCDataIncident ] = useState({})
	const [cDataLocation, setCDataLocation ] = useState({})

	const chart = () => {
		setCData({
			labels: ['CISCO CP3950', 'Palo Alto PA200'],
			datasets: [
				{
					label: 'Things',
					data: [48, 3],
					backgroundColor: ['skyblue', '#FF7F50']
				}
			]
		})
	}


	const cIncident = () => {
		setCDataIncident({
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
			datasets: [
				{
					label: 'Incidents',
					data: [6, 3, 1, 8, 14, 2],
					borderColor: '#FF7F50',
					pointBackgroundColor: '#FF7F50',
					pointStyle: 'rect',
					backgroundColor: 'rgba(255, 127, 80, 0.1)',
				}
			]
		})
	}

	const data = {
		labels: ["ACCESSIBILITY", "FOR ALL AGES", "VARIETY"],
		datasets: [
		  {
			label: "# of Votes",
			data: [12, 19, 3],
			backgroundColor: [
			  "rgba(255, 99, 132)",
			  "rgba(54, 162, 235)",
			  "rgba(255, 206, 86)"
			],
			borderColor: [
			  "rgba(255,99,132,1)",
			  "rgba(54, 162, 235, 1)",
			  "rgba(255, 206, 86, 1)"
			],
			borderWidth: 1
		  }
		]
	  };

	const cLocation = () => {
		setCDataLocation({
			labels: ['BKK', 'Chiang Mai', 'SongKla', 'Pattaya'],
			datasets: [
				{
					label: 'Location',
					data: [16, 5, 3, 7],
					backgroundColor: ['skyblue', 'DarkTurquoise', 'hotpink', 'SlateBlue']
				}
			]
		})
	}


	var options = {
		legend: {
		  display: false,
		  position: 'left'
		},
		plugins: {
		  datalabels: {
			formatter: function(value, context) {
			  return context.chart.data.labels[context.dataIndex];
			},
			align: "center",
			anchor: "center",
			offset: 25,
			padding: -2,
			clip: true,
			font: {
			  size: "12",
			  weight: "bold"
			}
		  }
		}
	  };

	useEffect(() => {
		chart()
		cLocation()
		cIncident()
	}, [])


	return(
		<div>
		<Row>
			<Col span={11}>
				<Doughnut 
					data={cData}
					options={
						{ responsive: true }
					}
					onElementsClick={elem => {
						// var data = cData.datasets[elem[0]._datasetIndex].data;
						// var data = cData.labels[elem[0]._datasetIndex]
						var data = cData.labels
					    // console.log("Cases", data[elem[0]._index]);
					    console.log("Cases", data[elem[0]._index]);
						// console.log(elems.data + ', ' + elems[0]._index);
					}}
				/>
			</Col>
			<Col span={11}>
				<Doughnut
					// data={cDataLocation}
					data={data}
					options={options}
				/>
			</Col>
		</Row>

		<Divider />

		<Row>
			<Col span={11} offset={6}>
				<Line
					data={cDataIncident}
				/>
			</Col>
			<Col span={11}>
				{/* <div id='cLocation'></div> */}
			</Col>
		</Row>
		</div>
	)
}

export default InvenDash
