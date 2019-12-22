/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
//const Adapter = require('ask-sdk-dynamodb-persistence-adapter');
//const docClient = new AWS.DynamoDB.DocumentClient();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'hi';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

// Handler um Kalorien zum momentanen Kalorienstand hinzuzufügen
const AddCaloriesIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AddCaloriesIntent';
    },
    async handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        // Die vom User genannte Kalorienanzahl
        var kalorien = parseInt(slots.KalorienAnz.value,10);
        // Speichert die UserID des USers
        //const userID =  this.event.context.System.user.userId;
        // Speichert das momentane Datum
        //var timestamp = new Date().getTime();
        
        const user = await handlerInput.attributesManager.getPersistentAttributes();
        if(user.currentUser){
          user.currentUser += +kalorien;
        }else{
          user.currentUser = kalorien;
        }
        handlerInput.attributesManager.setPersistentAttributes(user);
        await handlerInput.attributesManager.savePersistentAttributes(user);
        
        var speakOutput = 'Ich habe ' + kalorien + ' Kalorien heute hinzugefügt';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

// Handler um die am Tag schon zu sich genommenen Kalorien abzufragen 
const GetCurrentCaloriesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetCurrentCaloriesIntent';
  },
  async handle(handlerInput) {
    
    const user = await handlerInput.attributesManager.getPersistentAttributes();
    var kalorien = user.currentCalories;
    
    var speakOutput = '';
    if(user.currentCalories) {
      speakOutput = 'Du hast heute schon ' + kalorien + ' zu dir genommen';
    }else {
      speakOutput = 'Du hast heute noch keine Kalorien heute angegeben';
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Me no understando')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const repromptOutput = 'Was möchtest du jetzt machen ?';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AddCaloriesIntentHandler,
    GetCurrentCaloriesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('user')
  .withAutoCreateTable(true)
  //.withDynamoDbClient()
  .lambda();
