import type { Core } from '@strapi/strapi';
import axios from 'axios';
import { randomUUID } from 'crypto';

async function postVersion(event: any) {
  await axios.post('https://api-v1.ichno.io/version', {
    id: randomUUID(),
    type: event.model.singularName,
    keys: {
      id: event.result.id
    },
    object: event.result,
    labels: {
      changedBy: event.result.createdBy?.email ??  event.result.updatedBy?.email
    }
  },{
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'babc521db91d809bf53465cff6dc6f7c'
    }
  })
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi } ) {
    strapi.db.lifecycles.subscribe({
      async afterCreate(data) {
        await postVersion(data);
      },

      async afterUpdate(data) {
        await postVersion(data);
      },
    });
  },
};
