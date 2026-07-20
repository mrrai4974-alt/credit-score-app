import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Role } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export interface AuthPayload {
  sub: string; // user id
  role: Role;
  name: string;
}

export interface AuthedRequest extends Request {
  auth?: AuthPayload;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

/** Populate req.auth if a valid bearer token is present (does not reject). */
export function parseAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.auth = jwt.verify(header.slice(7), JWT_SECRET) as AuthPayload;
    } catch {
      /* ignore invalid token */
    }
  }
  next();
}

/** Require a logged-in user, optionally restricted to specific roles. */
export function requireAuth(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: 'Authentication required' });
    if (roles.length && !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Forbidden for your role' });
    }
    next();
  };
}
