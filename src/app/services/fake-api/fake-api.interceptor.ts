import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { FakeApi } from './fake-api.service';
import APP_CONFIG from '../../app.config.json'

export const fakeApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (APP_CONFIG.useFakeDb && req.url.startsWith(APP_CONFIG.apiRoot)) {
    const fakeApi = inject(FakeApi)
    return fakeApi.handle(req)
  }
  else {
    return next(req);
  }
};