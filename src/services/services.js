import axios from 'axios';
import fire from '../fire';
import moment from 'moment'


// const urlTrading = 'https://y-back.herokuapp.com/trading'

// var moment = require('moment-timezone');
// const host = 'http://localhost:3001/'
const host = 'https://y-back.herokuapp.com/'
const url = host + '/api'



const urlTrading = host + 'trading/';
const urlTradingEdit = host + 'trading/';
const urlInven = host + 'inven/'
const urlInvenGet1 = host + 'inven/inven/'
const urlProj = host + 'proj/'
const urlStock = host + 'stock/'
const urlCert = host + 'cert/'
const urlCoin = host + 'coin/'
const urlExp = host + 'exp/'
const urlExpCat = host + 'exp_cat/'
const urlExport = host + 'export/'
const urlPomodoro = host + 'pomodoro/';
const urlPort = host + 'portfolio/';
const urlSymbol = host + 'symbol/'

// const urlTradingEdit = 'http://localhost:3001/trading/';
// const urlInven = 'http://localhost:3001/inven/'
// const urlInvenGet1 = 'http://localhost:3001/inven/inven/'
// const urlProj = 'http://localhost:3001/proj'
// const urlStock = 'http://localhost:3001/stock'
// const urlCert = 'http://localhost:3001/cert/';
// const urlExp = 'http://localhost:3001/exp/';
// const urlExpItem = 'http://localhost:3001/exp_item/';


const createToken = async () => {

	const user = fire.auth().currentUser;
	const token = user && (await user.getIdToken());

	const payloadHeader = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};

	return payloadHeader;
}


