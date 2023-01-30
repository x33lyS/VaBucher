import { Pipe, PipeTransform } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(joboffers: JobOffer[], domainFilter: string, locationFilter: string, jobtypefilter: string): JobOffer[] {
    if (!joboffers) { return []; }
    if (!domainFilter && !locationFilter && !jobtypefilter) { return joboffers; }
    return joboffers.filter(joboffer => {
      if (domainFilter && joboffer.domain.toLowerCase().indexOf(domainFilter.toLowerCase()) === -1) {
        return false;
      }
      if (locationFilter && joboffer.localisation.toLowerCase().indexOf(locationFilter.toLowerCase()) === -1) {
        return false;
      }
      let selectedJobTypes = jobtypefilter.split(',');
      let jobtypes = joboffer.types.split(',');
      if (!selectedJobTypes.some(selectedType => jobtypes.some(type => type.toLowerCase().includes(selectedType.toLowerCase())))) {
        return false;
      }
      return true;
    });
  }
}
