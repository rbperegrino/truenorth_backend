import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'cockroachdb',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  url: 'postgresql://develop:qFaFBVjox05jjkRxEH1-DQ@rbperegrino-1-11434.7tt.cockroachlabs.cloud:26257/truenorth?sslmode=verify-full',
  ssl: true,
  timeTravelQueries: false,
});
