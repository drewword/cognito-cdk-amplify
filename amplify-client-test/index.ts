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

// Here is an alternative to the change password 1st approach
/*

cognitoidentityserviceprovider.adminInitiateAuth(
    { AuthFlow: 'ADMIN_NO_SRP_AUTH', 
    ClientId: 'your_own3j63rs8j16bxxxsto25db00obh', 
    UserPoolId: 'us-east-1_DtNSUVT7n', 
    AuthParameters: { USERNAME: 'user3', PASSWORD: 'original_password' } }, 
    callback); 

var params = {
  ChallengeName: 'NEW_PASSWORD_REQUIRED', 
  ClientId: 'your_own3j6...0obh',
  ChallengeResponses: {
    USERNAME: 'user3',
    NEW_PASSWORD: 'changed12345'
  },
  Session: 'xxxxxxxxxxZDMcRu-5u...sCvrmZb6tHY'
};

cognitoidentityserviceprovider.respondToAuthChallenge(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

*/


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

            // This is from stack overflow here:
            // https://stackoverflow.com/questions/40287012/how-to-change-user-status-force-change-password/56948249#56948249
            
            const userChallengeIdInfo = {
                "email":"testuser@somewhere.com"
            }
            // Get these details and call
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