#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UserpoolCustomauthflowStack } from '../lib/userpool-customauthflow-stack';

const app = new cdk.App();
new UserpoolCustomauthflowStack(app, 'UserpoolCustomauthflowStack');
