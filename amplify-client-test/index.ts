import * as amplifyCognito from 'amazon-cognito-identity-js';
(global as any).fetch = require('node-fetch');
import axios from 'axios';

var myArgs = process.argv.slice(2);
var originalPassword = "Password123!";
var updatedPassword = "Password12345!";

var userPoolIdParam = myArgs[0];
var clientIdParam = myArgs[1];
var apiGatewayUrlParam = myArgs[2];

const poolData = {    
    UserPoolId : userPoolIdParam,
    ClientId : clientIdParam
}; 

const userPool = new amplifyCognito.CognitoUserPool(poolData);

var userData = {
    Username : 'testuser',
    Pool : userPool
};
var cognitoUser = new amplifyCognito.CognitoUser(userData);
let authDetail = new amplifyCognito.AuthenticationDetails({
    Username : 'testuser',
    Password : originalPassword,
});
authenticateUser(authDetail);

function authenticateUser(authDetail:amplifyCognito.AuthenticationDetails) {
    console.log ("Authenticating user.");
    cognitoUser.authenticateUser(authDetail, {
        onSuccess: function(result) {
            console.log ("Success authenticating user!");
            callLambdaAPI(result);
        },
        onFailure: function(result) {
            console.log ("Failure! " + result);
            console.log (result);
            console.log (JSON.stringify(result));
        },
        mfaRequired: function(codeDeliveryDetails) {
            console.log('mfaRequired: ' + codeDeliveryDetails);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            console.log ("A new password is required");
            const userChallengeIdInfo = {
                "email":"testuser@somewhere.com"
            }
            cognitoUser.completeNewPasswordChallenge(updatedPassword, 
                userChallengeIdInfo, this);
        }        
    });
}

function callLambdaAPI(result:amplifyCognito.CognitoUserSession) {
    const jwtToken1 = result.getIdToken().getJwtToken();
    axios.get( apiGatewayUrlParam, {
        headers: { 'Authorization' :  jwtToken1 }
    })
    .then(function(apiRes){
        console.log ("Success calling API!!");
        console.log (apiRes.data);
    })            
    .catch( function(err) { 
        console.log (err);
    } );

}