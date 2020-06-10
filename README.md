# cognito-cdk-amplify
Cognito Demo with Amplify Client Using the CDK

# About 

This AWS CDK sample does the following:
* Creates a Cognito User Pool with implicit code grant flow.
* Uses an AwsCustomResource to add a test user to the User Pool.
* Creates a custom attribute within the User Pool.
* Creates a lambda function that will return the custom attribute from the Cognito JWT.
* Secures the lambda using Cognito and the API Gateway.
* Demonstrates calling the endpoint using AWS Amplify Javascript client.

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

# Reference

Please also see the Medium article located here:

https://medium.com/@drewword/securing-lambda-with-cognito-api-gateway-amplify-and-the-cdk-b6d29bb4137f


