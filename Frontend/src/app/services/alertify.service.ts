import { Injectable } from '@angular/core';
// import * as alertyfy from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  constructor() {}

  success(message: string) {
    // alertyfy.success(message);
    console.log(message);
  }

  warning(message: string) {
    // alertyfy.warning(message);
    console.warn(message);
  }

  error(message: string) {
    // alertyfy.error(message);
    console.error(message);
  }
}
