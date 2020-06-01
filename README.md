# cognito-cdk-amplify
Cognito Demo with Amplify Client Using the CDK

# Build Instructions

* Install node, AWS CDK, typescript.
* Within root directory run npm install
* Within the hello-lambda dir, run npm install
* Within the amplify-client-test dir run npm install
* Within the main directory, run npm run build

# Demo Instructions

### Run CDK deploy

This will output three values:
* CognitoSample1Stack.CognitoDemoTestURL 
* CognitoSample1Stack.CognitoDemoUserPoolID
* CognitoSample1Stack.CognitoDemoClientID

### Run the Amplify Test client

Use the values from above to run the demo command.

`node ./amplify-client-test/index.js [USERPOOLID] [CLIENTID] [TESTURL]`

You should see the following output

```
Authenticating user.
A new password is required
Success authenticating user!
Success calling API!!
{ sampleVal1: 'Hello API!', member_status: 'gold_member_status' }
```