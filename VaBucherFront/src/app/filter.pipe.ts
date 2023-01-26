import { Pipe, PipeTransform } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(joboffers: JobOffer[], domainFilter: string, locationFilter: string, salaryFilter: string): JobOffer[] {
    if (!joboffers) { return []; }
    if (!domainFilter && !locationFilter && !salaryFilter) { return joboffers; }
    return joboffers.filter(joboffer => {
      if (domainFilter && joboffer.domain.toLowerCase().indexOf(domainFilter.toLowerCase()) === -1) {
        return false;
      }
      if (locationFilter && joboffer.localisation.toLowerCase().indexOf(locationFilter.toLowerCase()) === -1) {
        return false;
      }
      if (salaryFilter && joboffer.salaire.toLowerCase().indexOf(salaryFilter.toLowerCase()) === -1) {
        return false;
      }
      return true;
    });
  }
}