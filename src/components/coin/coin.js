import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Badge, Button, DatePicker, Drawer, Col, Form, Input, InputNumber, List, PageHeader, 
	Popconfirm, Row, Select, Switch as SwitchAntd, Tooltip
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

import { coinAdd, coinsGet, chartGetCoin, chartLineGetCoin } from '../../services/services';

const Coin = () => {

	const version = '21.06a'
	const dateFormat = 'YYYY-MM-DD'
	const mainColor = 'DarkTurquoise'
	const subColor = 'LightSeaGreen'
	const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
	const [loading, setLoading] = useState(false)
	// const history = useHistory()
	const [coins, setCoin] = useState()
	const [total, setTotal] = useState(0)
	const [visible, setDrawer] = useState(false)
	const [drawerTitle, setDrawerTitle] = useState('Coin')
	const [drawerSubUnrealized, setDrawerSubUnrealized] = useState(0)
	const [numRec, setNumRec] = useState(0)
	const [unrealized, setUnrealized] = useState(true)
	const [viewChartBy, setViewChart] = useState('Monthly')
	const [cData, setCData ] = useState({})
	const [cDataLine, setCDataLine ] = useState({})

	const { Search } = Input
	const { TextArea } = Input
	const { Option } = Select
	const searchRef = React.useRef()
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
		legend: {
			display: true,
			position: 'left'
		}
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

		// console.log("chart - ", o);

		const chartData = await chartGetCoin(o);

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

		const chartData = await chartLineGetCoin(null);

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
						dd[i] += (parseInt(o.minute) / 60)

					}

				}
			})

			out.push({
				label: prop,
				data: dd,
				borderColor: cBorderColor[colorCnt],
				pointBackgroundColor: cBorderColor[colorCnt],
				backgroundColor: cBGColor[colorCnt]
			})

			colorCnt++
		}

		setCDataLine({
			labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
			datasets: out
		})
	} // END: chartLine


	const fetchAll = async (o) => {

		setLoading(true)

		o.filter = unrealized

		const fetchedEntries = await coinsGet(o);

		// console.log(fetchedEntries);
		let tmp = 0

		fetchedEntries.forEach((o) => {

			tmp += (o.sell - o.buy)
			
		})

		setCoin(fetchedEntries);
		setNumRec(fetchedEntries.length)
		setTotal(tmp)
		await chart(o)

		setLoading(false)

	}

	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value,
		})

	}, [])


	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value,
		})

	}, [unrealized])


	const onChange = (o) => {

		let buy = form.getFieldValue().buy
		let sell = form.getFieldValue().sell

		let unrealized = sell > 0 ? sell - buy : 0
		
		setDrawerSubUnrealized(unrealized)
	}


	const onClose = () => {

		setDrawer(false)

	}


	const onDup = (o) => {

		o.id = 0
		o.item = o.name
		o.bdate = moment()
		o.sdate = null

		// console.log(o);

		onFinish(o)

	} // END: onDup


	const onFinish = (o) => {

		onClose()
		// return coinAdd(o)
		let r = coinAdd(o)

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
			Coins <Badge style={{ backgroundColor: subColor }} count={numRec} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}


	const setSubTitle = () => {
		return <div style={{ color: 'lightgray', marginTop: -9, height: 40 }}>
				Total: &nbsp; 
			<span style={{ color: ( total >= 0 ? mainColor : 'tomato' ), fontSize: '1.5em'}}>
				฿{addCommas(total.toFixed(0))}
			</span>
		</div>
	}


	const showDrawer = (o) => {

		if ( o !== null ) {

			setDrawerTitle("Trading (Edit)")
			setDrawerSubUnrealized(o.sell > 0 ? o.sell - o.buy : 0)
			form.setFieldsValue({
				id: o.key,
				item: o.name,
				buy: o.buy,
				sell: o.sell,
				note: o.note,
				bdate: o.bdate !== null ? moment(o.bdate) : null,
				sdate: o.sdate !== null ? moment(o.sdate) : null
			})

		} else {

			setDrawerTitle("New Trading")
			setDrawerSubUnrealized(0)
			form.setFieldsValue({
				id: 0,
				item: '',
				buy: 0,
				sell: 0,
				note: null,
				bdate: moment(),
				sdate: null
			})

		}

		setDrawer(true)	
	}

	const getMargin = (o) => {

		return o.sell > 0 ? "฿" + (o.sell - o.buy).toFixed(0) : "฿" + 0
	}

	const getMarginP = (o) => {

		return o.sell > 0 ? (((o.sell - o.buy) / o.buy ) * 100).toFixed(2) + " %" : 0 + " %"
	}
	
	const getMarginPColor = (o) => {

		return (((o.sell - o.buy) / o.buy ) * 100) > 0 ? 'green' : 'red'

	}



	return(
		<div>

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
				// header={<div>Header</div>}
				// footer={<div>Footer</div>}
				// bordered
				// dataSource={data}
				dataSource={coins}
				renderItem={(item, index) => (
					<List.Item
						actions={[
							<div>
								<div style={{color: getMarginPColor(item)}}>
									{getMargin(item)}
								</div>
								<div style={{color: getMarginPColor(item), fontSize: '0.8em', textAlign: 'right' }}>
									{getMarginP(item)}
								</div>
							</div>,
							<span>
								<Tooltip title={(item.bdate !== null ? moment(item.bdate).format('DD MMM YYYY') : moment(item.cdate).format('DD MMM YYYY')) }>
									{(item.sdate !== null ? moment(item.bdate).fromNow() : <span style={{fontSize: '0.8em'}}>Buy {moment(item.bdate).fromNow()}</span>)}
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
								icon={<EditOutlined />}
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
							title={item.name}
							description={"฿" + addCommas(item.buy)} 
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
					name="coin"
					form={form}
					// ref={formRef}
					layout="vertical"
					// hideRequiredMark 
					onFinish={onFinish}
					onValuesChange={onChange}
				>
					<Row gutter={16}>
						<Col>
							<div style={{ height: 30, color: 'lightgray' }}>
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
						<Col>
							<Form.Item
								name="item"
								label="Coin"
								rules={[{ required: true, message: 'Please enter Coin' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="buy"
								label="Buy"
								rules={[{ required: true, message: 'Please enter buy volumn' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="sell"
								label="Sell"
								rules={[{ required: true, message: 'Please enter sell volumn' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="bdate"
								label="Buy Date" 
								rules={[{ required: true, message: 'Please enter Buy date' }]}
							>
								<DatePicker format={dateFormat} />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="sdate"
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
								<TextArea rows={4} />
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
		</div>
	)
}

export default Coin
