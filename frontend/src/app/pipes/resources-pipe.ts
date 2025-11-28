import { Pipe, PipeTransform } from '@angular/core';
import {Observable} from 'rxjs';
import {ResourcesService} from '../services/resources-service';

@Pipe({
  name: 'res',
})
export class ResourcesPipe implements PipeTransform {
  constructor(private resources: ResourcesService) {
  }
  transform(key: string): Observable<string> {
    return this.resources.get(key);
  }
}
