import React, { useState, useEffect } from 'react';
import {
	Badge, Col,
	PageHeader, Progress,
	Row, Select, Slider, Switch as SwitchAntd
} from 'antd'
import {
	PlusOutlined
} from '@ant-design/icons';

import { portfolioGet, chartLineGetTrading  } from '../../services/services';
import { Line } from 'react-chartjs-2'
import moment from 'moment';

const Portfolio = () => {

	const version = '21.06a'
	const mainColor = 'goldenrod'
	const subColor = 'darkgoldenrod'
	const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
	const [loading, setLoading] = useState(false)
	const [cDataLine, setCDataLine ] = useState({})
	const [portfolio, setPortfolio] = useState([
		{ broker: '', sum: 0 },
		{ broker: '', sum: 0 }
	])
	const [outstanding, setOutstanding] = useState([
		{ broker: '', unrealized: 0 },
		{ broker: '', unrealized: 0 }
	])
	const [years, setYears] = useState(
		{ start: '2021', end: '2022' }
	)
	const [numRec, setNumRec] = useState(0)
	const [total, setTotal] = useState(0)
	const [unrealized, setUnrealized] = useState(true)
	const [viewChartBy, setViewChart] = useState('Yearly')

	// const { Search } = Input
	// const { Option } = Select
	// const searchRef = React.useRef()

	const marks = {
		0: '2020',
		10: '2021',
		20: '2022',
		30: '2023',
		40: '2024',
		50: '2025',
		60: '2026',
		70: '2027',
		80: '2028',
		90: '2029',
		100: {
			style: { color: subColor },
			label: <strong>2030</strong>,
		}
	}

	const cBorderColor = [
		'darkKhaki', 'paleGoldenRod', 'khaki'
	]
	const cBGColor = [
		'rgba(211, 211, 211, 0.1)',
	]

	const lineOptions = {
		title: {
			display: true,
			text: viewChartBy + ' Profit',
			position: 'left'
		},
		responsive: true,
		maintainAspectRatio: true
	}


	const chartLine = async(o) => {

		let oo = {}

		oo.o = o
		oo.start = years.start
		oo.end = years.end

		const chartData = await chartLineGetTrading(oo);
		let obj = []
		let labs = []

			// labs = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]

			chartData.forEach((o) => {
				obj.push(parseInt(o.profit))
				labs.push(moment(o.mnt).format('YY-MMM'))
			})

			// chartData.forEach((o) => {
			// 	idx = o.mnt.substring(8)
			// 	obj[parseInt(idx) - 1] = parseInt(o.profit)
			// })


		// console.log("chartline >", obj);

		const out = [{
			label: 'Profit',
			data: obj,
			borderColor: cBorderColor[0],
			pointBackgroundColor: cBorderColor[0],
			backgroundColor: cBGColor[0]
		}]


		setCDataLine({
			labels: labs,
			datasets: out
		})
	} // END: chartLine`





	// ==================================================
	const fetchAll = async (o) => {

		setLoading(true)

		o.filter = unrealized
		o.route = ""

		let tmp = 0

		let fetchedEntries = await portfolioGet(o);
		setPortfolio(fetchedEntries)

		o.route = "outstanding/"
		fetchedEntries = await portfolioGet(o);

		setOutstanding(fetchedEntries)

		setTotal(tmp)
		setNumRec(fetchedEntries.length)

		setLoading(false)

	}


	useEffect(() => {

		fetchAll({
			// keyword: searchRef.current.state.value,
		})

	}, [unrealized])


	useEffect(() => {

		chartLine("Yearly")

	}, [years])


	const onRealized = (e) => {

		setUnrealized(e)

	} // END: onRealized


	const onSearch = (e) => {

		fetchAll({
			keyword: e
		})
	}

	const onSlider = (e) => {

		setYears(
			{
				start: 2020 + parseInt(e[0].toString().substr(0,1)), 
				end: 2020 + parseInt(e[1].toString().substr(0,1))
			}
		)

	} // END: onRealized


	const onViewChart = (e) => {

		setViewChart(e)

	}
		

	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			Portfolio <Badge style={{ backgroundColor: subColor }} count={numRec} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	const setSubTitle = () => {
		return <div style={{ color: 'lightgray', marginTop: -9, height: 40 }}>
				{/* Current: &nbsp;  */}
			<span style={{ color: ( total >= 0 ? mainColor : 'tomato' ), fontSize: '1.5em'}}>
				{/* ฿{addCommas(total.toFixed(0))} */}
				{ moment().format("MMM DD, YYYY") }
			</span>
		</div>
	}

	return(
		<>
			<PageHeader
				ghost={true}
				// tags={<Tag color="blue">{this.props.match.params.id}</Tag>}
				// onBack={() => window.history.back()}
				title={setTitle()}
				subTitle={setSubTitle()}
				style={{ position: 'sticky', top: 0,
					backgroundColor: 'white',
					zIndex: 1,
					width: '100%'
				}}
				extra={[
					// <span>
					// 	<SwitchAntd 
					// 		name="realized"
					// 		checkedChildren="Unrealized"
					// 		unCheckedChildren="All"
					// 		defaultChecked
					// 		style={{ background: mainColor, marginRight: 15 }}
					// 		onClick={(e) => {onRealized(e)}}
					// 	/> 
					// 	<span style={{ color: 'lightgray', marginRight: '15px' }}>
					// 		| Chart View: 
					// 		<Select
					// 			// ref={selectRef}
					// 			style={{ marginLeft: 10 }}
					// 			placeholder="Select a Chart View"
					// 			defaultValue="Monthly"
					// 			onSelect={(e) => { onViewChart(e) }}
					// 		>
					// 			<Option value='Monthly'>Month</Option>
					// 			<Option value='Yearly'>Year</Option>
					// 		</Select>
					// 	</span>
					// </span>,
					// <Search
					// 	placeholder="Search..."
					// 	ref={searchRef}
					// 	allowClear
					// 	onSearch={onSearch}
					// 	style={{ width: 200, margin: "0 15px 0 0" }}
					// />
				]}
			>
				<Row style={{ marginBottom: 30 }}>
					<Col span={24}>
							<Slider
								range={{ draggableTrack: true }} 
								defaultValue={[10, 20]}
								step={10}
								tooltipVisible={false}
								marks={marks}
								onAfterChange={onSlider}
							/>
					</Col>
				</Row>
				<Row style={{ marginBottom: 20 }}>
					<Col>
						<Progress type="circle"
							strokeColor={{
								'0%': subColor,
								'100%': mainColor,
							}}
							percent={
								(( parseInt(outstanding[0].unrealized) / parseInt(portfolio[0].sum) ) * 100).toFixed(0)
							}
							width={100}
						/>

						<span style={{ color: 'gray', marginLeft: 15 }}>
							Keaw:
							<span style={{ color: ( parseInt(outstanding[0].unrealized) < parseInt(portfolio[0].sum) ? 'tomato' : mainColor ), marginLeft: 5 }}>
								{ addCommas(parseInt(outstanding[0].unrealized).toFixed(0)) }
								<span style={{ color: subColor, marginLeft: 5 }}>
									 / { addCommas(parseInt(portfolio[0].sum).toFixed(0)) }
								</span>
							</span>
						</span>
					</Col>
				</Row>
				<Row>
					<Col>
						<Progress type="circle"
							strokeColor={{
								'0%': subColor,
								'100%': mainColor,
							}}
							percent={
								(( parseInt(outstanding[1].unrealized) / parseInt(portfolio[1].sum) ) * 100).toFixed(0)
							}
							width={100}
						/>

						<span style={{ color: 'gray', marginLeft: 15 }}>
							Keaw Finansia:
							<span style={{ color: ( parseInt(outstanding[1].unrealized) < parseInt(portfolio[1].sum) ? 'tomato' : mainColor ), marginLeft: 5 }}>
								{ addCommas(parseInt(outstanding[1].unrealized).toFixed(0)) }
								<span style={{ color: subColor, marginLeft: 5 }}>
										/ { addCommas(parseInt(portfolio[1].sum).toFixed(0)) }
								</span>
							</span>
						</span>
					</Col>
					<Col span={12} offset={2}>
						<Line
							data={cDataLine}
							options={lineOptions}
						/>
					</Col>
				</Row>
			</PageHeader>
		</>
	)
}

export default Portfolio
