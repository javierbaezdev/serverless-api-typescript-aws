export interface ResponseService<T> {
  success: boolean;
  data?: T;
  error?: string;
}
