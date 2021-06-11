import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Badge, Button, DatePicker, Drawer, Col, Form, Input, InputNumber, List,
	PageHeader, Popconfirm,
	Row, Select, Switch as SwitchAntd, Tooltip
} from 'antd'
import {
	CopyOutlined,
	RightOutlined,
	PlusOutlined
} from '@ant-design/icons';

import moment from 'moment'
import { Doughnut, Line } from 'react-chartjs-2'
// import 'chartjs-plugin-datalabels'

import { trading2DB, tradingsGet, tradingSymbolGet, chartGetTrading, chartLineGetTrading } from '../../services/services';

const Trading = () => {

	const version = '21.06a'
	const dateFormat = 'YYYY-MM-DD'
	const mainColor = 'dodgerBlue'
	const subColor = 'steelBlue'
	const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
	const [loading, setLoading] = useState(false)
	// const history = useHistory()
	const [tradings, setTrading] = useState()
	const [numRec, setNumRec] = useState(0)
	const [visible, setDrawer] = useState(false)
	const [total, setTotal] = useState(0)
	// const [period, setPeriod] = useState(1)
	const [symbol, setSymbol] = useState()
	const [unrealized, setUnrealized] = useState(true)
	const [viewChartBy, setViewChart] = useState('Monthly')
	const [drawerTitle, setDrawerTitle] = useState('Trading')
	const [drawerSubCost, setDrawerSubCost] = useState(0)
	const [drawerSubUnrealized, setDrawerSubUnrealized] = useState(0)
	const [cData, setCData ] = useState({})
	const [cDataLine, setCDataLine ] = useState({})

	const { Search } = Input
	const { TextArea } = Input
	const { Option } = Select
	// const searchRef = React.createRef()
	const searchRef = React.useRef()
	// const switchRef = React.useRef()
	// const selectRef = React.useRef()
	const [form] = Form.useForm()

	const cBorderColor = [
		'lightGray', 'HotPink', 'PaleGreen', 'CornflowerBlue'
	]
	const cBGColor = [
		'rgba(211, 211, 211, 0.1)',
		'rgba(255, 105, 180, 0.1)',
		'rgba(152, 251, 152, 0.1)',
		'rgba(100, 149, 237, 0.1)'
	]

	var chartOptions = {
		title: {
			display: true,
			text: 'Outstanding',
			position: 'left',
			font: {
				family: 'Roboto'
			}
		},
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			position: 'left'
		}
		// plugins: {
		// 	datalabels: {
		// 		formatter: function(value, context) {
		// 			return context.chart.data.labels[context.dataIndex];
		// 		},
		// 		align: "top",
		// 		anchor: "center",
		// 		offset: 25,
		// 		padding: -2,
		// 		clip: true,
		// 		font: {
		// 			size: "16",
		// 			weight: "bold"
		// 		}
		// 	}
		// }
	}

	const lineOptions = {
		title: {
			display: true,
			text: viewChartBy + ' Profit',
			position: 'left'
		},
		responsive: true,
		maintainAspectRatio: true
	}


	const chart = async(o) => {

		let labels = []
		let datas = []
		let tmp = []

		const chartData = await chartGetTrading(null);

		// chartData.forEach((oo) => {

		// 	let min = 0

		// 	o.forEach((res) => {

		// 		if ( oo.task == res.task ) {
		// 			min+= ( res.minute / 60 )
		// 		}
		// 	})

		// 	tmp.push({label: oo.task, data: min})
		// 	// labels.push(oo.task)
		// 	// datas.push(min)

		// })

		// tmp.sort((a, b) => { return b.data - a.data })

		chartData.forEach((o) => {

			labels.push(o.name)
			datas.push(o.profit)

		})

		setCData({
			labels: labels,
			datasets: [
				{
					label: 'Things',
					data: datas,
					backgroundColor: [
						'dodgerBlue', 'cornFlowerBlue', 'RoyalBlue', 'deepSkyBlue',
						'hotPink', 'deepPink', 'lightPink', 'tomato', 'orange', 'salmon',
						'paleGreen', 'limeGreen', 'forestGreen', 'yellowGreen', 'teal', 
						'darkTurquoise', 'MediumOrchid', 'SlateBlue', 
						'Indigo', 'DarkMagenta', 'Purple', 'RebeccaPurple'
					]
				}
			]
		})
	} // END: chart


	const chartLine = async(o) => {

		const chartData = await chartLineGetTrading(o);
		let obj = []
		let labs = []

		if ( viewChartBy == 'Yearly' ) {

			labs = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]

			chartData.forEach((o) => {
				obj.push(parseInt(o.profit))
			})

		} else {

			let idx = 0

			// Create buffer araary til today
			for ( let i = 0; i < parseInt(moment().format('DD')); i++ ) {
				obj.push(0)
			}

			labs = [
				'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
				'11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
				'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' 
			]

			chartData.forEach((o) => {
				idx = o.mnt.substring(8)
				obj[parseInt(idx) - 1] = parseInt(o.profit)
			})

		}


		// console.log("chartline >", obj);

		const out = [{
			label: 'Profit',
			data: obj,
			borderColor: cBorderColor[3],
			pointBackgroundColor: cBorderColor[3],
			backgroundColor: cBGColor[3]
		}]


		setCDataLine({
			labels: labs,
			datasets: out
		})
	} // END: chartLine



	const fetchAll = async (o) => {

		setLoading(true)

		o.filter = unrealized

		const fetchedEntries = await tradingsGet(o);

		let tmp = 0

		fetchedEntries.forEach((o) => {

			tmp += (o.sell - o.buy) * o.vol
			
		})

		setTotal(tmp)
		setTrading(fetchedEntries)
		setNumRec(fetchedEntries.length)
		await chart()
		await chartLine(viewChartBy)

		setLoading(false)

	}


	useEffect(() => {

		loadSymbol()

		fetchAll({
			keyword: searchRef.current.state.value,
		})

	}, [])


	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value,
		})

	}, [unrealized])


	useEffect(() => {

		chartLine(viewChartBy)

	}, [viewChartBy])


	const loadSymbol = ()  => {

		tradingSymbolGet().then(res => {

			let ops = []

			res.forEach((o) => {
				ops.push(<Option value={o._id}>{o.name}</Option>)
			})

			setSymbol(ops)

		})
		.catch((error) => {
			console.log(error)
		})
	} // END: loadSymbol


	const onChange = (o) => {

		let vol = form.getFieldValue().vol
		let buy = form.getFieldValue().buy
		let sell = form.getFieldValue().sell

		let cost = vol * buy
		let unrealized = sell > 0 ? (vol * sell) - (vol * buy) : 0
		
		setDrawerSubCost(cost)
		setDrawerSubUnrealized(unrealized)
	}


	const onClose = () => {

		setDrawer(false)

	}


	const onDup = (o) => {

		o.id = 0
		o.cdate = moment()
		o.edate = null

		onFinish(o)

	} // END: onDup


	const onFinish = async (o) => {

		onClose()
		// console.log("finish >", o);
		// return trading2DB(o)

		const tmp = await trading2DB(o)

		fetchAll({
			keyword: searchRef.current.state.value,
		})
	}


	const onRealized = (e) => {

		setUnrealized(e)

	} // END: onRealized


	const onSearch = (e) => {

		fetchAll({
			keyword: e
		})
	}


	const onViewChart = (e) => {

		setViewChart(e)

	}
		

	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			Trading <Badge style={{ backgroundColor: subColor }} count={numRec} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	const setSubTitle = () => {
		return <div style={{ color: 'lightgray', marginTop: -9, height: 40 }}>
				Current: &nbsp; 
			<span style={{ color: ( total >= 0 ? mainColor : 'tomato' ), fontSize: '1.5em'}}>
				฿{addCommas(total.toFixed(0))}
			</span>
		</div>
	}

	const showDrawer = (o) => {

		// console.log("showDrawer: ", o);

		if ( o !== null ) {

			setDrawerTitle("Trading (Edit)")
			setDrawerSubCost(o.vol * o.buy)
			setDrawerSubUnrealized(o.sell > 0 ? (o.vol * o.sell) - (o.vol * o.buy) : 0)

			form.setFieldsValue({
				id: o.key,
				broker: o.broker,
				symbol: o.symbol,
				vol: o.vol,
				buy: o.buy,
				sell: o.sell,
				profit: o.profit,
				cdate: o.cdate !== null ? moment(o.cdate) : null,
				edate: o.edate !== null ? moment(o.edate) : null,
				note: o.note
			})

		} else {

			setDrawerTitle("New Trading")
			setDrawerSubCost(0)
			setDrawerSubUnrealized(0)
			form.setFieldsValue({
				id: 0,
				broker: 'FNS',
				symbol: '',
				vol: 0,
				buy: 0,
				sell: 0,
				profit: 0,
				cdate: moment(),
				edate: null,
				note: null,
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
					<span>
						<SwitchAntd 
							name="realized"
							// ref={switchRef}
							checkedChildren="Unrealized"
							unCheckedChildren="All"
							defaultChecked
							style={{ background: mainColor, marginRight: 15 }}
							onClick={(e) => {onRealized(e)}}
						/> 
						<span style={{ color: 'lightgray', marginRight: '15px' }}>
							| Chart View: 
							<Select
								// ref={selectRef}
								style={{ marginLeft: 10 }}
								placeholder="Select a Chart View"
								defaultValue="Monthly"
								onSelect={(e) => { onViewChart(e) }}
							>
								<Option value='Monthly'>Month</Option>
								<Option value='Yearly'>Year</Option>
							</Select>
						</span>
					</span>,
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
					<Col span={10} offset={1}>
						<Doughnut
							data={cData}
							options={chartOptions}
						/>
					</Col>
					<Col span={10} offset={1}>
						<Line
							data={cDataLine}
							options={lineOptions}
						/>
					</Col>
				</Row>
			</PageHeader>

			<List
				size="small" 
				loading={loading}
				// header={<div>Header</div>}
				// footer={<div>Footer</div>}
				// bordered
				// dataSource={data}
				dataSource={tradings}
				renderItem={(item, index) => (
					<List.Item
						actions={[
							<div>
								<div style={{color: getMarginPColor(item)}}>
									{item.profit == 0 ? getMargin(item) : "฿" + (item.profit)}
								</div>
								<div style={{color: getMarginPColor(item), fontSize: '0.8em', textAlign: 'right' }}>
									{getMarginP(item)}
								</div>
							</div>,
							<span>
								<Tooltip title={(item.edate !== null ? moment(item.edate).format('DD MMM YYYY') : moment(item.cdate).format('DD MMM YYYY')) }>
									{(item.edate !== null ? moment(item.edate).fromNow() : <span style={{fontSize: '0.8em'}}>Buy {moment(item.cdate).fromNow()}</span>)}
								</Tooltip>
							</span>,
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
								icon={<RightOutlined />}
								size={38}
								onClick={() => showDrawer(item)}
								style={{ marginLeft: 10 }}
							/>,
							// <Button
							// 	type="danger"
							// 	size="small"
							// 	onClick={() => this.deleteTask(index)}
							// >
							// 	delete
							// </Button>,
							// <Button
							// 	type="primary"
							// 	size="small"
							// 	onClick={() => this.deleteTask(index)}
							// >
							// 	Edit
							// </Button>
						]}
					>
						<List.Item.Meta
							// avatar={<Avatar src={} />}	
							title={item.symbolName}
							description={"฿" + addCommas((item.buy * item.vol).toFixed(0))} 
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
					name="trading"
					form={form}
					// ref={formRef}
					layout="vertical"
					// hideRequiredMark 
					onFinish={onFinish}
					// onFieldsChange={onChange}
					onValuesChange={onChange}
				>
					<Row gutter={16}>
						<Col>
							<div style={{ height: 60, color: 'lightgray' }}>
								Cost: <span style={{ color: subColor }}>
									฿{ addCommas(drawerSubCost.toFixed(0)) }
								</span>
								<br />
								Unrealized: <span style={{ color: (drawerSubUnrealized >= 0 ? 'limegreen' : 'tomato' ) }}>
									฿{ addCommas(drawerSubUnrealized.toFixed(0)) }
								</span>
							</div>
						</Col>
					</Row>
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
								name="broker"
								label="Broker"
								rules={[{ required: true, message: 'Please enter Broker Name' }]}
							>
								<Input />
							</Form.Item>
						</Col>

						{/* <Col span={12}>
							<Form.Item
								name="symbol"
								label="Symbol"
								rules={[{ required: true, message: 'Please enter Symbol' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}> */}
						<Col span={10}>
							<Form.Item
								name="symbol"
								label="Symbol"
								// initialValue={ this.state.expItems }
							>
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="Select a Symbol"
									optionFilterProp="children"
									defaultValue={symbol}
									// onChange={onChange}
									// onFocus={onFocus}
									// onBlur={onBlur}
									// onSearch={onSearch}
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{symbol}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="vol"
								label="Volumn"
								rules={[{ required: true, message: 'Please enter volumn' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="buy"
								label="Buy"
								rules={[{ required: true, message: 'Please enter buy price' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="sell"
								label="Sell"
								rules={[{ required: true, message: 'Please enter sell price' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="profit"
								label="Profit"
							>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="cdate"
								label="Buy Date" 
								rules={[{ required: true, message: 'Please enter Buy date' }]}
							>
								<DatePicker format={dateFormat} />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="edate"
								label="Sell Date"
							>
								<DatePicker format={dateFormat} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col>
							<Form.Item
								name="note"
								label="Note"
							>
								<TextArea rows={3} />
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

export default Trading
