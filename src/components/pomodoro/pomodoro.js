import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Badge, Button, DatePicker, Drawer, Col, Form, Input, InputNumber, 
	Layout, List, PageHeader, 
	Popconfirm, Radio, Row, Spin, Select, Tooltip
} from 'antd'
import {
	CopyOutlined,
	EditOutlined,
	RightOutlined,
	PlusOutlined
} from '@ant-design/icons';

import moment from 'moment'
import { Doughnut, Line } from 'react-chartjs-2'
// import 'chartjs-plugin-datalabels'

import { pomodoro2DB, pomodorosGet, chartGetPomodoro, chartLineGet } from '../../services/services';

const Pomodoro = () => {

	// var moment = require('moment-timezone');
	const version = '21.06a'
	const dateFormat = 'YYYY-MM-DD'
	const mainColor = 'MediumSlateBlue'
	const subColor = 'slateBlue'
	const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
	const [loading, setLoading] = useState(false)
	const [pomodoros, setPomodoro] = useState()
	const [numRec, setNumRec] = useState(0)
	const [visible, setDrawer] = useState(false)
	const [total, setTotal] = useState(0)
	const [period, setPeriod] = useState(1)
	// const [period, setToday] = useState(true)
	// const [symbol, setSymbol] = useState()
	const [drawerTitle, setDrawerTitle] = useState('Pomodoro')
	const [cData, setCData ] = useState({})
	const [cDataLine, setCDataLine ] = useState({})

	const { Search } = Input
	const { TextArea } = Input
	const { Option } = Select
	// const searchRef = React.createRef()
	const searchRef = React.useRef()
	// const switchRef = React.useRef()
	const [form] = Form.useForm()

	const cBorderColor = [
		'lightGray', 'CornflowerBlue', 'PaleGreen', 'HotPink'
	]
	const cBGColor = [
		'rgba(211, 211, 211, 0.1)',
		'rgba(100, 149, 237, 0.1)',
		'rgba(152, 251, 152, 0.1)',
		'rgba(255, 105, 180, 0.1)'
	]

	const douOptions = {
		title: {
			display: true,
			text: 'Tasks',
			position: 'left',
			font: {
				family: 'Roboto'
			}
		},
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			position: 'left'
		},
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {

					var label = " " + data.labels[tooltipItem.index]
					var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]

					label += " : " + (parseFloat(val) / 60).toFixed(1) + " h"

					return label;
				}
			}
		}
	} // END: douOptions


	const lineOptions = {
		title: {
			display: true,
			text: 'Categories (Month)',
			position: 'left'
		},
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: false,
			position: 'top'
		},
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {

					var label = " " + data.datasets[tooltipItem.datasetIndex].label
					var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]

					label += " : " + val.toFixed(2) + "h"

					return label;
				}
			}
		}
	} // END: lineOptions




	// const chart = async(o) => {

	// 	let labels = []
	// 	let datas = []
	// 	let tmp = []

	// 	const chartData = await chartGet(period);

	// 	chartData.forEach((oo) => {

	// 		let min = 0

	// 		o.forEach((res) => {

	// 			if ( oo.task == res.task ) {
	// 				min+= ( res.minute / 60 )
	// 			}
	// 		})

	// 		tmp.push({label: oo.task, data: min})
	// 		// labels.push(oo.task)
	// 		// datas.push(min)

	// 	})

	// 	tmp.sort((a, b) => { return b.data - a.data })

	// 	tmp.forEach((o, i) => {

	// 		if ( i > 6 ) return

	// 		if ( o.data > 0 ) {
	// 			labels.push(o.label)
	// 			datas.push(o.data)
	// 		}
	// 	})

	// 	setCData({
	// 		labels: labels,
	// 		datasets: [
	// 			{
	// 				label: 'Things',
	// 				data: datas,
	// 				backgroundColor: [
	// 					'MediumOrchid', 'MediumPurple', 'BlueViolet', 'DarkViolet', 
	// 					'DarkOrchid', 'SlateBlue', 'MediumSlateBlue', 'DarkSlateBlue',
	// 					'Indigo', 'DarkMagenta', 'Purple', 'RebeccaPurple'
	// 				]
	// 			}
	// 		]
	// 	})
	// } // END: chart

	const chart = async(o) => {

		let labels = []
		let datas = []
		let tmp = []

		const chartData = await chartGetPomodoro(o)

		chartData.forEach((o, i) => {

			if ( i > 7 ) return

			labels.push(o.task)
			datas.push(o.sum)

		})

		setCData({
			labels: labels,
			datasets: [
				{
					label: 'Things',
					data: datas,
					backgroundColor: [
						'MediumOrchid', 'MediumPurple', 'BlueViolet', 'DarkViolet', 
						'DarkOrchid', 'SlateBlue', 'MediumSlateBlue', 'DarkSlateBlue',
						'Indigo', 'DarkMagenta', 'Purple', 'RebeccaPurple',
						'paleGreen', 'limeGreen', 'forestGreen', 'yellowGreen', 'teal', 
						'darkTurquoise', 'MediumOrchid', 'SlateBlue', 
						'dodgerBlue', 'cornFlowerBlue', 'RoyalBlue', 'deepSkyBlue',
						'hotPink', 'deepPink', 'lightPink', 'tomato', 'orange', 'salmon',
					]
				}
			]
		})
	} // END: chart



	const chartLine = async(o) => {

		const chartData = await chartLineGet(null);

		// console.log("pomodoro - chartline: ", chartData)

		const group = chartData.reduce((r, a) => {
			r[a.type] = [...r[a.type] || [], a];
			return r;
		}, {})

		const out = []
		let colorCnt = 0

		for ( const prop in group ) {

			// console.log(group[prop]);
			let dd = [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

			group[prop].forEach((o) => {

				for ( let i = 1; i < 31; i++ ) {

					if ( parseInt((o.cdate).substr(8,2)) == i ) {
						// console.log(o.type + " : dd[", i, "] = ", parseInt((o.cdate).substr(8,2)), "< ", o.minute)
						dd[i-1] += (parseInt(o.minute) / 60)

					}

				}
			})

			switch (prop) {
				case 'Administrator':
					colorCnt = 0
					break;
				case 'Core Responsibility':
					colorCnt = 1
					break;
				case 'Free Time':
					colorCnt = 2
					break;
				case 'Personal Growth':
					colorCnt = 3
					break;
			}


			out.push({
				label: prop,
				data: dd,
				borderColor: cBorderColor[colorCnt],
				pointBackgroundColor: cBorderColor[colorCnt],
				backgroundColor: cBGColor[colorCnt]
			})
		}

		setCDataLine({
			labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
			datasets: out
		})
	} // END: chartLine



	const fetchAll = async (o) => {

		setLoading(true)

		const fetchedEntries = await pomodorosGet(o);

		let tmp = 0

		fetchedEntries.forEach((o) => {

			tmp += (o.minute / 60)
			
		})

		setTotal(tmp)
		setNumRec(fetchedEntries.length)
		setPomodoro(fetchedEntries)
		// await chart(fetchedEntries)
		await chart(o)
		await chartLine(fetchedEntries)

		setLoading(false)
	}

	useEffect(() => {

		fetchAll({
			period: period,
			keyword: searchRef.current.state.value,
			filter: 'active'
		})

	}, [])

	useEffect(() => {

		fetchAll({
			period: period,
			keyword: searchRef.current.state.value,
			filter: 'active'
		})

	 }, [period])


	const onClose = () => {

		setDrawer(false)

	}


	const onFinish = async (o) => {

		onClose()

		// let k = searchRef.current === null ? '' : searchRef.current.state.value
		// console.log("finish >", o);

		const tmp = await pomodoro2DB(o)

		fetchAll({
			period: period,
			keyword: searchRef.current.state.value,
			filter: 'active'
		})

	}


	const onChangePeriod = (e) => {
		setPeriod(e.target.value)
	};


	const onSearch = (e) => {

		fetchAll({
			period: period,
			keyword: e,
			filter: 'all'
		})

		// setToday(true)
	}

	const onDup = (o) => {

		o.id = 0
		o.cdate = moment()
		o.minute = 0

		onFinish(o)

	} // END: onDup


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			Pomodoro <Badge style={{ backgroundColor: subColor }} count={numRec} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	const setSubTitle = () => {
		return <div style={{ color: 'lightgray', marginTop: -9, height: 40 }}>
				Total: &nbsp; 
			<span style={{ color: mainColor, fontSize: '1.5em'}}>
				{addCommas(total.toFixed(0))} Hrs
			</span>
		</div>
	}

	const setTypeColor = (o) => {

		let color = 'lightgray'

		switch (o) {
			case 'Free Time':
				color = 'green'
				break;
			case 'Personal Growth':
				color = 'HotPink'
				break;
			case 'Core Responsibility':
				color = 'dodgerblue'
				break;
			case 'Administrator':
				color = 'gray'
				break;
		
			default:
				break;
		}

		return color
	}


	const showDrawer = (o) => {

		if ( o !== null ) {

			// console.log("showDrawer: ", moment.utc(o.cdate));

			setDrawerTitle("Pomodoro (Edit)")

			form.setFieldsValue({
				id: o.key,
				type: o.type,
				project: o.project,
				story: o.story,
				task: o.task,
				subtask: o.subtask,
				minute: o.minute,
				// cdate: o.cdate !== null ? moment(o.cdate) : null
				cdate: o.cdate !== null ? moment.utc(o.cdate) : null
			})

		} else {

			setDrawerTitle("New Pomodoro")

			form.setFieldsValue({
				id: 0,
				type: '',
				project: '',
				story: '',
				task: '',
				subtask: '',
				minute: 0,
				cdate: moment(),
				flag: '1'
			})

		}

		setDrawer(true)	
	}


	const getMargin = (o) => {

		// return o.sell > 0 ? "฿" + (addCommas((o.sell - o.buy).toFixed(2) * o.vol)) : "฿" + 0
		return o.sell > 0 ? "฿" + addCommas(((o.sell - o.buy) * o.vol).toFixed(2)) : "฿" + 0

	}

	const getMarginP = (o) => {

		if ( o.profit > 0 ) {

			return ((o.profit / (o.buy * o.vol)) * 100).toFixed(2) + " %"

		} else {

			return o.sell > 0 ? (((o.sell - o.buy) / o.buy ) * 100).toFixed(2) + " %" : 0 + " %"

		}

	}
	
	const getMarginPColor = (o) => {

		return (((o.sell - o.buy) / o.buy ) * 100) > 0 ? 'green' : 'red'

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
					// <SwitchAntd 
					// 	name="today"
					// 	ref={switchRef}
					// 	checkedChildren="Today"
					// 	unCheckedChildren="Any"
					// 	initialValue={period}
					// 	defaultChecked
					// 	style={{ background: "MediumSlateBlue", borderColor: "MediumPurple", marginRight: '40px' }}
					// 	onChange={(e) => {loadToday(e)}}
					// />, 
					<Radio.Group onChange={onChangePeriod} initialValue={1} value={period}>
						<Radio value={1}>Today</Radio>
						<Radio value={2}>Month</Radio>
						<Radio value={3}>All</Radio>
					</Radio.Group>,
					<Search
						placeholder="Search..."
						ref={searchRef}
						allowClear
						onSearch={onSearch}
						style={{ width: 200, margin: "0 15px 0 0" }}
					/>,
					<Tooltip title="New">
						<Button
							type="primary"
							style={{ background: mainColor, borderColor: subColor }}
							shape="circle"
							icon={<PlusOutlined />}
							size={48}
							onClick={() => showDrawer(null)}
						/>
					</Tooltip>
				]}
			>
				<Row gutter={16}>
					<Col span={8} offset={1}>
						<Doughnut
							data={cData}
							options={douOptions}
							// onElementsClick={elem => {
							// 	// var data = cData.datasets[elem[0]._datasetIndex].data;
							// 	var data = cData.labels
							// 	// console.log("Cases", data[elem[0]._index]);
							// 	console.log("Cases", data[elem[0]._index]);
							// 	// console.log(elems.data + ', ' + elems[0]._index);
							// }}
						/>
					</Col>
					<Col span={10} offset={4}>
						<Line
							data={cDataLine}
							options={lineOptions}
						/>
					</Col>
				</Row>

			</PageHeader>

			<List
				size="small"
				// header={<div>Header</div>}
				// footer={<div>Footer</div>}
				// bordered
				// dataSource={data}
				loading={loading}
				dataSource={pomodoros}
				renderItem={(item, index) => (
					<List.Item
						actions={[
							// <span style={{color: getMarginPColor(item)}}>
							// 	{item.profit == 0 ? getMargin(item) : "฿" + (item.profit)}
							// </span>,
							// <span style={{ fontSize: '0.8em', color: 'lightgray' }}>
							<div>
								<div style={{ color: setTypeColor(item.type), fontSize: '0.8em', textAlign: 'right' }}>
									{item.type}
								</div>
								<div style={{ textAlign: 'right' }}>
									<Tooltip title={ moment(item.cdate).format('DD MMM YYYY') }>
										{ moment(item.cdate).fromNow() }
									</Tooltip>
								</div>
							</div>,
							<Tooltip title="Duplicate">
								<Popconfirm
									placement="left"
									title="Do you want to duplicate this record?"
									okText="Duplicate"
									cancelText="No"
									onConfirm={() => {onDup(item)}}
								>
									<Button type="dash"
										shape="circle"
										icon={<CopyOutlined />}
										size={38}
										// onClick={() => pomodoroDup(item)}
										style={{ marginLeft: 10 }}
									/>
      							</Popconfirm>
							</Tooltip>,
							<Button type="dash"
								shape="circle"
								icon={<EditOutlined />}
								size={38}
								onClick={() => showDrawer(item)}
								style={{ marginLeft: 10 }}
							/>
						]}
						// style={{backgroundColor: 'linen'}}
					>
						<List.Item.Meta
							// avatar={<Avatar src={} />}	
							title={
								<span style={{ color: 'lavender' }}>{item.project}--
								<span style={{ color: 'gainsboro' }}>{item.story}</span>--
								<span style={{ color: 'LightSlateGray' }}>{item.task}</span>--
								<span style={{ color: 'lightgray' }}>{item.subtask} 
								</span></span>
							}
							description={addCommas((item.minute / 60).toFixed(1)) + "h"} 
						/>
					</List.Item>
				)}
			/>



			<Drawer
				title={drawerTitle}
				width={400}
				onClose={onClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				destroyOnClose={true}
			>
				<Form
					name="pomodoro"
					form={form}
					// ref={formRef}
					layout="vertical"
					onFinish={onFinish}
					// onValuesChange={onChange}
				>
					<Row gutter={16} hidden={true}>
						<Col>
							<Form.Item
								name="id"
								label="ID"
								initialValue={ 0 }
							>
								<InputNumber disabled={true} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={10}>
							<Form.Item
								name="type"
								label="Type"
								rules={[{ required: true, message: 'Please enter Type' }]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col span={10}>
							<Form.Item
								name="project"
								label="Project"
								rules={[{ required: true, message: 'Please enter Project' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={10}>
							<Form.Item
								name="story"
								label="Story"
								rules={[{ required: true, message: 'Please enter Story' }]}
							>
								<Input />
							</Form.Item>
						</Col>

						<Col span={10}>
							<Form.Item
								name="task"
								label="Task"
								rules={[{ required: true, message: 'Please enter Task' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={10}>
							<Form.Item
								name="subtask"
								label="Subtask"
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="minute"
								label="Minute"
								rules={[{ required: true, message: 'Please enter volumn' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="cdate"
								label="Date" 
								rules={[{ required: true, message: 'Please enter Buy date' }]}
							>
								<DatePicker format={dateFormat} />
								{/* <DatePicker /> */}
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={12} offset={12}>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
								>
									Submit
								</Button>
								<Button onClick={onClose} style={{ marginLeft: 8 }}>
									Cancel
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	)
}

export default Pomodoro
