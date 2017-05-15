'use strict';

var path = process.cwd();
var StocksController = require(path + '/app/controllers/stocksController.server.js');

module.exports = function (app,io) {

	var stocksController = new StocksController();

	app.route('/')
		.get( function (req, res) {
			res.sendFile(path + '/public/root.html');
		});

	io.on('connection', function(socket){
 			 console.log('User Connected');
 			 
 			 socket.on('disconnect', function(){
    				console.log('User Disconnected');
  				});
			
			 socket.on('get-last-stocks-details', function(){
			 		stocksController.getSavedStocks(function(result){
			 				socket.emit('initial load stocks msg', result);

			 		});
			 }) 
			  socket.on('get-last-stocks-chart-details', function(){
	
			 		stocksController.getSavedStocks(function(result){

			 				result.forEach(function(element){

			 					stocksController.getStockChartInfo(element.Symbol,function(chart_data){
	
			 						socket.emit('chart info stock msg', chart_data);

			 					});

			 				})
			 		});
			 });


				
			  socket.on('chart-info-stock', function(msg){
			 		stocksController.getStockChartInfo(msg,function(result){
			 				socket.emit('chart info stock msg', result);

			 		});
			 }); 			 

 			 socket.on('update-stock', function(msg){

 			 		 stocksController.updateStockData(msg, function(result){

 			 		 	  	if(result.length > 0)
			 			  	{
			 			  		socket.emit('update stock msg', result);
							}
			 			  
			 		})

 			 });

 			  socket.on('del-stock', function(id_stock){

 			 		 stocksController.deleteStock(id_stock, function(result){
 			 		 		
 			 		 	  	if(result._id == id_stock)
			 			  	{
			 			  		socket.emit('del stock msg', result);
							}
			 			  
			 		})

 			 });


 			 socket.on('search-stock', function(msg){

 			  stocksController.updateStockData(msg, function(result){
	
 			  try{
 			  	  	if(result.length ==1){
 			  		stocksController.saveStock(result[0],function(savedStock){
 			  				io.emit('add stock msg', savedStock);

 			  		});
	 			  	}
	 			  	else if(result.length > 1)
	 			  	{	

	 			  		
	 			  		var my_stock = result.find(function(element){ return element.Symbol == msg; });
	 			  		
	 			  		stocksController.saveStock(my_stock,function(savedStock){
	 			  			
	 			  				io.emit('add stock msg', savedStock);
	 			  		})
	 			  		

	 			  	}
	 			  	else
	 			  	{
	 			  		socket.emit('search stock error','Incorrect or not existing stock code');
 			  		}
 			  }
 			  catch(err)
 			  {
 			  	socket.emit('search stock error','Stock code is too big');
 			  }
 			  	

 			  });
			 });
	});


};
