import { auth } from './auth';
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  jwt.verify(token, 'f35c778693250ec5bdd4ba24aa4d9815', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid' });
    }

    req.userId = decoded.id;
    return next();
  });
}
