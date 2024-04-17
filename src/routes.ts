import { Router } from 'express';
import BudgetController from './controllers/BudgetController';
import AccountController from './controllers/AccountController';
import EntryController from './controllers/EntryController';
import ItemController from './controllers/ItemController';
import BudgetMonthController from './controllers/BudgetMonthController';

const routes = Router();
const budgetController = new BudgetController();
const accountController = new AccountController();
const entryController = new EntryController();
const itemController = new ItemController();
const budgetMonthController = new BudgetMonthController();

routes.get('/budget', budgetController.listAll);
routes.get('/budget/:id/', budgetController.listById);
routes.post('/budget', budgetController.create);
routes.put('/budget/:id/', budgetController.update);
routes.delete('/budget/:id/', budgetController.deletById);

routes.post('/budget/month', budgetMonthController.create);
routes.get('/months/budget/:id/', budgetMonthController.listByBudget);
routes.delete('/budget/month/:id/', budgetMonthController.deletById);
routes.get('/months/budget/balance/:id/', budgetMonthController.getBalance);

routes.get('/account', accountController.listAll);
routes.get('/account/:id/', accountController.listById);
routes.post('/account', accountController.create);
routes.put('/account/:id/', accountController.update);
routes.delete('/account/:id/', accountController.deletById);
routes.post('/accounts', accountController.createAll);
routes.get('/account/budget/:id/', accountController.listByBudgetId);
routes.get('/account/balance/budget/:id/', accountController.getBalance);

routes.get('/entry', entryController.listAll);
routes.get('/entry/:id/', entryController.listById);
routes.post('/entry', entryController.create);
routes.put('/entry/:id/', entryController.update);
routes.delete('/entry/:id/', entryController.deletById);
routes.post('/entry/:id/', entryController.pay);
routes.get('/entry/month/:id/', entryController.listByMonthId);

routes.get('/item', itemController.listAll);
routes.get('/item/:id/', itemController.listById);
routes.post('/item', itemController.create);
routes.put('/item/:id/', itemController.update);

export { routes };
