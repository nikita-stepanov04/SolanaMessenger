import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const passwordMismatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const formGroup = group as FormGroup;
  const password = formGroup.get('password');
  const passwordCopy = formGroup.get('passwordCopy');

  if (!password || !passwordCopy) {
    return null;
  }

  if (password.value !== passwordCopy.value) {
    passwordCopy.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (passwordCopy.hasError('passwordMismatch')) {
      passwordCopy.setErrors(null);
    }
    return null;
  }
};
