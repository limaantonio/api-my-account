import 'reflect-metadata';
import { app } from './app';

const listerner = app.listen(process.env.PORT || 3333, () => {
  if (listerner.address() === null) {
    console.log(`Server is running in port:` + process.env.PORT);
  }
});
