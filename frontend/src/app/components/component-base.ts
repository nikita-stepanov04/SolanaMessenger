
import {Router} from '@angular/router';
import {FormHelperService} from '../services/form-helper-service';
import {ResourcesService} from '../state/resources/resources-service';
import {Directive} from '@angular/core';

@Directive()
export class ComponentBase {
  constructor(
    protected router: Router,
    protected fh: FormHelperService,
    protected resources: ResourcesService
  ) {}
}
