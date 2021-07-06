import React, { useState, useEffect } from 'react';
import {
	Badge, Col, Input, PageHeader,
	Row, Select, Switch as SwitchAntd
} from 'antd'
import {
	CopyOutlined,
	RightOutlined,
	PlusOutlined,
	BgColorsOutlined
} from '@ant-design/icons';

import moment from 'moment'
import { Doughnut, Line } from 'react-chartjs-2'
import './kmm.css'

import { exportsGet, get } from '../../services/services';

const mm = require('./Tasks.json')

const Export = () => {

	const version = '21.06a'
	const mainColor = 'hotPink'
	const subColor = 'mediumVioletRed'
	const [num, setNum] = useState(0)
	const [htmlContent, setHTML] = useState('')
	const { Search } = Input
	const { Option } = Select
	const searchRef = React.useRef()
	const [unrealized, setUnrealized] = useState(true)
	const [viewChartBy, setViewChart] = useState('Monthly')
	const [cData, setCData ] = useState({})
	const [cDataLine, setCDataLine ] = useState({})
	const cBorderColor = [
		'paleGreen', 'limeGreen', 'forestGreen', 'yellowGreen', 'teal', 
		'dodgerBlue', 'cornFlowerBlue', 'RoyalBlue', 'deepSkyBlue',
		'hotPink', 'deepPink', 'lightPink', 'tomato', 'orange', 'salmon', 'Coral',
		'darkTurquoise', 'MediumOrchid', 'SlateBlue', 
		'Indigo', 'DarkMagenta', 'Purple', 'RebeccaPurple'
	]
	const newmm = []
	const datePattern = /^\d{4}-\d{2}-\d{2}$/

	var cOptLine = {
		title: {
			display: true,
			text: 'Monthly',
			position: 'left'
		},
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: false,
			position: 'left'
		}
	}

	var cOpt = {
		legend: {
			display: true,
			position: 'left'
		}
	}

	var html = []
	var arr = []
	var gRes = []
	var dateColor = ''


	const chart = (o) => {

		console.log("kmm - chart :", o)

		let labels = []
		let datas = []
		let colors = []
		const storyTmp = []
		const dataTmp = []

		// Regroup with Story
		for ( const prop in o[0].data ) {

			o[0].data[prop].forEach((o) => {

				storyTmp.push({story: o.story, value: o.value})

			})

		}

		// Grouping Story
		const story = storyTmp.reduce((r, a) => {
			r[a.story] = [...r[a.story] || [], a];
			return r;
		}, {})

		// Sum value in array
		for ( const prop in story ) {

			let amt = 0

			story[prop].forEach((o) => {

				amt += parseFloat(o.value)

			})

			dataTmp.push({story: prop, value: amt})
		}

		dataTmp.sort((a,b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0))

		dataTmp.forEach((o, i) => {

			if ( i < 10 ) {

				labels.push(o.story)
				datas.push(o.value)
				colors.push(cBorderColor[i])

			}
			
		})

		setCData({
			labels: labels,
			datasets: [
				{
					label: 'Things',
					data: datas,
					backgroundColor: colors
				}
			]
		})

	} // END: chart


	const chartLine = (o) => {

		console.log("kmm - line :", o)

		const out = []
		let dd = []
		let labs = []
		let color = 0 

		if ( viewChartBy == 'Yearly' ) {

			labs = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]

			o.forEach((o) => {
				dd.push(parseInt(o.profit))
			})

		} else {

			labs = [
				'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
				'11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
				'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' 
			]

			for ( const prop in o[0].data ) {

				if ( prop == "Projects" || prop == "Pomodoro" ) { continue }

				let dd = [
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

				o[0].data[prop].forEach((o) => {

					// console.log(o);

					for ( let i = 1; i < 31; i++ ) {

						if ( parseInt((o.id.trim()).substr(9,2)) == i ) {

							// console.log(o.name, o.id + " : dd[", i, "] = ", o.value)
							// dd[i-1] += (parseInt(o.value) / 60)
							dd[i-1] += parseFloat(o.value)

						}
					}
				})

				color = getColor(prop)

				out.push({
					label: prop.replace(/<br>+$/,''),
					data: dd,
					borderColor: cBorderColor[color],
					pointBackgroundColor: cBorderColor[color],
					// backgroundColor: cBGColor[colorCnt]
					backgroundColor: 'whiteSmoke'
				})
			}
		}

		setCDataLine({
			labels: labs,
			datasets: out
		})

	} // END: chartLine


	const fetchAll = async (o) => {

		// setLoading(true)

		// const fetchedEntries = await exportsGet(o);
		// setNum(fetchedEntries.length)
		const newmm = JSON.parse(JSON.stringify(mm))
		listContent(newmm, o.keyword)

		// setLoading(false)
	}



	const findNode = (o, path) => {

		const isLastLevel = !o.children

		if ( isLastLevel ) {

			path += o.text + ', '

			if ( o.value !== undefined && o.value !== null && o.value != "sum" ) {
				path += o.value
			}

			if ( o.value === undefined && o.text.match(datePattern) ) {
				path += 0
			}

		} else { 

			path += o.text + ', '

			if ( o.value !== undefined && o.value !== null && o.value != "sum" ) {
				path += o.value + ', '
			}

			if ( o.value === undefined && o.text.match(datePattern) ) {
				path += 0 + ', '
			}
		}


		if (o.children) {

			o.children.forEach(oo => {

				findNode(oo, path);

			});

		}

		if (isLastLevel) { gRes.push(path) }

	} // END: findNode


	const getColor = (o) => {

		switch (o.replace(/<br>+$/,'')) {
			case 'Administrator':
				return 0
				break;
			case 'Core Responsibilities':
				return 7 
				break;
			case 'Free Time':
				return 1
				break;
			case 'Personal Growth':
				return 9 
				break;
			case 'Stock':
				return 11 
				break;
		}
	}


	const listChartData = (keyword) => {

		// const period = viewChartBy == "Monthly" ? moment().format('YYYY-MM') : moment().format('YYYY')
		let period = moment().format('YYYY-MM')
		let periodPos = 8

		if ( viewChartBy != "Monthly" ) {

			period = moment().format('YYYY')
			periodPos = 4

		}

		const mmChart = JSON.parse(JSON.stringify([mm.root]))
		loadFilter(mmChart, keyword)

		// Get text path
		gRes = []
		findNode(mmChart[0], '')

		// Convert to array
		let ddArr = []
		gRes.forEach(o => { ddArr.push(o.split(',')); });

		// console.log(ddArr);

		// Calculate something
		let res2

		switch (keyword) {
			case 'daytrade':
				res2 = genDaytrade(ddArr, period, periodPos)
				break;

			case 'pomodoro':
				res2 = genPomodoro(ddArr, period, periodPos)

				break;

			case 'token':
				break;
		
			default:
				break;
		}

		// Grouping
		const res1 = Object.values(res2.reduce((r, o) => (r[o.id]
			? (r[o.id].value += o.value)
			: (r[o.id] = {...o}), r), {}));

		res1.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))

		// console.log(JSON.stringify(res1,null,2))

		return res1

	} // END: listChartData


	const listContent = async(o, keyword) => {
	
		// var content = `<span style="color: tomato" }}>` + o.root.text + `</span>`
		var content = ""

		arr = []
		arr.push(o.root)

		loadFilter(arr, keyword)

		await arr.forEach((o) => {
			let item = o
			o = recursiveSum(item)
		});

		html = []
		setHTML('')

		loadList(arr)

		content += html.join('')
		setHTML(content)

	} // END: listContent


	const loadFilter = (oo, keyword) => {

		oo.forEach((o,i) => {
			let item = o
			oo[i] = searchTree(item, keyword)
		})

		const resultItems = oo.filter(item => item !== undefined && item !== null )
		// console.log(JSON.stringify(resultItems, null, 2))

	} // END: loadFilter


	const loadList = (o) => {

		// http://jsfiddle.net/charlietfl/pCsZ3/

		html.push("<ul>");

		// const datePattern = /^\d{4}-\d{2}-\d{2}$/

		o.forEach((oo) => {

			let name = oo.text.replace(/<br>+$/,'')

			if ( name.match(datePattern) !== null ) {

				name = moment(name + "T00:00Z").fromNow()
				dateColor = 'c-gray f-080'

			} else {

				dateColor = ''

			}

			html.push("<li><span title='" + oo.text + "' class='" + dateColor + "'>" + name + '</span>');

			if ( oo.value ) {

				if ( oo.value != "sum" ) {
					// html.push("<span style='color:gray; font-size:0.8em'> (<span style='color: deepskyblue'>" + (parseInt(oo.value) / 60).toFixed(2) + "</span>h)</span>")
					// html.push("<span style='color:gray; font-size:0.8em'> (<span style='color: deepskyblue'>" + (parseFloat(oo.value)).toFixed(2) + "</span>)</span>")
					html.push("<span style='color:gray; font-size:0.8em'> (<span style='color: deepskyblue'>" + oo.value + "</span>)</span>")
				}
			}

			if ( oo.children ) {
				loadList(oo.children)
			}

			html.push('</li>');
		})

		html.push('</ul>');
			
	} // END: loadList


	const genDaytrade = (o, period, periodPos) => {

		const res = []
		const dt = []
		let labels = ['Stock']
		let idPos = 5
		let valuePos = 6
		let datePos = 5

		o.forEach(o => {

			// let value = o[valuePos].split('|')

			// By Symbol
			// res2.push({id: o[3], value: (parseFloat(value[0]) * parseFloat(value[1])) })

			// By Sell Date

			if ( period == o[datePos].substring(0, periodPos).trim() ) {

				// console.log(o[3], o[o.length-2], o[o.length-1])
				dt.push({name: 'Stock', story: o[3], id: o[datePos], value: parseFloat(o[valuePos]) })

			}
			
		});

		const group = dt.reduce((r, a) => {
			r[a.name] = [...r[a.name] || [], a];
			return r;
		}, {})

		// console.log("gendaytrade: group - ", group);

		res.push({label: labels, data: group })

		return res

	} // END: genDaytrade


	const genPomodoro = (o, period, periodPos) => {

		const res = []
		const dt = []
		const labels = ['Administration', 'Core Responsibilities', 'Free Time', 'Personal Growth']


		o.forEach(o => {

			if ( period == o[o.length-2].substring(0, periodPos).trim() ) {

				// console.log(o[2], o[o.length-2], o[o.length-1])
				dt.push({name: o[2].trim(), story: o[3].trim(), id: o[o.length-2], value: parseFloat(o[o.length-1]) })

			}
		});

		const group = dt.reduce((r, a) => {
			r[a.name] = [...r[a.name] || [], a];
			return r;
		}, {})

		res.push({label: labels, data: group })

		return res

	} // END: genPomodoro


	const recursiveSum = (item) => {

		if ( item === undefined ) { return item }

		item.value = item.value === undefined ? item.value = 'sum' : item.value

		if(item.value === 'sum' ) {

			if(item.children === undefined || item.children === null || item.children.length === 0){

				item.value = 0
				return item

			} else {

				let sum = 0

				for(let i=0; i<item.children.length; i++){

					let child = item.children[i]

					if(child.value !== 'sum'){

						// In case of no value field
						if ( ! child.value ) { child.value = 0 }

						sum += parseInt(child.value) 

					} else {

						child = recursiveSum(child)
						sum += parseInt(child.value) 

					}
				}

				item.value = sum

				return item
			}
		} else {

			return item

		}
	} // END: recursiveSum


	const searchTree = (item, matchingText) => {

		item.text = ( item.text === undefined ) ? "" : item.text
		matchingText = ( matchingText === undefined ) ? "" : matchingText

		let name = item.text.replace(/<br>+$/,'').toLowerCase()

		// console.log(name, ">", name.search(matchingText.toLowerCase()))

		// if( name === matchingText) {
		if( name.search(matchingText.toLowerCase()) > -1 ) {
			// item.text = name
			return item
		} else {

			const children = item.children

			if(children !== undefined && children !== null && children.length > 0) {

				const matchingChildren = []

				for(let i=0; i<children.length; i++){

					let child = children[i]
					child = searchTree(child, matchingText)

					if(child !== undefined) {
						matchingChildren.push(child)
					}
				}

				if(matchingChildren.length > 0){

					item.children = matchingChildren
					return item

				}
			} else {
				return undefined
			}
		}
	} // END: searchTree


	const onRealized = (e) => {

		setUnrealized(e)

	} // END: onRealized


	const onSearch = (e) => {

		fetchAll({
			keyword: e
		})

	} // END: onSearch


	const onViewChart = (e) => {

		chartLine(listChartData(e))
		// console.log(e);
		// setViewChart(e)

	} // END: onViewChart


	const onViewType = (e) => {

		chart(listChartData(e))
		chartLine(listChartData(e))
		// console.log(e);
		// setViewChart(e)

	} // END: onViewType


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			kMM<Badge style={{ backgroundColor: subColor }} count={num} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}


	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value
		})

	}, [])


	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value,
		})

	}, [unrealized])


	useEffect(() => {

		// chartLine(viewChartBy)

	}, [viewChartBy])



	

	return(
		<>
			<PageHeader
				ghost={true}
				title={setTitle()}
				subTitle=""
				style={{ position: 'sticky', top: 0,
					backgroundColor: 'white',
					zIndex: 1,
					width: '100%'
				}}
				extra={[
					<Search
						placeholder="Search..."
						ref={searchRef}
						allowClear
						defaultValue={moment().format('YYYY-MM-DD')}
						onSearch={onSearch}
						style={{ width: 200, margin: "0 15px 0 0" }}
					/>,
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
					<Select
						defaultValue="Pomodoro"
						style={{ width: 200 }}
						placeholder="Select a Chart Type"
						onSelect={(e) => { onViewType(e) }}
					>
						<Option value='all'>All</Option>
						<Option value='pomodoro'>Pomodoro</Option>
						<Option value='daytrade'>Daytrade</Option>
						<Option value='token'>Token</Option>
					</Select>
				]}
			>
			</PageHeader>
				<Row gutter={6}>
					<Col span={13}>
						<div dangerouslySetInnerHTML={{__html: htmlContent }} />
					</Col>
					<Col span={9}>
						<Line data={cDataLine} options={cOptLine} />
						<Doughnut data={cData} options={cOpt} />
					</Col>
				</Row>
		</>

	)
}

export default Export
