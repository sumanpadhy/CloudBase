'use strict';
process.env.DEBUG = 'actions-on-google:*';
//const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'dialogflowapi-c7ed8';
const translate = new Translate({
    projectId: projectId,
  });

const { dialogflow } = require('actions-on-google');
const agent = dialogflow();
//const agent = dialogflow({debug: true});
const actionMap = new Map();             

const languages = {
    'French': 'fr',
    'Russian': 'ru',
    'Spanish': 'es',
    'Japanese': 'ja',
    'Chinese': 'zh',
    'Dutch': 'nl',
    'English': 'en',
    'German': 'de',
    'Italian': 'it',
    'Korean': 'ko'
}


exports.webhook = functions.https.onRequest((request, response) => {
    console.log("into webhook function")
    //var strMsg = app.getRawInput()
    var strMsg = "suman"

    var translate = new Translate({
        projectId: "dialogflowapi-c7ed8",
    });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }
 
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    
    function translateText(agent) {
        console.log('inside translateText method')
        var text = agent.getRawInput();
        console.log("text: "+text+" langTo: "+target+" langFrom: "+source);
        console.log(agent.getContext('translate-text'));

    if (!langTo) {
        arg = agent.getContextArgument('translate-text', 'lastLangTo');
        if (arg) {
            langTo = arg.value;
        }
    }
    if (!langFrom) {
        arg = agent.getContextArgument('translate-text', 'lastLangFrom');
        if (arg) {
            langFrom = arg.value;
        }
        if (!langFrom) {
            langFrom = 'English';
        }
    }
    console.log("text: " + text);
    console.log("lang-to: " + langTo);
    console.log("lang-from: " + langFrom);
    
    if (!text) {
        console.log("text is blank")
        ask(agent, "What would you like to translate?");
    }
    else if (!langTo) {
        console.log("langTo is blank")
        ask(agent, "What language would you like to translate to?");
    }
    else {
        console.log("enter into translate")
        var options = { to: languages[langTo] };
        if (langFrom) {
            options['from'] = languages[langFrom];
        }
        translate.translate(text, options)
            .then((results) => {
                console.log("call translate method")
                var translation = results[0];
                console.log("translation: " + translation);
                tell(agent, translation);
                return "true";
        })
            .catch((error) => {
            console.error(error);
            var message = "Sorry, I couldn't translate that.";
            tell(agent, message);
        });
    }
}
    function tell(agent, speech) {
        console.log("message: "+speech)
        response.send({
            speech: speech
        })
    }
    function ask(agent, question) {
        console.log("message: "+question)
        response.send({
            speech: speech
        }) 
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    
    //agent.handleRequest(intentMap);
    tell(agent, "Hello from Firebase Console! ");
    response.send({
        speech: "Hello from Firebase Console! " + strMsg
});       
    
 });

 