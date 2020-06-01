#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CognitoSample1Stack } from '../lib/cognito-sample1-stack';

const app = new cdk.App();
new CognitoSample1Stack(app, 'CognitoSample1Stack');
