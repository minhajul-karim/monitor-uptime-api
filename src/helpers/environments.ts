interface Env {
  port: number;
  envName: string;
}

interface Environments {
  development: Env;
  staging: Env;
  production: Env;
}

const environments = {} as Environments;

environments.development = {
  port: 3000,
  envName: 'development',
};

environments.staging = {
  port: 4000,
  envName: 'staging',
};

environments.production = {
  port: 5000,
  envName: 'production',
};

const currentEnvironmentName =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV
    : 'development';

export const environmentToExport =
  environments[currentEnvironmentName as keyof typeof environments];
