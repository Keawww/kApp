import React, { useState, useEffect } from 'react';
import {
	Badge,
	PageHeader, Select
} from 'antd'
import {
	CopyOutlined,
	RightOutlined,
	PlusOutlined
} from '@ant-design/icons';

import moment from 'moment'

import { exportsGet } from '../../services/services';

const Export = () => {

	const version = '21.06a'
	// var moment = require('moment-timezone');
	const mainColor = 'Tomato'
	const subColor = 'coral'
	const [loading, setLoading] = useState(false)
	const [num, setNum] = useState(0)
	const [htmlContent, setHTML] = useState('')
	const { Option } = Select


	const fetchAll = async (o) => {

		setLoading(true)

		const fetchedEntries = await exportsGet(o);
		setNum(fetchedEntries.length)
		listContent(o, fetchedEntries)

		setLoading(false)
	}



	useEffect(() => {

		// fetchAll({ keyword: 'pomodoro' })
		fetchAll('coins')

	}, [])


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			Export SQL <Badge style={{ backgroundColor: subColor }} count={num} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	const listContent = async(n, o) => {

		var content = ' \
			INSERT INTO <span style="color: tomato" }}>' + n + '</span> ( <br> \
		'

		switch (n) {
			case 'coin_invest':
				content +=  ' \
					_id, cdate, buy, usdt, usdt_th, flag \
					VALUES ( <br> \
				'

				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.buy + ", " +
						oo.usdt + ", " +
						oo.usdt_th + ", '" +
						oo.flag + 
					"' ),<br>"
				})
				break;


			case 'coins':
				content +=  ' \
					_id, name, buy, sell, note, bdate, sdate, cuid, uuid, flag \
					VALUES ( <br> \
				'

				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						oo.name + "', " +
						oo.buy + ", " +
						oo.sell + ", '" +
						oo.note + "', '" +
						moment(oo.bdate).format('YYYY-MM-DD HH:mm:ss') + "', '" +
						moment(oo.sdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.cuid + ", " +
						oo.uuid + ", '" +
						oo.flag + 
					"' ),<br>"
				})
				break;

			case 'exp':
				content +=  ' \
					_id, amount, note, mileage, price, aged, cdate, udate, edate, cuid, uuid, item_id, flag \
					VALUES ( <br> \
				'

				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", " +
						oo.amount + ", '" +
						oo.note + "', " +
						oo.mileage + ", " +
						oo.price + ", " +
						oo.aged + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', '" +
						moment(oo.udate).format('YYYY-MM-DD HH:mm:ss') + "', '" +
						moment(oo.edate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.cuid + ", " +
						oo.uuid + ", " +
						oo.item_id + ", '" +
						oo.flag + 
					"' ),<br>"
				})
				break;

			case 'coin_invest':
				content +=  ' \
					_id, cdate, buy, usdt, usdt_th, flag \
					VALUES ( <br> \
				'

				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.buy + ", " +
						oo.usdt + ", " +
						oo.usdt_th + ", '" +
						oo.flag + 
					"' ),<br>"
				})
				break;

			case 'invest':
				content +=  ' \
					_id, name, broker, type, amount, cdate, flag \
					VALUES ( <br> \
				'


				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						oo.name + "', '" +
						oo.broker + "', '" +
						oo.type + "', " +
						oo.amount + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.flag + 
					"' ),<br>"
				})
				break;
						
			case 'pomodoro':
				content +=  ' \
						_id, type, project, story, task, subtask, minute, cdate, flag <br> \
					VALUES ( <br> \
				'
				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						oo.type + "', '" +
						oo.project + "', '" +
						oo.story + "', '" +
						oo.task + "', '" +
						oo.subtask + "', " +
						oo.minute + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.flag + 
					"' ),<br>"
				})
				break;

			case 'tradings':
				content +=  ` 
					_id, broker, symbol, vol, buy, sell, cdate, edate, profit, note, flag <br />
					VALUES ( <br>
				`

				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						oo.broker + "', " +
						oo.symbol + ", " +
						oo.vol + ", " +
						oo.buy + ", " +
						oo.sell + ", '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', " +
						oo.profit + ", '" +
						oo.note + "', '" +
						oo.flag + 
					"' ),<br>"
				})
				break;

			case 'tok':
				content +=  ` 
					_id, cdate, girl, place, note, flag <br />
					VALUES ( <br>
				`
				await o.forEach((oo) => {
					content += "( " +
						oo._id + ", '" +
						// moment.tz(oo.cdate, 'Asia/Bangkok') + "', '" +
						moment(oo.cdate).format('YYYY-MM-DD HH:mm:ss') + "', '" +
						// oo.cdate + "', '" +
						oo.girl + "',' " +
						oo.place + "',' " +
						oo.note + "', '" +
						oo.flag + 
					"' ),<br>"
				})
				break;
		
			default:
				break;
		}

		setHTML(content)

	}


	return(
		<div>
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
					<Select
						showSearch
						style={{ width: 200 }}
						placeholder="Select a table"
						onChange={fetchAll}
						optionFilterProp="children"
						// defaultValue={tables}
						filterOption={(input, option) =>
							option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						<Option value='coin_invest'>coin_invest</Option>
						<Option value='coins'>coins</Option>
						<Option value='exp'>exp</Option>
						<Option value='exp_item'>exp_item</Option>
						<Option value='invest'>invest</Option>
						<Option value='pomodoro'>pomodoro</Option>
						<Option value='symbol'>symbol</Option>
						<Option value='tok'>tok</Option>
						<Option value='tradings'>tradings</Option>
					</Select>
				]}
			>

     		<div dangerouslySetInnerHTML={{__html: htmlContent }} />

			</PageHeader>
		</div>
	)
}

export default Export
