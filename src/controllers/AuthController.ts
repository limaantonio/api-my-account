import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const mailer = require('../modules/mailer');
import UserRepository from '../respositories/UserRepository';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const SECRET = 'f35c778693250ec5bdd4ba24aa4d9815';

function generateToken(params = {}) {
  return jwt.sign(params, SECRET, {
    expiresIn: 86400,
  });
}

export default class AuthController {
  async register(request: Request, response: Response) {
    const { email, password, name } = request.body;

    try {
      const userRepository = getCustomRepository(UserRepository);

      if (await userRepository.findOne({ where: { email } })) {
        return response.status(400).send({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        email,
        name,
        password: hashedPassword,
      });
      await userRepository.save(user);

      // @ts-ignore
      user.password = undefined;

      return response.send({
        user,
        token: generateToken({ id: user.id }),
      });
    } catch (err) {
      console.error(err);
      return response.status(400).send({ error: 'Registration failed' });
    }
  }

  async authenticate(request: Request, response: Response) {
    const { email, password } = request.body;
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return response.status(400).send({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).send({ error: 'Invalid password' });
    }

    // @ts-ignore
    user.password = undefined;

    return response.send({
      user,
      token: generateToken({ id: user.id }),
    });
  }

  async forgot_password(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const userRepository = getCustomRepository(UserRepository);

      const user = await userRepository.findOne({ where: { email } });

      console.log(user);

      if (!user) {
        return response.status(400).send({ error: 'User not found' });
      }

      const token = crypto.randomBytes(20).toString('hex');
      const now = new Date();
      now.setHours(now.getHours() + 1);

      user.reset_password_token = token;
      user.reset_password_expires = now;

      await userRepository.save(user);

      mailer.sendMail(
        {
          to: email,
          from: 'antonio@gmail.com',
          template: 'auth/forgot_password',
          context: { token },
        },
        // @ts-ignore
        err => {
          if (err) {
            console.error(err);
            return response
              .status(400)
              .send({ error: 'Cannot send forgot password email.' });
          }
          return response.send();
        },
      );
    } catch (err) {
      console.error(err);
      return response
        .status(400)
        .send({ error: 'Error on forgot password, try again' });
    }
  }

  async reset_password(request: Request, response: Response) {
    const { email, token, password } = request.body;

    try {
      const userRepository = getCustomRepository(UserRepository);

      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return response.status(400).send({ error: 'User not found' });
      }

      if (token !== user.reset_password_token) {
        return response.status(400).send({ error: 'Token invalid.' });
      }

      const now = new Date();
      if (now > user.reset_password_expires) {
        return response.status(400).send({ error: 'Token expired.' });
      }

      user.password = await bcrypt.hash(password, 10);
      // @ts-ignore
      user.reset_password_token = null;
      // @ts-ignore
      user.reset_password_expires = null;

      await userRepository.save(user);

      return response.send();
    } catch (err) {
      console.error(err);
      return response
        .status(400)
        .send({ error: 'Cannot reset password, try again.' });
    }
  }
}
