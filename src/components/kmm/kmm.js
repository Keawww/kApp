import React, { useState, useEffect } from 'react';
import {
	Badge, Input, PageHeader,
	Select, Tree
} from 'antd'
import {
	CopyOutlined,
	RightOutlined,
	PlusOutlined
} from '@ant-design/icons';

import moment from 'moment'

import { exportsGet } from '../../services/services';

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
	const newmm = []

	const fetchAll = async (o) => {

		// setLoading(true)

		// const fetchedEntries = await exportsGet(o);
		// setNum(fetchedEntries.length)
		const newmm = JSON.parse(JSON.stringify(mm))
		listContent(newmm, o.keyword)

		// setLoading(false)
	}


	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value
		})

	}, [])


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			kMM<Badge style={{ backgroundColor: subColor }} count={num} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	var html = []
	var after = []
	var result = [];
	var arr = [];


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

	}


	const loadFilter = (oo, keyword) => {

		oo.forEach((o,i) => {
			let item = o
			oo[i] = searchTree(item, keyword)
		})

		const resultItems = oo.filter(item => item !== undefined && item !== null )
		
		// console.log(JSON.stringify(resultItems, null, 2))
	}


	const searchTree = (item, matchingText) => {

		item.text = ( item.text === undefined ) ? "" : item.text
		matchingText = ( matchingText === undefined ) ? "" : matchingText

		let name = item.text.replace(/<br>+$/,'').toLowerCase()

		// console.log(name, ">", name.search(matchingText.toLowerCase()))

		// if( name === matchingText) {
		if( name.search(matchingText.toLowerCase()) > -1 ) {
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
	}
	

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



	const loadList = (o) => {

		// http://jsfiddle.net/charlietfl/pCsZ3/

		html.push("<ul>");

		o.forEach((oo) => {

			let name = oo.text.replace(/<br>+$/,'')
			html.push('<li>' + name);

			if ( oo.value ) {
				html.push("<span style='color:gray; font-size:0.8em'> (<span style='color: deepskyblue'>" + (parseInt(oo.value) / 60).toFixed(2) + "</span>h)</span>")
			}

			if ( oo.children ) {
				loadList(oo.children)
			}

			html.push('</li>');
		})

		html.push('</ul>');
			
	} // END: loadList


	const onSearch = (e) => {

		fetchAll({
			keyword: e
		})

	} // END: onSearch


	return(
		<>
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
					<Search
						placeholder="Search..."
						ref={searchRef}
						allowClear
						onSearch={onSearch}
						style={{ width: 200, margin: "0 15px 0 0" }}
					/>,
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
						<Option value='all'>All</Option>
						<Option value='pomodoro'>Pomodoro</Option>
						<Option value='trading'>Trading</Option>
						<Option value='token'>Token</Option>
					</Select>
				]}
			>

     		<div dangerouslySetInnerHTML={{__html: htmlContent }} />

			</PageHeader>
		</div>

{/* <Tree treeData={tt} /> */}
{/* <Tree treeData={after} /> */}
		</>

	)
}

export default Export
