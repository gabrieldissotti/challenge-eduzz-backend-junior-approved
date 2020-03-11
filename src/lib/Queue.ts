import Bee from 'bee-queue';
import DepositMail from '../app/jobs/DepositMail';
import BuyMail from '../app/jobs/BuyMail';
import SellMail from '../app/jobs/SellMail';
import redisConfig from '../config/redis';

const jobs = [DepositMail, BuyMail, SellMail];

class Queue {
  queues?: any

  constructor () {
    this.queues = {};

    this.init();
  }

  init (): void {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add (queue, job): any {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue (): void {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure (job, err): void {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
