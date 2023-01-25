import dotenv from 'dotenv'
import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
  '@': `${__dirname}/src`,
});

dotenv.config()