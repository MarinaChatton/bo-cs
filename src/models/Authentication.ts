import type { Component } from "vue";

export enum AuthenticationStep {
  CheckingSession = 'checkingSession',
  LogingIn = 'logingIn',
  SendingMail = 'sendingMail',
  DefiningPassword = 'definingPassword',
}

export enum AuthenticationState {
  Default = 'default',
  Error = 'error',
  Success = 'success',
  Progress = 'progress',
}

export enum MessageType {
  Info = 'info',
  Error = 'error',
  Success = 'success',
  Notice = 'notice',
}

export enum FormElementType {
  Text = 'text',
  Password = 'password',
  Checkbox = 'checkbox',
  Submit = 'submit',
}

export interface IFormElement {
  id: string,
  type: FormElementType,
  value: any,
  label?: string,
  autocomplete?: string,
  autofocus?: boolean,
  icon?: Component,
}

export type TMessage = MessageType | string;
