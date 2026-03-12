import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

export const config = {
  port:        process.env.PORT,
  redisUrl:    process.env.REDIS_URL,
  databaseUrl: process.env.DATABASE_URL,
  mqttBroker:  process.env.MQTT_BROKER,
  nodeEnv:     process.env.NODE_ENV    || 'development',
};