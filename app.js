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
    if (action === "gst.defination"&&body.result.actionIncomplete === false)
    {
        if (lang === "hindi")
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "GST ( गुड्स एंड सर्विस टैक्स ) एक अप्रत्यक्ष प्रकार का कर यानी इंडायरेक्ट tax है। GST Bill के द्वारा ही वस्तुओं, सेवाओं पर एक समान टैक्स लगाया जा सकता है। जहां या जिन प्रदेशों में जीएसटी लागू नहीं है, वहां जरुरत की वस्तुओं और साथ ही साथ सेवाओं पर अलग-अलग टैक्स लगाए जाते हैं। जैसे ही ये GST Bill लागू होगा तो देश में हर सामान और हर सेवा पर सिर्फ एक ही टैक्स लगेगा यानी वैट।";
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
    } else if (action === "gst.objectdata"&&body.result.actionIncomplete === false)
    {   
        if (lang === "hindi")
        {
            var speech;
            // if(params.AccountType==="Savings") 
            speech = "GST के पहले: 0% ,GST के बाद: 0%";
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
            var item = {};
        for(var i=0;i<config.Rates.length;i++)
        {
            if(config.Rates[i]["Item"]===params.objectname)
            {
                item = config.Rates[i];
                break;
            }
        }
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
    else
    {
        var json = {
                "speech": body.result.fulfillment.speech,
                "displayText": "",
                "source": "bot"
            };
            res.set("Content-type", "application/json")
            res.send(json);
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
