/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Package {

    const redisConfig = Venida.RedisConfig;

    export class Queue {

        public async dispatch (type: string, data: any, options?: any) {

            this.initQueueInstance();

            if (!options) {
                options = {};
            }

            options.removeOnComplete = true;
            options.jobId = `${Date.now()}`;

            data.type = type;

            await Venida.redisQueue[redisConfig.get('queueName')].add(redisConfig.get('queueName'), data, options).catch((error: any) => {
                console.error('Failed to add queue: ', error);
            });
        }

        private initQueueInstance () {

            /**
             * Init queue instance
             */
            if (Venida.RedisClient) {

                if (!Venida.redisQueue) {
                    Venida.redisQueue = {};
                }

                if (!Venida.redisQueue[redisConfig.get('queueName')]) {

                    const BullMQ = Venida.import('bullmq', true);

                    Venida.redisQueue[redisConfig.get('queueName')] = new BullMQ.Queue(redisConfig.get('queueName'), {
                        connection: redisConfig.get('redisConfig')
                    });
                }
            }
        }
    }
}

module.exports = new System.Package.Queue();