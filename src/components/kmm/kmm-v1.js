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
	// const [loading, setLoading] = useState(false)
	const [num, setNum] = useState(0)
	const [htmlContent, setHTML] = useState('')
	const { Search } = Input
	const { Option } = Select
	const searchRef = React.useRef()

	const fetchAll = async (o) => {

		// setLoading(true)

		// const fetchedEntries = await exportsGet(o);
		// setNum(fetchedEntries.length)
		listContent(mm, o.keyword)

		// setLoading(false)
	}



	useEffect(() => {

		fetchAll({
			keyword: searchRef.current.state.value
		})

	}, [])


	const setTitle = () => {
		return <span style={{ color: mainColor, fontSize: '1.5em' }}>
			TEST<Badge style={{ backgroundColor: subColor }} count={num} overflowCount={999} />
			<div style={{ color: 'lightgray', fontSize: '0.4em', fontWeight: 'normal', marginTop: -15 }}>
				{ version }
			</div>
		</span>
	}

	var html = []
	var after = []
	var result = [];


	const listContent = async(o, keyword) => {

		var content = `<span style="color: tomato" }}>` + o.root.text + `</span>`

		// let arr = o.root.children
		let arr = []
		console.log("Initial: ", arr );
		arr.push(o.root.children[3])
		console.log("Read: ", o.root.children[3] );


		await arr.forEach((o) => {
			let item = o
			o = recursiveSum(item)
		});

		loadList(arr)
		// loadList(items)

		// findName(items[0], '', keyword)
		
		// loadFilter(items, keyword)
		console.log("Before Filter: ", arr );
		loadFilter(arr, keyword)

		// console.log( searchName(items[0]) )
		// console.log( searchTree1(arr[0], 'Report on React') )

		// WORK
		// console.log(JSON.stringify(search(items, "Access Google"),null, 2));
		// console.log(JSON.stringify(search(items, keyword),null, 2));


		// console.log(JSON.stringify(cleanEmpty(items[0], keyword),null, 2));


	  	// delKeys(items, keyword)
		// console.log(JSON.stringify(items,null, 2));

		
		// WORK
		// deleteItems(items, ids)
		// console.log(JSON.stringify(items,null, 2));

		// WORK
		// removeZero(items)
		// console.log(JSON.stringify(items,null, 2));


		// after.push(JSON.parse(JSON.stringify(arr[0]).split('"id":').join('"key":')))
		// arr = after
		// after = []
		// after.push(JSON.parse(JSON.stringify(arr[0]).split('"text":').join('"title":')))

		content += html.join('')
		// console.log(arr);
		// console.log(after);
		// console.log(tt);

		setHTML(content)

	}


	const loadFilter = (oo, keyword) => {

		let cloneItems = oo

		cloneItems.forEach((o,i) => {
			let item = o
			cloneItems[i] = searchTree(item, keyword)
		})

		console.log(cloneItems)

		const resultItems = cloneItems.filter(item => item !== undefined && item !== null )
		
		console.log(JSON.stringify(resultItems, null, 2))
	}


	const searchTree = (item, matchingText) => {

		matchingText = ( matchingText === undefined ) ? "" : matchingText

		let name = item.text.replace(/<br>+$/,'').toLowerCase()

		// if( name === matchingText) {
		if( name.search(matchingText.toLowerCase()) > 0 ) {
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
	





	var ids = [4,5]

	const deleteItems = (array, ids) => {
		var i = array.length;
		while (i--) {

			if (ids.indexOf(array[i].id) !== -1) {

				array.splice(i, 1);
				continue;
			}

			array[i].children && deleteItems(array[i].children, ids);
		}
	}



	  const removeZero = (showlist) => {
		if (typeof showlist == "object") {
			   // If showList is an object, traverse the showlist
		  for (let i = 0; i < showlist.length; i++) {
			let element = showlist[i]

			if (element.checked == 0) {
			  showlist.splice(i, 1)
					   // Note that after deleting an item, index -1
			  i--
			} else {
					   // Traverse its child nodes
			  removeZero(element.children)
			}
		  }
		} else {
			   // End if the child node does not exist
		  return
		}
	  }
	   
	


	const items = [
		{ 
			id: 1,
			text: 'Youtube',
			value: 'sum',
			checked: 1,
			children: [
				{
					id: 2,
					text: 'Investment',
					value: 'sum',
					checked: 1,
					children: [
						{
							id: 3,
							text: 'ySocial',
							value: 'sum',
							checked: 1,
							children: [
								{
									id: 4,
									text: '2021-06-22',
									checked: 0,
									value: '15'
								},
								{
									id: 5,
									checked: 1,
									text: '2021-06-23',
									value: '45'
								}
							]
						},
						{
							id: 6,
							text: 'Money Hero',
							value: 'sum',
							checked: 1,
							children: [
								{
									id: 7,
									text: '2021-06-21',
									checked: 0,
									value: '30'
								},
								{
									id: 8,
									text: '2021-06-23',
									checked: 1,
									value: '30'
								},
								{
									id: 9,
									text: '2021-06-27',
									checked: 0,
									value: '30'
								}
							]
						}
					]
				}
			]
		}
	]




	const x = {
		"applicant": {
		  'first_name': null,
		  'last_name': null,
		  'employment_type': null
		},
		'phone': 1123123,
		'branch': null,
		'industry': {
		  'id': 1,
		  'name': null
		},
		"status": "333"
	  }
	  

	  const isEmpty = (obj) => {

		for(var key in obj) return false;

		return true

	  }
	  


	  const delKeys = (app, keyword) => {

		for(var key in app){

		  if(app[key] !== keyword && typeof(app[key]) === 'object'){

			delKeys(app[key], keyword)

			if(isEmpty(app[key])) {
			  delete app[key]
			}

		  } 

		  	if ( keyword != "" && keyword !== undefined ) {

				if( app[key] == keyword ) {
					console.log(app);
					delete app[key]
					delete app['id']
					delete app['value']
					delete app['children']
				}
			}
		}
	  }
	  
	  



	const cleanEmpty = (obj, keyword) => {
		if (Array.isArray(obj)) { 

		  return obj
			  .map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
			  .filter(v => !(v.text == keyword)); 

		} else { 

		  return Object.entries(obj)
			  .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
			  .reduce((a, [k, v]) => (v.text == keyword ? a : (a[k]=v, a)), {});

		} 
	  }


	const search = (nodes, value) => {

		var result;

		value = ( value === undefined ) ? "" : value
	
		nodes.some(o => {

			var children;
			let name = o.text.replace(/<br>+$/,'').toLowerCase()

			// console.log(name, " = ", value);

			if ( name.search(value.toLowerCase()) > 0 ) {
				// return result = o;
				// result = Object.assign({}, o, { children });
				result = o
			}

			if (o.children && (children = search(o.children, value))) {
				return result = Object.assign({}, o, { children });
			}
		});
	
		return result && [result];
	}
	
	

	const searchName = (o) => {

		var stack = [], node
		stack.push(o);
	
		while (stack.length > 0) {
			node = stack.pop();
			if (node.text == '2021-06-23') {
				// Found it!
				return node;

			} else if (node.children && node.children.length) {
				for (let ii = 0; ii < node.children.length; ii += 1) {
					stack.push(node.children[ii]);
				}
			}
		}
	
		// Didn't find it. Return null.
		return null;
	}


	const findName = (o, path, target) => {

		let res = []

		target = ( target === undefined ) ? "" : target

		const isLastLevel = !o.children

		// console.log(o.text," == ", target )
		path += isLastLevel ? o.text : o.text + ', ';

		// if ( o.text == target ) {


		// } else {

		// 	path += isLastLevel ? o.text : o.text + ', ';

		// }
	  
		if (o.children) {

			o.children.forEach(node => {

				findName(node, path, target);

			});

		}
	  
		if (isLastLevel) {

			if ( path.search(target) > 0 ) {
				res.push(path)
				console.log(res)
			}
		}
	}


	const findNameORI = (o, path, target) => {

		const isLastLevel = !o.children

		path += isLastLevel ? o.text : o.text + ', ';

		if (o.children) {

			o.children.forEach(node => {

				findName(node, path, target);

			});

		}
	  
		if (isLastLevel) {

			console.log(path);

		}
	}


	const recursiveSum = (item) => {

		if(item.value === 'sum') {

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



	// function searchTree(element, matchingTitle){
	const searchTree1 = (element, matchingTitle) => {

		// console.log(element.text, " = ", matchingTitle);
		let name = element.text.replace(/<br>+$/,'')

		if( name == matchingTitle){
			 return element;
		}else if ( element.children ) {
			 var i;
			 var result = null;
			 for(i=0; result == null && i < element.children.length; i++){
				  result = searchTree1(element.children[i], matchingTitle);
			 }
			 return result;
		}
		return null;
   }
	

	const loadList = (o) => {

		// http://jsfiddle.net/charlietfl/pCsZ3/
		
		html = []

		html.push("<ul>");

		o.forEach((oo) => {

			let name = oo.text.replace(/<br>+$/,'')
			html.push('<li>' + name);

			if ( oo.value ) {
				html.push(" (<span style='color: deepskyblue'>" + oo.value + "</span>)")
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



	const RecursiveComponent = ({
		id,
		text,
		children
	}) => {

		const hasChildren = (children) => children && children.length;

		return (
			<>
				<ul>
					<li>{text}</li>

					{/* { console.log("{ text: " + text + "}") } */}

					{ hasChildren(children) && children.map((item) => (
						<RecursiveComponent
							key={item.id}
							{...item}
						/>
					))}
				</ul>
			</>
		)
	} // END: RecursiveComponent


	const tt = [
			{
				"key": "wycsafby",
				"title": "Administration",
				"notes": null,
				"side": "left",
				"icon": "fa-archive",
				"value": "sum",
				"collapsed": 1,
				"children": [
					{
						"key": "zviwvvyy",
						"title": "Rearrange Data<br>",
						"notes": null,
						"value": "sum",
						"children": [
							{
								"key": "qokxtjsm",
								"title": "Mind Map<br>",
								"notes": null,
								"value": "sum",
								"collapsed": 1,
								"children": [
									{
										"key": "ubttayqn",
										"title": "Trips",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "saicnlek",
												"title": "2021-06-25",
												"notes": null,
												"value": 60
											}
										]
									}
								]
							},
							{
								"key": "cumfvxdt",
								"title": "Excel",
								"notes": null,
								"value": "sum",
								"children": [
									{
										"key": "rogehmjh",
										"title": "FMs",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "dhejflbs",
												"title": "2021-06-22",
												"notes": null,
												"value": 65
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				"key": "kcpargdw",
				"title": "Core Responsibilities",
				"notes": null,
				"side": "left",
				"color": "#33e",
				"icon": "fa-laptop",
				"value": "sum",
				"collapsed": 1,
				"children": [
					{
						"key": "dfhnxvkv",
						"title": "Trading",
						"notes": null,
						"icon": "fa-exchange",
						"value": "sum",
						"collapsed": 1,
						"children": [
							{
								"key": "rofshbzx",
								"title": "Stock",
								"notes": null,
								"value": "sum",
								"children": [
									{
										"key": "jkvicuue",
										"title": "2021-06-21",
										"notes": null,
										"value": 15
									},
									{
										"key": "iztkkpka",
										"title": "2021-06-22",
										"notes": null,
										"value": 240
									},
									{
										"key": "rjkxrxcj",
										"title": "2021-06-23",
										"notes": null,
										"value": 180
									},
									{
										"key": "pbeeclox",
										"title": "2021-06-25",
										"notes": null,
										"value": 60
									}
								]
							}
						]
					},
					{
						"key": "pzhgsygz",
						"title": "1ness",
						"notes": null,
						"value": "sum",
						"collapsed": 1,
						"children": [
							{
								"key": "heckwnex",
								"title": "Apps",
								"notes": null,
								"value": "sum",
								"collapsed": 1,
								"children": [
									{
										"key": "zeesexto",
										"title": "Design",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "casbqtfr",
												"title": "2021-06-23",
												"notes": null,
												"value": 10
											}
										]
									}
								]
							}
						]
					},
					{
						"key": "ngzqhngm",
						"title": "SM",
						"notes": null,
						"icon": "fa-bus",
						"value": "sum",
						"collapsed": 1,
						"children": [
							{
								"key": "brrkotzf",
								"title": "Apps",
								"notes": null,
								"value": "sum",
								"collapsed": 1,
								"children": [
									{
										"key": "ylhfwcsf",
										"title": "Member",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "ousuayeq",
												"title": "Initial",
												"notes": null
											}
										]
									},
									{
										"key": "ffldqdri",
										"title": "Setup",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "rfswwbcc",
												"title": "Design",
												"notes": null,
												"value": "sum",
												"children": [
													{
														"key": "jjkbcrqr",
														"title": "2021-06-23",
														"notes": null,
														"value": 15
													}
												]
											}
										]
									}
								]
							},
							{
								"key": "qphvxwnz",
								"title": "Meeings",
								"notes": null,
								"value": "sum",
								"collapsed": 1,
								"children": [
									{
										"key": "twstcgmr",
										"title": "Weekly",
										"notes": null,
										"value": "sum",
										"children": [
											{
												"key": "ujkrnmsq",
												"title": "2021-06-20",
												"notes": null,
												"value": 45
											}
										]
									}
								]
							}
						]
					},
					{
						"key": "tknqwkap",
						"title": "Omelet",
						"notes": null,
						"color": "#fa3",
						"icon": "fa-bullseye",
						"value": "sum",
						"collapsed": 1,
						"children": [
							{
								"key": "oditnjgs",
								"title": "Meeting",
								"notes": null,
								"value": "sum",
								"collapsed": 1,
								"children": [
									{
										"key": "qneeawui",
										"title": "Tech Team<br>",
										"notes": null,
										"value": "sum",
										"collapsed": 1,
										"children": [
											{
												"key": "aspeypzx",
												"title": "2021-06-21",
												"notes": null,
												"value": 45
											}
										]
									},
									{
										"key": "trkumdqy",
										"title": "Opsta",
										"notes": null,
										"value": "sum",
										"collapsed": 1,
										"children": [
											{
												"key": "sqmcszxj",
												"title": "AWS Securities<br>",
												"notes": null,
												"value": 40
											}
										]
									}
								]
							},
							{
								"key": "ygsxebti",
								"title": "Projects",
								"notes": null,
								"collapsed": 1,
								"children": [
									{
										"key": "ifewvdvn",
										"title": "Existing",
										"notes": null,
										"collapsed": 1,
										"children": [
											{
												"key": "ckeszwpg",
												"title": "Krungsri Auto<br>",
												"notes": null,
												"icon": "fa-car"
											}
										]
									},
									{
										"key": "dtbfywyc",
										"title": "Internal",
										"notes": null
									},
									{
										"key": "pyhcaonk",
										"title": "New",
										"notes": null
									}
								]
							}
						]
					}
				]
		}
	]

	  

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

			{/* <RecursiveComponent
				{...mm.root}
			/> */}

     		<div dangerouslySetInnerHTML={{__html: htmlContent }} />

			</PageHeader>
		</div>

{/* <Tree treeData={tt} /> */}
{/* <Tree treeData={after} /> */}
		</>

	)
}

export default Export
