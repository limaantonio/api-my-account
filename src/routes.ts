import { Router } from 'express';
import BudgetController from './controllers/BudgetController';
import AccountController from './controllers/AccountController';

const routes = Router();
const budgetController = new BudgetController();
const accountController = new AccountController();

routes.get('/budget', budgetController.listAll);
routes.get('/budget/:id/', budgetController.listById);
routes.post('/budget', budgetController.create);
routes.put('/budget/:id/', budgetController.update);

routes.get('/account', accountController.listAll);
routes.get('/account/:id/', accountController.listById);
routes.post('/account', accountController.create);
routes.put('/account/:id/', accountController.update);

export { routes };
