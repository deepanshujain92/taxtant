var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

app.use('/', index);
app.use('/users', users);
app.post('/webhook', function (req, res) {
    var body = req.body;
    var action = (body.result.action);
    var params = body.result.parameters;
    console.log(body);
    console.log(body.result.resolvedQuery);
    var lang = lngDetector.detect(body.result.resolvedQuery, 1)[0][0];
    console.log(lang);
    console.log(body);
    if (action == "gst.defination")
    {
        if (lang == "hindi")
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "माल और सेवाओं की खपत पर यह एक गंतव्य आधारित कर है। यह सभी चरणों में लगाए जाने का प्रस्ताव है, जो कि आखिरी खपत के निर्माण के साथ ही पिछले चरणों में उपलब्ध कराए गए करों के क्रेडिट के साथ सेटऑफ़ के रूप में उपलब्ध हैं। संक्षेप में, केवल मूल्य अतिरिक्त कर लगाया जाएगा और टैक्स का बोझ अंतिम उपभोक्ता द्वारा वहन किया जाना है।";
//        else speech = "Here is Approved Sanctioned Amount for your "+params.AccountType+" Account" + accountDetails.ApprovedSanctionedAmount;

            var json = {
                "speech": speech,
                "displayText": "",
                "source": "bot"
            };
            res.set("Content-type", "application/json")
            res.send(json);
        } else
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "It is a destination based tax on consumption of goods and services. It is proposed to be levied at all stages right from manufacture up to final consumption with credit of taxes paid at previous stages available as setoff. In a nutshell, only value addition will be taxed and burden of tax is to be borne by the final consumer.";
//        else speech = "Here is Approved Sanctioned Amount for your "+params.AccountType+" Account" + accountDetails.ApprovedSanctionedAmount;

            var json = {
                "speech": speech,
                "displayText": "",
                "source": "bot"
            };
            res.set("Content-type", "application/json")
            res.send(json);
        }
    } else if (action === "gst.objectdata")
    {   var item = {};
        for(var i=0;i<config.Rates.length;i++)
        {
            if(config.Rates[i].item["Item"]==params.objectname)
            {
                item = config.Rates[i];
                break;
            }
        }
        if (lang == "hindi")
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "GST के पहले: "+item.Existing+"% ,GST के बाद: "+item.Rate+"%";
//        else speech = "Here is Approved Sanctioned Amount for your "+params.AccountType+" Account" + accountDetails.ApprovedSanctionedAmount;

            var json = {
                "speech": speech,
                "displayText": "",
                "source": "bot"
            };
            res.set("Content-type", "application/json")
            res.send(json);
        } else
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "Before GST: "+item.Existing+"% ,After: "+item.Rate+"%";
//        else speech = "Here is Approved Sanctioned Amount for your "+params.AccountType+" Account" + accountDetails.ApprovedSanctionedAmount;

            var json = {
                "speech": speech,
                "displayText":"",
                "source": "bot"
            };
            res.set("Content-type", "application/json")
            res.send(json);
        }
    }
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
