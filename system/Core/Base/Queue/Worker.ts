/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

import { Worker } from 'bullmq';

const redisConfig = require('../../../../config/redis');
const Processor = require('./Processor');

// const Knex = Venida.import('knex', true);

const worker = new Worker(redisConfig.get('queueName'), Processor, {
    connection: redisConfig.get('redisConfig')
});

worker.on('drained', () => {
    console.log(`Queue is drained, no more jobs left`);
});

worker.on('failed', async (job: any, error: any) => {
    console.error('Error Queue: ', error);
});

worker.on('completed', async (job: any, result: any) => {
    console.log(`job has completed!`);
});