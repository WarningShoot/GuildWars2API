let bank;
let prices;
let sumOrder;
let sumInstant;

//https://api.guildwars2.com/v2/commerce/prices/
//https://api.guildwars2.com/v2/account/materials?access_token=api
//B8ACED5A-2BBF-F54C-AC3D-E830779EB7F6D6439EDF-416D-4A83-B0A9-4577EBA8ECD7 - Mój
//08749A6F-F776-C543-B422-D4EBC7AB85EE1525C672-C237-4763-BABB-C957DB9631CE - Bartek

let apiKey = "08749A6F-F776-C543-B422-D4EBC7AB85EE1525C672-C237-4763-BABB-C957DB9631CE"

function btnClk()
{
    bank = null;
    prices = [];

    $.ajax({
        type: 'GET',
        url: "https://api.guildwars2.com/v2/account/materials?access_token=" + apiKey,
        async: false,
        data: "json",
        success: function(data){
           bank = data;
           console.log(bank);
           getPrices(bank);
        },
        error: function() {
           alert("Your error message goes here");
        }
     });
}

function getPrices(bank)
{
    counter = 0;

    for(let i = 0; i < bank.length; i++)
    {
        if(bank[i].hasOwnProperty('binding') || bank[i].count == 0)
        {
            counter++;
            continue;
        }

        let connectionString = "https://api.guildwars2.com/v2/commerce/prices/" + bank[i].id;

        $.ajax({
            type: 'GET',
            url: connectionString,
            async: true,
            data: "json",
            success: function(data){
                let temp = {
                    id: bank[i].id,
                    count: bank[i].count,
                    sells: data.sells.unit_price,
                    buys: data.buys.unit_price
                }

                prices.push(temp);
                counter++;

                if(counter === bank.length)
                {
                    getSum();
                }
            },
            error: function() {
               alert("Your error message goes here");
            }
         });
    }
}

function getSum()
{
    sumOrder = 0;
    sumInstant = 0;

    for(let i = 0; i < prices.length; i++)
    {
        sumOrder += prices[i].count * prices[i].sells;
        sumInstant += prices[i].count * prices[i].buys;
    }

    console.log(sumOrder, sumInstant);

    sumInstant = sumInstant.toString();
    sumOrder = sumOrder.toString();

    getValue(sumInstant, 'Sell instant: ');
    getValue(sumOrder, 'Order sell: ');
}

function getValue(sum, str)
{
    let copper = sum.substr(sum.length - 2, 2);
    let silver = sum.substr(sum.length - 4, 2);
    let gold = sum.substr(0, sum.length - 4);

    console.log(copper, silver, gold);
    let temp = gold + ',' + silver + ',' + copper;

    $('<p>'+ str + temp + '</p>').appendTo('#container');
}