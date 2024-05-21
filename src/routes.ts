import { Router } from 'express';
import UserController from './controllers/UserController';
import BudgetController from './controllers/BudgetController';
import AccountController from './controllers/AccountController';
import EntryController from './controllers/EntryController';
import ItemController from './controllers/ItemController';
import BudgetMonthController from './controllers/BudgetMonthController';
import SubAccountController from './controllers/SubAccountController';
import AuthController from './controllers/AuthController';
import { auth } from './middlewares/auth';

const routes = Router();
const authController = new AuthController();
const userController = new UserController();
const budgetController = new BudgetController();
const accountController = new AccountController();
const entryController = new EntryController();
const itemController = new ItemController();
const budgetMonthController = new BudgetMonthController();
const subAccountController = new SubAccountController();

routes.post('/authenticated', authController.authenticate);
routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);
routes.post('/forgot_password', authController.forgot_password);
routes.post('/reset_password', authController.reset_password);

// routes.post('/user', userController.create);
routes.get('/user/:id/', userController.listById);
routes.get('/users/', userController.list);

routes.get('/budget/user/:id/', budgetController.listAll);
routes.get('/budget/:id/', budgetController.listById);
routes.post('/budget', budgetController.create);
routes.put('/budget/:id/', budgetController.update);
routes.delete('/budget/:id/', budgetController.deletById);
routes.post('/budget/:id/', budgetController.setFlagIncomeRegister);

routes.post('/month', budgetMonthController.create);
routes.get('/months/budget/:id/', budgetMonthController.listByBudget);
routes.delete('/budget/month/:id/', budgetMonthController.deletById);
routes.get('/months/budget/balance/:id/', budgetMonthController.getBalance);
routes.get('/month/:id/', budgetMonthController.listById);
routes.put('/month/:id/', budgetMonthController.updateByid);

routes.get('/accounts', accountController.list);
routes.get('/account/:id/', accountController.listById);
routes.get('/accountid/:id/', accountController.listOneAccount);
routes.post('/account', accountController.create);
routes.put('/account/:id/', accountController.update);
routes.delete('/account/:id/', accountController.deletById);
routes.get('/account/budget/:id/', accountController.listByBudgetId);
routes.get('/account/balance/budget/:id/', accountController.getBalance);
routes.post('/account/budget/:id/', accountController.createByBudget);

routes.post('/subaccount', subAccountController.create);
routes.get('/subaccount/balance/budget/:id/', subAccountController.getBalance);
routes.get('/subaccount/budget/:id/', subAccountController.listSubAccount);
routes.delete('/subaccount/:id/', subAccountController.deletById);
routes.get('/subaccount/:id/', subAccountController.listById);
routes.put('/subaccount/:id/', subAccountController.update);

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
