import { Router } from 'express';

export type ApiMethod = keyof Pick<
  Router,
  'get' | 'post' | 'put' | 'delete' | 'patch'
>;
