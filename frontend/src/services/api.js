import { config, readSession } from './config';
import { createDemoService } from './demo';
import { graphqlService } from './graphql';
import { restService } from './rest';
export const api = config.source === 'demo' ? createDemoService(localStorage, () => readSession()?.usuario) : config.source === 'rest' ? restService : graphqlService;
