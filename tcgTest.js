var request = require('request');
var parse = require('xml2js').parseString;
var name = "bitterblossom";
GLOBAL.test="";
request('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=cheapTcgBot&p='+name+'&s=', function (error, response, body) {
  //if (!error && response.statusCode == 200) {
    //console.log(body) // Show the HTML for the Google homepage. 
  //}
  //if(error){
    //console.log("You don mucked up");
  //}
  //else{
    parse(body,function(err,result){
      //if(err){
        //console.log("Not found");
        //console.log(result);

      //}

      //else{
        //console.log(parseFloat(result.products.product[0].lowprice));
        //console.log(result.products.product[0].link[0]);
      //}
      test=result;
      //console.log(test);
    });
  //}
  console.log(test);

});

//cp from bot
    //tcg
    request('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=cheapTcgBot&p='+String(arg)+'&s=', function (error, response, body) {
      parse(body,function(err,result){
        var tcgResult=result;
      });
      if((items==undefined)&&(tcgResult==undefined)){
        bot.sendMessage(msg.chat.id, "Nothing Found").then(function () {
    // reply sent!    
  });
      }
    //if tcgResult is undefined then only ebay is available and vice versa
    else if(tcgResult==undefined){
      bot.sendMessage(msg.chat.id, "Best Price: $"+ items.sellingStatus.convertedCurrentPrice.amount+". Link:"+ items.viewItemURL).then(function () {
    // reply sent!
  });
    }
    else if(items==undefined){
      bot.sendMessage(msg.chat.id, "Best Price: $"+ parseFloat(result.products.product[0].lowprice)+". Link:"+ result.products.product[0].link[0]).then(function () {
    // reply sent!
  });
    }
    else{
      //if both exist, pick the cheapest unless ebay is over half the price. This is done so that when things like bitterblossom are looked for it weeds out the tokens. 
      if((parseFloat(result.products.product[0].lowprice)<parseFloat(items.sellingStatus.convertedCurrentPrice.amount))||(parseFloat(items.sellingStatus.convertedCurrentPrice.amount)<parseFloat(result.products.product[0].lowprice)/2)){
       bot.sendMessage(msg.chat.id, "Best Price: $"+ parseFloat(result.products.product[0].lowprice)+". Link:"+ result.products.product[0].link[0]).then(function () {
    // reply sent!
  });
     }
     else{
      bot.sendMessage(msg.chat.id, "Best Price: $"+ items.sellingStatus.convertedCurrentPrice.amount+". Link:"+ items.viewItemURL).then(function () {
    // reply sent!
  });
    }
  }

//tcg domain limit
});