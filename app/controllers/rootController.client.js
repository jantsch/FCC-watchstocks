'use strict';

(function () {

   var control_update = 0;
   var socket = io();
   var stocks_list = [];


    $( document ).ready(function() {
      socket.emit('get-last-stocks-details');

      socket.emit('get-last-stocks-chart-details');
      //renderChart();
    });



    $('#add-stock').click(function(){
      socket.emit('search-stock',  $('#stock-name').val());
       $('#stock-name').val('');
    })

    $( "#stock-name" ).keypress(function() {
      if(control_update %3 ==0)
         socket.emit('update-stock',  $('#stock-name').val());
   });
    $( ".jumbotron" ).on( "click", ".close", function() {
        socket.emit('del-stock',  this.value);
     
       

  });

    
   
   socket.on('update stock msg', function(msg){
      $('#list-of-possibilities').empty();
      msg.forEach(function(element){
          $('#list-of-possibilities').append("<option value=\""+element.Symbol +"\">"+element.Name+" </option>");
      })
     
   });

   socket.on('search stock error', function(msg){
      $('#error').text(msg);
   });

   socket.on('add stock msg', function(msg){
      $('#stocks-list').prepend("<div id=\"" + msg._id+"\" class=\"col-md-4 col-sm-4\"><div class=\"stock-base each-stock \"><h4><b>"+ msg.Symbol+ "</b><button type=\"button\" class=\"close\" value=\""+msg._id+"\">×</button></h4><p>"+ msg.Name+"</p><p>"+msg.Exchange+"</p></div></div>");
       socket.emit('chart-info-stock',  msg.Symbol);
      
     
   });
     

     socket.on('chart info stock msg', function(data){
     
      var name = data.shift();
      stocks_list.push({"name": name, "data" : data});
      renderChart();
     
     })


   socket.on('initial load stocks msg', function(msg){
      msg.forEach(function(element){
          $('#stocks-list').prepend("<div id=\"" + element._id+"\" class=\"col-md-4 col-sm-4\"><div class=\"stock-base each-stock \"><h4><b>"+ element.Symbol+ "</b><button type=\"button\" class=\"close\" value=\""+element._id+"\">×</button></h4><p>"+ element.Name+"</p><p>"+element.Exchange+"</p></div></div>");
          
        })
       });

   socket.on('del stock msg', function(stock){
        $("#"+stock._id).remove();
        stocks_list = stocks_list.filter(function(el){
          return (el.name !== stock.Symbol)
        })
        renderChart();
   });


   function renderChart(data)
   {
     // $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        var series = [];
        stocks_list.forEach(function(element){
          series.push(
          {
            "name": element.name,
            "data": element.data,
            "tooltip": {
                "valueDecimals": 2
              }
          })
        })
        
        Highcharts.stockChart('container', {
        chart: {
          backgroundColor: '#2a2a2b'
        },
        credits: {
          enabled: false
        },
        labels:{
          style: {"color": '#FFFFFF' }
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Watch Stocks - RJ',
            style: { "color": '#FFFFFF' }
        },

        series: series
    });

     // })


   }


   
 
   
})();
