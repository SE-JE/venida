/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

import { SandboxedJob } from 'bullmq';
const Bull = require('bullmq');
const Knex = require('knex');
const redisConfig = require('../../../../config/redis');
const databaseConfig = require('../../../../config/database');
const Path = require('node:path');

const VenidaPath = Path.join(__dirname, '..', '..', '..', '..');

const BullQueue = new Bull.Queue(redisConfig.get('queueName'), {
    connection: redisConfig.get('redisConfig')
});

const KnexInstance = Knex(databaseConfig.get('connection')['mysql']);

module.exports = async (job: SandboxedJob) => {

    console.log('job data', job.data);

    let pathJob = Path.join(VenidaPath, 'app', 'Job', job.data.type);
    pathJob = pathJob.replace(/ /g, '\ ');

    const Job = require(pathJob);

    let jobInstance = new Job();

    jobInstance.BullQueue = BullQueue;
    jobInstance.DB = KnexInstance;

    await jobInstance.handle(job.data);

    return;
}
