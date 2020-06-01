import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CognitoSample1 from '../lib/cognito-sample1-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CognitoSample1.CognitoSample1Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
