import * as solr from 'solr-client';

export const SolrClient = solr.createClient({
  host: '127.0.0.1',
  port: '8983',
  core: 'jzm_demo_core',
  path: '/solr', // Solr path (default is '/solr')
  secure: false, // Use secure (https) connection (default is false)
  bigint: true, // Parse longs as bigints (default is true)
});
