/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

import { Worker } from 'bullmq';

const redisConfig = require('../../../../config/redis');
const databaseConfig = require('../../../../config/database');
const Processor = require('./Processor');

const Knex = require('knex');

const DB = Knex(databaseConfig.get('connection')['mysql']);

const worker = new Worker(redisConfig.get('queueName'), Processor, {
    connection: redisConfig.get('redisConfig')
});

worker.on('drained', () => {
    console.log(`Queue is drained, no more jobs left`);
});

worker.on('failed', async (job: any, error: any) => {
    /**
     * Update log
     */
    let jobData = {
        execute_time: Math.floor(job.processedOn/1000),
        finish_time: Math.floor(Date.now()/1000),
        duration: Date.now() - job.processedOn,
        is_completed: 1,
        is_error: 1,
        updated_at: Math.floor(Date.now()/1000)
    }

    await DB.update(jobData).into('job').where('id', job.id);

    console.error('Error Queue: ', error);
});

worker.on('completed', async (job: any, result: any) => {
    /**
     * Update log
     */
    let jobData = {
        execute_time: Math.floor(job.processedOn/1000),
        finish_time: Math.floor(job.finishedOn/1000),
        duration: Date.now() - job.processedOn,
        is_completed: 1,
        updated_at: Math.floor(Date.now()/1000)
    }

    await DB.update(jobData).into('job').where('id', job.id);

    console.log(`job ${job.id} has completed!`);
});