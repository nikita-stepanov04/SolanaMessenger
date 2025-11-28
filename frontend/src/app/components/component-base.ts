import {ErrorService} from '../services/error-service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {FormHelperService} from '../services/form-helper-service';
import {Directive} from '@angular/core';
import {ResourcesService} from '../services/resources-service';

@Directive()
export class ComponentBase {
  constructor(
    protected errorService: ErrorService,
    protected router: Router,
    protected fh: FormHelperService,
    protected fb: FormBuilder,
    protected resources: ResourcesService
  ) {}
}
