import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const SECRET = 'f35c778693250ec5bdd4ba24aa4d9815';

interface AuthenticatedRequest extends Request {
  userId: string; // Ou o tipo correto para o ID do usuário
}

export function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (!(parts.length === 2)) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid' });
    }

    req.userId = (decoded as { id: string }).id;
    return next();
  });
}
