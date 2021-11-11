import { ConnectionOptions } from 'typeorm';

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'goprojectuser',
  password: 'root',
  database: 'goproject',
};

export default ormconfig;
