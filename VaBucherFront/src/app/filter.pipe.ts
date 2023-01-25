import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(joboffers: any[], domainFilter: string, locationFilter: string, salaryFilter: string): any[] {
    if (!joboffers) {
      return [];
    }
    if (!domainFilter && !locationFilter && !salaryFilter) {
      return joboffers;
    }
    return joboffers.filter(joboffer => {
      if (domainFilter && joboffer.title.toLowerCase().indexOf(domainFilter.toLowerCase()) === -1) {
        return false;
      }
      if (locationFilter && joboffer.location.toLowerCase().indexOf(locationFilter.toLowerCase()) === -1) {
        return false;
      }
      if (salaryFilter && joboffer.salaire.toLowerCase().indexOf(salaryFilter.toLowerCase()) === -1) {
        return false;
      }
      console.log(joboffer);
      
      return true;
    });
  }
}
