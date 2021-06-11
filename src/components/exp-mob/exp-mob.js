import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Badge, Button, DatePicker, Drawer, Col, Form, Input, InputNumber, List,
	PageHeader, Popconfirm,
	Radio, Row, Select, Tooltip
} from 'antd'
import {
	CopyOutlined,
	EditOutlined,
	PlusOutlined
} from '@ant-design/icons';

import moment from 'moment'

import { exp2DB, expsGet, expCatGet } from '../../services/services';

const ExpMob = () => {

	const version = '21.06a'
	const dateFormat = 'YYYY-MM-DD'
	const mainColor = 'limeGreen'
	const subColor = 'forestGreen'
	const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
	const [exps, setExp] = useState()
	const [numRec, setNumRec] = useState(0)
	const [loading, setLoading] = useState(false)
	const [visible, setDrawer] = useState(false)
	const [total, setTotal] = useState(0)
	const [period, setPeriod] = useState(2)
	const [cat, setCat] = useState()
	const [drawerTitle, setDrawerTitle] = useState('Exp')
	const [cData, setCData ] = useState({})
	const [cDataLine, setCDataLine ] = useState({})
	const [cDataBar, setCDataBar ] = useState({})

	const { Search } = Input
	const { TextArea } = Input
	const { Option } = Select
	// const searchRef = React.createRef()
	const searchRef = React.useRef()
	const [form] = Form.useForm()
	const cBorderColor = [
		'paleGreen', 'limeGreen', 'forestGreen', 'yellowGreen', 'teal', 
		'dodgerBlue', 'cornFlowerBlue', 'RoyalBlue', 'deepSkyBlue',
		'hotPink', 'deepPink', 'lightPink', 'tomato', 'orange', 'salmon',
		'darkTurquoise', 'MediumOrchid', 'SlateBlue', 
		'Indigo', 'DarkMagenta', 'Purple', 'RebeccaPurple'
	]
	const cBGColor = [
		'rgba(211, 211, 211, 0.1)',
		'rgba(255, 105, 180, 0.1)',
		'rgba(152, 251, 152, 0.1)',
		'rgba(100, 149, 237, 0.1)'
	]


	const fetchAll = async (o) => {

		setLoading(true)

		const fetchedEntries = await expsGet(o);

		// console.log( fetchedEntries )

		let tmp = 0

		fetchedEntries.forEach((o) => {

			tmp += parseInt(o.amount)
			
		})

		setTotal(tmp)
		setExp(fetchedEntries)
		setNumRec(fetchedEntries.length)

		setLoading(false)
	}


	useEffect(() => {

		loadExpCat()

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


	const loadExpCat = ()  => {

		expCatGet().then(res => {

			let ops = []

			res.forEach((o) => {
				ops.push(<Option value={o._id}>{o.name}</Option>)
			})

			setCat(ops)

		})
		.catch((error) => {
			console.log(error)
		})
	} // END: loadExpCat


	const onChangePeriod = (e) => {
		setPeriod(e.target.value)
	};


	const onClose = () => {

		setDrawer(false)

	}

	const onDup = (o) => {

		o.id = 0
		o.cat = o.item_id
		o.cdate = moment()
		o.edate = null
		o.flag = '1'

		// console.log("ondup", o);

		onFinish(o)

	} // END: onDup


	const onFinish = async (o) => {

		onClose()

		let k = searchRef.current === null ? '' : searchRef.current.state.value

		// console.log("onfinish >", o);

		const tmp = await exp2DB(o)

		fetchAll({
			period: period,
			keyword: searchRef.current.state.value,
			filter: 'active'
		})

	}

	const onSearch = (e) => {

		fetchAll({
			period: period,
			keyword: e,
			filter: 'all'
		})

	}
	

	const setDesc = (amount, note) => {
		return <span>฿ {addCommas(amount) }
			<div style={{color: 'palegreen' }}>
				{ note }
			</div>
		</span>
	}


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			Expense <Badge style={{ backgroundColor: subColor }} count={numRec} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
			<div style={{ color: 'lightgray', fontSize: '.5em', fontWeight: 'normal' }}>
				Total: &nbsp; 
				<span style={{ color: mainColor }}>
					฿{addCommas(total.toFixed(0))}
				</span>
			</div>
		</span>
	}

	const showDrawer = (o) => {

		// console.log("showDrawer: ", o);

		if ( o !== null ) {

			setDrawerTitle("Exp (Edit)")
			form.setFieldsValue({
				id: o._id,
				cat: o.item_id,
				amount: o.amount,
				cdate: o.cdate !== null ? moment(o.cdate) : null,
				edate: o.edate !== null ? moment(o.cdate) : null,
				price: o.price,
				mileage: o.mileage,
				note: o.note
			})

		} else {

			setDrawerTitle("New Exp")
			form.setFieldsValue({
				id: 0,
				item_id: 0,
				amount: 0,
				cdate: moment(),
				edate: null,
				price: 0,
				mileage: 0,
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
				title={setTitle()}
				// subTitle={setSubTitle()}
				style={{ position: 'sticky', top: 0,
					backgroundColor: 'white',
					zIndex: 1,
					width: '100%'
				}}
				extra={[
					<div>
						<div style={{ marginBottom: 10 }}>
							<Radio.Group onChange={onChangePeriod} initialValue={2} value={period}>
								<Radio value={1}>Today</Radio>
								<Radio value={2}>Month</Radio>
								<Radio value={3}>All</Radio>
							</Radio.Group>
						</div>
						<Search
							placeholder="Search..."
							ref={searchRef}
							allowClear
							onSearch={onSearch}
							style={{ width: 200, margin: "0 15px 0 0" }}
						/>
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
					</div>
				]}
			>
			</PageHeader>

			<List
				size="small"
				// header={<div>Header</div>}
				// footer={<div>Footer</div>}
				// bordered
				// dataSource={data}
				loading={loading}
				dataSource={exps}
				renderItem={(item, index) => (
					<List.Item
						actions={[
							<div>
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
								</Tooltip>
								<Button type="dash"
									shape="circle"
									icon={<EditOutlined />}
									size={38}
									onClick={() => showDrawer(item)}
									style={{ marginLeft: 10 }}
								/>
								<div style={{ fontSize: '.8em', marginTop: 5 }}>
									<Tooltip title={item.cdate !== null ? moment(item.cdate).format('DD MMM YYYY') : '' }>
										{item.cdate !== null ? moment(item.cdate).fromNow() : ''}
									</Tooltip>
								</div>
							</div>
						]}
					>
						<List.Item.Meta
							// avatar={<Avatar src={} />}	
							title={item.item}
							description={
								setDesc(item.amount, item.note)
							}
						/>
					</List.Item>
				)}
			/>



			<Drawer
				title={drawerTitle}
				width={300}
				onClose={onClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				destroyOnClose={true}
			>
				<Form
					name="exp"
					form={form}
					// ref={formRef}
					layout="vertical"
					// hideRequiredMark 
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
								name="cat"
								label="Categories"
								// initialValue={ this.state.expItems }
							>
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="Select a Categories"
									optionFilterProp="children"
									// defaultValue={cat}
									// onChange={onChange}
									// onFocus={onFocus}
									// onBlur={onBlur}
									// onSearch={onSearch}
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{cat}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={14}>
							<Form.Item
								name="cdate"
								label="Date" 
								rules={[{ required: true, message: 'Please enter date' }]}
							>
								<DatePicker format={dateFormat} />
							</Form.Item>
						</Col>
						<Col span={14}>
							<Form.Item
								name="edate"
								label="Expire Date" 
							>
								<DatePicker format={dateFormat} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="amount"
								label="Amount"
								rules={[{ required: true, message: 'Please enter amount' }]}
							>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={10}>
							<Form.Item
								name="price"
								label="Price"
							>
								<InputNumber />
							</Form.Item>
						</Col>

						<Col span={10}>
							<Form.Item
								name="mileage"
								label="Mileage"
							>
								<InputNumber />
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
						<Col span={18} offset={8}>
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

export default ExpMob
