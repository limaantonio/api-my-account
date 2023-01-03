import { Router } from 'express';
import BudgetController from './controllers/BudgetController';
import AccountController from './controllers/AccountController';
import BalanceController from './controllers/BalanceController';
import EntryController from './controllers/EntryController';
import ItemController from './controllers/ItemController';

const routes = Router();
const budgetController = new BudgetController();
const accountController = new AccountController();
const balanceController = new BalanceController();
const entryController = new EntryController();
const itemController = new ItemController();

routes.get('/budget', budgetController.listAll);
routes.get('/budget/:id/', budgetController.listById);
routes.post('/budget', budgetController.create);
routes.put('/budget/:id/', budgetController.update);
routes.delete('/budget/:id/', budgetController.deletById);

routes.get('/account', accountController.listAll);
routes.get('/account/:id/', accountController.listById);
routes.post('/account', accountController.create);
routes.put('/account/:id/', accountController.update);

routes.get('/balance', balanceController.listAll);
routes.get('/balance/:id/', balanceController.listById);
routes.post('/balance', balanceController.create);
routes.put('/balance/:id/', balanceController.update);

routes.get('/entry', entryController.listAll);
routes.get('/entry/:id/', entryController.listById);
routes.post('/entry', entryController.create);
routes.put('/entry/:id/', entryController.update);

routes.get('/item', itemController.listAll);
routes.get('/item/:id/', itemController.listById);
routes.post('/item', itemController.create);
routes.put('/item/:id/', itemController.update);

export { routes };
