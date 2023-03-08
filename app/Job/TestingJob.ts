/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Job {

    const BaseQueueJob = require('../../system/Core/Base/Queue/BaseQueueJob');

    export class TestingJob extends BaseQueueJob {

        private DB: any;

        public async handle (data: any) {

            console.log('run testing worker');

            const user = await this.DB.first('*')
                .from('user')
                .orderBy('id', 'DESC');

            console.log('Last user: ', user);

            return;
        }
    }
}

module.exports = App.Job.TestingJob;