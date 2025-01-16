import { Environments } from './types';

const environments = {} as Environments;

environments.development = {
  port: 3000,
  envName: 'development',
  maxCheckTimeoutSeconds: 5,
};

environments.staging = {
  port: 4000,
  envName: 'staging',
  maxCheckTimeoutSeconds: 10,
};

environments.production = {
  port: 5000,
  envName: 'production',
  maxCheckTimeoutSeconds: 5,
};

const currentEnvironmentName =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV
    : 'development';

export const environmentToExport =
  environments[currentEnvironmentName as keyof typeof environments];
