import { Router } from 'express';
import { Controller } from './controllers/Controller';

const routes = Router();
const controller = new Controller();

routes.get('/', controller.index);

export { routes };
