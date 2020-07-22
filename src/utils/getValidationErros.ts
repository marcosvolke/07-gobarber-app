import { ValidationError } from 'yup';

// É como se criasse um dictionary do .net
interface Errors {
  // Sintaxe para propriedade com nome dinâmico... Doideira
  [key: string]: string;

}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
