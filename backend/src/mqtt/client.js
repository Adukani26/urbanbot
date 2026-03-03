import mqtt from 'mqtt';
import { db } from '../services/db.js';

let client;

const TOPICS = {
  TELEMETRY: 'urbanbot/telemetry',
  STATUS:    'urbanbot/status',
  COMMAND:   'urbanbot/command',
  CAMERA:    'urbanbot/camera/frame',
};

export const initMQTT = async (io) => {
  client = mqtt.connect(process.env.MQTT_BROKER || 'mqtt://localhost:1883');

  client.on('connect', () => {
    console.log('✅ MQTT broker connected');
    client.subscribe(Object.values(TOPICS), (err) => {
      if (err) console.error('MQTT subscribe error:', err);
    });
  });

  client.on('message', async (topic, payload) => {
    try {
      const data = JSON.parse(payload.toString());

      if (topic === TOPICS.TELEMETRY) {
        await db.query(
          `INSERT INTO telemetry (robot_id, battery_level, speed, lat, lng, status, current_job_id, raw)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [data.robot_id, data.battery, data.speed, data.lat, data.lng, data.status, data.job_id, data]
        );
        io.emit('telemetry', data);
      }

      if (topic === TOPICS.STATUS) {
        io.emit('robot:status', data);
      }

      if (topic === TOPICS.CAMERA) {
        io.emit('camera:frame', data);
      }

    } catch (err) {
      console.error('MQTT message parse error:', err);
    }
  });

  client.on('error', (err) => console.error('MQTT error:', err));
};

export const publishCommand = (command) => {
  if (!client) return;
  client.publish(TOPICS.COMMAND, JSON.stringify(command));
  console.log(`📡 Command sent to robot: ${JSON.stringify(command)}`);
};