/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Package {

    const redisConfig = Venida.RedisConfig;

    export class Queue {

        private QueryBuilder = Venida.Datasource;

        public async dispatch (type: string, data: any, options?: any) {

            this.initQueueInstance();

            if (!options) {
                options = {};
            }

            options.removeOnComplete = true;
            // options.jobId = `${Date.now()}`;

            data.type = type;

            /**
             * Insert Log Job
             */
            let insertJob: any = {
                identifier: `${redisConfig.get('queueName')}.${type}`,
                type: type,
                data: JSON.stringify(data),
                options: JSON.stringify(options)
            }

            if (options?.repeat) {
                
                insertJob.type = type;
                insertJob.is_repeatable = 1;
            } else {

                let jobId = await this.QueryBuilder.insert(insertJob).into('job')
                    .catch((err: any) => {
                        console.error(err);
                        Venida.Response.exception('INTERNAL_SERVER_ERROR', 'Failed to dispatch queue job', {
                            message: err
                        })
                    });

                if (jobId.length > 0) {
                    
                    options.jobId = `${jobId[0]}`;
                }

                await Venida.redisQueue[redisConfig.get('queueName')].add(redisConfig.get('queueName'), data, options).catch((error: any) => {
                    console.error('Failed to add queue: ', error);
                });
            }
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