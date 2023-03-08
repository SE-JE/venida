/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Job {

    const BaseQueueJob = require('../../system/Core/Base/Queue/BaseQueueJob');

    export class TestingJob extends BaseQueueJob {

        public async handle (data: any) {

            console.log('run testing worker');
        }
    }
}

module.exports = App.Job.TestingJob;