export const addToPhonebook = async (name, number) => {
	const header = await createToken();

	const payload = {
		name,
		number,
	}

	try {
		console.log(payload);
		const res = await axios.post(url, payload, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: addPhonebook



export const certGet = async () => {

	const header = await createToken();

	try {
		const res = await axios.get(urlCert + "/0", header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: certGet



export const chartGetPomodoro = async (o) => {

	const header = await createToken();

	// if ( o.keyword == "" ) {
	// 	o.keyword = "null"
	// 	o.filter = "active"
	// }

	// o.filter = o.period
	let period = o.period

	try {

		const res = await axios.get(urlPomodoro + "chart/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartGetPomodoro



export const chartGetCoin = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}
	
	// console.log("service: chargetcoin - ", o.keyword, " - ", o.filter);

	try {

		const res = await axios.get(urlCoin + "chart/" + o.keyword + "." + o.filter, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartGetCoin


export const chartGetExp = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}

	o.filter = o.period

	// console.log("service: chartGetExp - ", o);

	try {

		const res = await axios.get(urlExp + "chart/" + o.keyword + "." + o.filter, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartGetExp



export const chartGetTrading = async (o) => {

	const header = await createToken();

	// if ( o.keyword == "" ) {
	// 	o.keyword = "null"
	// 	o.filter = "active"
	// }

	let period = "null"

	try {

		const res = await axios.get(urlTrading + "chart/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartGetTrading



export const chartLineGet = async (o) => {

	const header = await createToken();

	// if ( o.keyword == "" ) {
	// 	o.keyword = "null"
	// 	o.filter = "active"
	// }

	let period = "null"

	try {

		const res = await axios.get(urlPomodoro + "chartline/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartLineGet



export const chartLineGetCoin = async (o) => {

	const header = await createToken();

	// if ( o.keyword == "" ) {
	// 	o.keyword = "null"
	// 	o.filter = "active"
	// }

	let period = "null"

	try {

		const res = await axios.get(urlPomodoro + "chartline/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartLineGetCoin



export const chartLineGetExp = async (o) => {

	const header = await createToken();

	// if ( o.keyword == "" ) {
	// 	o.keyword = "null"
	// 	o.filter = "active"
	// }

	let period = "null"

	try {

		const res = await axios.get(urlExp + "chartline/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartLineGetExp



export const chartLineGetTrading = async (o) => {

	const header = await createToken();

	let period = o

	try {

		const res = await axios.get(urlTrading + "chartline/" + period, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: chartLineGetTrading



export const coinAdd = async (o) => {

	const header = await createToken();

	const payload = {
		id: o.id,
		item: o.item,
		buy: parseFloat(o.buy),
		sell: parseFloat(o.sell),
		note: o.note,
		bdate: o.bdate !== null ? moment(o.bdate).format('YYYY-MM-DD HH:mm:ss') : null,
		// sdate: o.sdate !== null ? moment(o.sdate).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss') : null
	}

	// console.log("coinAdd > ", payload)

	try {

		var res = {}

		if ( o.id == 0 ) {

			res = await axios.post(urlCoin, payload, header);

		} else {

			res = await axios.put(urlCoin, payload, header);

		}

		console.log("coinAdd - ", res);

		// return res.data;
		return res

	} catch (e) {
		console.error("Error: coinAdd - ", e);
	}

} // END: coinAdd



export const coinsGet = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}

	try {

		const res = await axios.get(urlCoin + o.keyword + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: coinsGet



// export const coinUpdate = async (o) => {

// 	const header = await createToken();

// 	const payload = {
// 		id: o.id,
// 		item: o.item,
// 		buy: parseFloat(o.buy),
// 		sell: parseFloat(o.sell),
// 		note: '',
// 		bdate: o.bdate,
// 		sdate: o.sdate
// 	}

// 	console.log(payload)

// 	try {
// 		const res = await axios.put(urlCoin, payload, header);
// 		return res.data;

// 	} catch (e) {
// 		console.error(e);
// 	}

// } // END: coinUpdate



export const exp2DB = async (o) => {

	const header = await createToken();

	const payload = {
		id: o.id,
		item_id: o.cat,
		amount: parseFloat(o.amount).toFixed(2),
		cdate: o.cdate !== null ? moment(o.cdate).format('YYYY-MM-DD HH:mm:ss') : null,
		edate: o.edate !== null ? moment(o.edate).format('YYYY-MM-DD HH:mm:ss') : null,
		price: parseFloat(o.price).toFixed(2),
		mileage: parseInt(o.mileage),
		note: o.note,
		flag: o.flag
	}

	// console.log("exp2DB > ", payload)

	try {

		if ( o.id == 0 ) {

			const res = await axios.post(urlExp, payload, header);

		} else {

			const res = await axios.put(urlExp, payload, header);

		}

		// console.log(res)

		// return res.data;

	} catch (e) {
		console.error("Error: exp2DB - ", e);
	}

} // END: exp2DB



export const expCatGet = async () => {

	const header = await createToken();

	try {

		const res = await axios.get(urlExpCat, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: expCatGet



export const expsGet = async (o) => {

	const header = await createToken();

	o.filter = o.period

	// console.log("SERVICE: expGet -  ", o)

	if ( o.keyword === undefined || o.keyword == "" ) {
		o.keyword = "null"
	}

	try {

		const res = await axios.get(urlExp + o.keyword + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error("Error: expGet - ", e);
	}

} // END: expGet


export const expTransGet = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" ) {
		o.keyword = "null"
	}

	try {

		// const res = await axios.get(urlTrading + o.t_type + "." + o.keyword, header);
		// const res = await axios.get(urlExp, header);
		const res = await axios.get(urlExp + o.keyword, header);

		res.data.forEach(function (e) {

			// let sell = e.vol * e.sell

			// e.cost = (e.vol * e.buy)

			// if ( sell > 0 ) {
			// 	e.margin = (e.vol * e.sell) - (e.vol * e.buy)
			// } else {
			// 	e.margin = 0
			// }
		})

		return res.data;

	} catch (e) {
		console.error("Error: expTransGet - ", e);
	}

} // END: expTransGet



export const exportsGet = async (o) => {

	const header = await createToken();

	// console.log(o);

	try {

		const res = await axios.get(urlExport + o, header);

		return res.data;

	} catch (e) {
		console.error("Error: exportsGet - ", e);
	}

} // END: exportsGet



export const getTrading = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" ) {
		o.keyword = "null"
	}
	// let type = '0'

	// if ( o ) {
	// 	type = '1'
	// }
		// console.log(urlTrading + o.t_type + "." + o.keyword, header)

// Route path: /plantae/:genus.:species
// Request URL: http://localhost:3000/plantae/Prunus.persica
// req.params: { "genus": "Prunus", "species": "persica" }

	try {
		// const res = await axios.get(urlTrading + type, header);
		const res = await axios.get(urlTrading + o.t_type + "." + o.keyword, header);

		res.data.forEach(function (e) {

			let sell = e.vol * e.sell

			e.cost = (e.vol * e.buy)

			if ( sell > 0 ) {
				e.margin = (e.vol * e.sell) - (e.vol * e.buy)
			} else {
				e.margin = 0
			}
		})

		// res.data.map(obj => ({
		// 	...obj,
		// 	cost: (obj.vol * obj.buy)
		// }))

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: getTrading



export const pomodoro2DB = async (o) => {

	const header = await createToken();

	const payload = {
		id: o.id,
		type: o.type,
		project: o.project,
		story: o.story,
		task: o.task,
		subtask: o.subtask,
		minute: parseInt(o.minute),
		cdate: o.cdate !== null ? moment(o.cdate).format('YYYY-MM-DD HH:mm:ss') : null,
		// cdate: o.cdate !== null ? moment.tz(o.cdate, 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss') : null,
		flag: o.flag
	}

	// console.log("pomodoro2DB > ", payload)

	try {

		var res = {}

		if ( o.id == 0 ) {

			res = await axios.post(urlPomodoro, payload, header);

		} else {

			res = await axios.put(urlPomodoro, payload, header);

		}

		// console.log(res)
		// return res.data;

	} catch (e) {
		console.error("Error: pomodoro2DB - ", e);
	}

} // END: pomodoro2DB




export const pomodorosGet = async (o) => {

	const header = await createToken();

	if ( o.keyword === undefined || o.keyword == "" ) {
		o.keyword = "null"
	}

	if ( o.keyword == "" ) {
		o.keyword = "null"
		o.filter = "active"
	}

	try {

		const res = await axios.get(urlPomodoro + o.keyword + "." + o.period + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error("Error: pomodorosGet - ", e);
	}

} // END: pomodorosGet



export const portfolioGet = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}

	console.log("service: route - ", urlPort + o.route + o.keyword + "." + o.filter, header)

	try {

		const res = await axios.get(urlPort + o.route + o.keyword + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: portfolioGet






export const trading2DB = async (o) => {

	const header = await createToken();

	const payload = {
		id: o.id,
		broker: o.broker,
		symbol: parseInt(o.symbol),
		vol: o.vol,
		buy: parseFloat(o.buy),
		sell: parseFloat(o.sell),
		profit: parseFloat(o.profit),
		cdate: o.cdate !== null ? moment(o.cdate).format('YYYY-MM-DD HH:mm:ss') : null,
		edate: o.edate !== null ? moment(o.edate).format('YYYY-MM-DD HH:mm:ss') : null,
		note: o.note
	}

	// console.log("trading2DB > ", payload)

	try {

		if ( o.id == 0 ) {

			const res = await axios.post(urlTrading, payload, header);

		} else {

			const res = await axios.put(urlTrading, payload, header);

		}

		// console.log(res)

		// return res.data;

	} catch (e) {
		console.error("Error: trading2DB - ", e);
	}

} // END: trading2DB


// export const tradingAdd = async (symbol, vol) => {

// 	const header = await createToken();

// 	const payload = {
// 		symbol,
// 		vol,
// 	}

// 	try {
// 		console.log(payload);
// 		const res = await axios.post(urlTrading, payload, header);
// 		return res.data;

// 	} catch (e) {
// 		console.error(e);
// 	}

// } // END: tradingAdd



export const tradingsGet = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}

	try {

		const res = await axios.get(urlTrading + o.keyword + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: tradingsGet



export const tradingSymbolGet = async () => {

	const header = await createToken();

	try {

		const res = await axios.get(urlSymbol, header);

		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: tradingSymbolGet



// export const tradingsGet = async (id) => {

// 	const header = await createToken();

// 	try {
// 		const res = await axios.get(urlTrading + "/one/" + id, header);

// 		res.data.forEach(function (e) {

// 			let sell = e.vol * e.sell

// 			e.cost = (e.vol * e.buy)

// 			if ( sell > 0 ) {
// 				e.margin = (e.vol * e.sell) - (e.vol * e.buy)
// 			} else {
// 				e.margin = 0
// 			}
// 		})

// 		return res.data;

// 	} catch (e) {
// 		console.error(e);
// 	}

// } // END: tradingsGet


export const tradingUpdate = async (o) => {

	const header = await createToken();

	const payload = {
		id: o.id,
		symbol: o.symbol,
		vol: o.vol,
		buy: parseFloat(o.buy),
		sell: parseFloat(o.sell),
		t_type: o.t_type,
		cdate: o.cdate,
		edate: o.edate
	}

	// console.log(payload)

	try {
		const res = await axios.put(urlTradingEdit, payload, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: tradingUpdate


export const invenGet1 = async (id) => {

	const header = await createToken();

	try {
		const res = await axios.get(urlInvenGet1 + id, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: invenGet1


export const invenGet = async () => {

	const header = await createToken();

	try {
		const res = await axios.get(urlInven, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: invenGet



export const projectsGet = async () => {

	const header = await createToken();

	try {
		const res = await axios.get(urlProj, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: projectsGet


export const stocksGet = async () => {

	const header = await createToken();

	try {
		const res = await axios.get(urlStock + "/0", header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: stocksGet







export const get = async (o) => {

	const header = await createToken();

	if ( o.keyword == "" || o.keyword === undefined ) {
		o.keyword = "null"
	}

	// console.log("service: get - ", host + o.table + "/" + o.route + o.keyword + "." + o.filter)

	try {

		const res = await axios.get(host + o.table + "/" + o.route + o.keyword + "." + o.filter, header);
		return res.data;

	} catch (e) {
		console.error(e);
	}

} // END: get
