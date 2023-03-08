/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

import { SandboxedJob } from 'bullmq';
const Bull = require('bullmq');
const redisConfig = require('../../../../config/redis');
const Path = require('node:path');

const VenidaPath = Path.join(__dirname, '..', '..', '..', '..');

const BullQueue = new Bull.Queue(redisConfig.get('queueName'), {
    connection: redisConfig.get('redisConfig')
});

module.exports = async (job: SandboxedJob) => {

    console.log('job data', job.data);

    let path = Path.join(VenidaPath, 'app', 'Job', job.data.type);
    path = path.replace(/ /g, '\ ');

    const Task = require(path);

    let taskInstance = new Task();

    taskInstance.BullQueue = BullQueue;    

    await taskInstance.handle(job.data);

    return;
}
