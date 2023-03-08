/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core.Base.Queue {

    const redisConfig = require('../../../../config/redis');

    export class BaseQueueJob {

        private BullQueue: any;

        private DB: any;

        public async add (type: string, data: any, options?: any) {

            if (!options) {
                options = {};
            }

            options.removeOnComplete = true;
            options.jobId = `${Date.now()}`;

            data.type = type;

            await this.BullQueue.add(redisConfig.get('queueName'), data, options).catch((error: any) => {
                console.error('Error add queue:', error);
            });
        }
    }
}

module.exports = System.Core.Base.Queue.BaseQueueJob;