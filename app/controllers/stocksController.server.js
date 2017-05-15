var request = require('request');
var Stock = require('../models/stocks.js');

function StocksController (){

	this.saveStock = function(new_stock,callback){

					  var stock = new Stock();
					  stock.Symbol = new_stock.Symbol;
					  stock.Name = new_stock.Name;
					  stock.Exchange = new_stock.Exchange;
					  stock.save(function (err,result) {
					  
						if (err) {
							throw err;}
						else
							callback(result);
						})	
	}
	this.deleteStock = function(id_stock,callback){
		
		Stock.findByIdAndRemove(id_stock,function(err,result){
			
			if(err)
				throw err;
			else
				callback(result);


		});
	}
	this.getSavedStocks = function(callback){

		Stock.find({},function(err,result){
			if(err)
				throw err;
			else
				callback(result);

		})
	}
	this.updateStockData = function(msg,callback){
		  	
		  	var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + msg;

			return request.get({
			    url: url,
			    json: true,
			    headers: {
			        'Content-Type': 'application/json'
			    }
			}, function (e, r, b) {
				  //callback(e);
				  if(e) throw e;
				  	else  callback(b);
			}); 


			}

	this.getStockChartInfo = function(msg,callback){

		 var parameters = {  
		        Normalized: false,
		        NumberOfDays: 3650,
		        DataPeriod: "Day",
		        Elements: [{Symbol: msg,Type: "price",Params: ["ohlc"]}]
		    };
  		var url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters='+JSON.stringify(parameters);
			return request.get({
			    url: url,
			    json: true,
			    headers: {
			        'Content-Type': 'application/json'
			    }
			}, function (e, r, b) {
					
				  //callback(e);
				  b.name = msg;

				  callback(chart_data_parser(b));
			}); 


	}


		function chart_data_parser(json) {


		    function _fixDate(dateIn) {
		        var dat = new Date(dateIn);
		        return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
		    }
		    var dates = json.Dates || [];
		    var elements = json.Elements || [];
		    var chartSeries = [];
		    chartSeries.push(json.name)
		 
		    if (elements[0]){

		        for (var i = 0, datLen = dates.length; i < datLen; i++) {
		            var dat =   _fixDate( dates[i] );
		            var pointData = [
		                dat,
		                elements[0].DataSeries['open'].values[i],
		                elements[0].DataSeries['high'].values[i],
		                elements[0].DataSeries['low'].values[i],
		                elements[0].DataSeries['close'].values[i]
		            ];
		            chartSeries.push( pointData );
		        };
		    }
		    return chartSeries;
		};

}


module.exports = StocksController ;