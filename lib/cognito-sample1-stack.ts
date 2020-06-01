import * as cdk from '@aws-cdk/core';
import { LambdaRestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType } from '@aws-cdk/aws-apigateway';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { UserPool, OAuthScope, UserPoolClient, CfnUserPoolClient, StringAttribute } from '@aws-cdk/aws-cognito'
import { AwsCustomResource, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam'

export class CognitoSample1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'myUserPool', {
      userPoolName: "demo-userpool",
      selfSignUpEnabled: true,
      customAttributes: {
        member_status: new StringAttribute()
      },
      signInAliases: {
          email: true,
          phone: true,
          username: true
      }
    });
    const userPoolClient = userPool.addClient('app-client', {
      oAuth: {
        flows : {
          implicitCodeGrant: true
        },
        scopes: [OAuthScope.OPENID],
        callbackUrls: ['https://www.google.com']
      }
    } );    

    const cfnUserPoolClient = userPoolClient.node.defaultChild as CfnUserPoolClient;
    cfnUserPoolClient.supportedIdentityProviders = ["COGNITO"];
    
    userPool.addDomain('DemoAuthDomain', {
      cognitoDomain: {
        domainPrefix: 'demo-app-xyz-88779911',
      },
    });

    new AwsCustomResource( this,
      "UserPoolDomainNameCustomResource",
      {
        policy: AwsCustomResourcePolicy.fromStatements ([
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              "cognito-idp:*"
            ],
            resources: ["*"]
          })
        ]),
        onCreate: {
          service: "CognitoIdentityServiceProvider",
          action: "adminCreateUser",
          parameters: {
            UserPoolId : userPool.userPoolId,
            Username: "testuser",
            TemporaryPassword: "Password123!",
            UserAttributes: [
              {"Name":"email","Value":"testuser@somewhere.com"},
              {"Name":"email_verified","Value":"True"},
              {"Name":"custom:member_status", "Value":"gold_member_status"}
            ],
            MessageAction: "SUPPRESS"
          },
          physicalResourceId: {
            id: 'userpoolcreateid' + Date.now().toString()
          }
        }
      }
    );

    const helloWorldFunction = new Function(this, 'helloWorldFunction', {
          code: new AssetCode('hello-lambda'),
          handler: 'helloworld.handler',
          runtime: Runtime.NODEJS_12_X
    });

    const helloWorldLambdaRestApi = new LambdaRestApi(this, 'helloWorldLambdaRestApi', {
          restApiName: 'Hello World API',
          handler: helloWorldFunction,
          proxy: false,
    });

    const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
          restApiId: helloWorldLambdaRestApi.restApiId,
          name: 'HelloWorldAPIAuthorizer',
          type: 'COGNITO_USER_POOLS',
          identitySource: 'method.request.header.Authorization',
          providerArns: [userPool.userPoolArn],
    });

    const hello = helloWorldLambdaRestApi.root.addResource('HELLO');
      
    hello.addMethod('GET', new LambdaIntegration(helloWorldFunction), {
          authorizationType: AuthorizationType.COGNITO,
          authorizer: {
              authorizerId: authorizer.ref
          }
    });

   let apiURL = helloWorldLambdaRestApi.url + "HELLO";

   new cdk.CfnOutput(this, "Cognito-Demo-ClientID", {value: userPoolClient.userPoolClientId });
   new cdk.CfnOutput(this, "Cognito-Demo-UserPoolID", {value: userPool.userPoolId });
   new cdk.CfnOutput(this, "Cognito-Demo-TestURL", {value: apiURL });
   
  }
}
