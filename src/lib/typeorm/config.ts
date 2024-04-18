import { DataSource } from "typeorm"

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'docker',
  password: 'docker',
  database: 'mypostgres',
  entities: ['src/repositories/schemas/*.ts'],
  synchronize: true
})

export { dataSource };