var token = process.env.telegramToken; //heroku config var
var request = require('request');
var parse = require('xml2js').parseString;

var Bot = require('node-telegram-bot-api');
var bot;
// if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token)
  bot.setWebHook('https://cheap-tcg.herokuapp.com/' + bot.token);
// }
// else {
//   bot = new Bot(token, { polling: true });
// }


var ebay = require('ebay-api');

console.log('bot server started...');


bot.onText(/(.+)/, function (msg, match) {

  var arg = match[1];

  var params = {
    keywords: [String(arg)],
    paginationInput: {
      entriesPerPage: 1
    },
    sortOrder:'PricePlusShippingLowest', 
    categoryId: '38292',
    itemFilter: [
    {name: 'ListingType', value: 'FixedPrice'}
    ]
  };

  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsAdvanced',
    appId: process.env.ebayAppId,      //heroku config var
    params: params,
    parser: ebay.parseResponseJson    // (default)
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    if (error){
      bot.sendMessage(msg.chat.id, "Nothing Found").then(function () {
    // reply sent!    
  });
    }
else{
    var items = itemsResponse.searchResult.item;

    request('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=cheapTcgBot&p='+String(arg)+'&s=', function (error, response, body) {
      parse(body,function(err,result){
       //if (err){
        //bot.sendMessage(msg.chat.id, "Nothing Found").then(function () {
        // reply sent!    
        //});
      //};

     if((items==undefined)&&(result==undefined)){
        bot.sendMessage(msg.chat.id, "Nothing Found").then(function () {
    // reply sent!    
  });
      }
    //if tcgResult is undefined then only ebay is available and vice versa
    else if(result==undefined){
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
//parse callback end
});

      //tcg callback limit
    });

    //ebay callback limit
  }
  });
  //bot limit
});
module.exports = bot;




