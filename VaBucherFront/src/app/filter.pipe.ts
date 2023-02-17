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
      const specialChars = {
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'a',
        'å': 'a',
        'æ': 'a',
        'ç': 'c',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ñ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'o',
        'ø': 'o',
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ü': 'u',
        'ý': 'y',
        'ÿ': 'y'
      };

      function removeSpecialChars(str: string) {
        let result = str;
        for (const [char, replacer] of Object.entries(specialChars)) {
          result = result.replace(new RegExp(char, 'g'), replacer);
        }
        return result;
      }

      if (domainFilter && joboffer.domain.toLowerCase().indexOf(removeSpecialChars(domainFilter.toLowerCase())) === -1) {
        return false;
      }

      if (locationFilter && joboffer.localisation.toLowerCase().indexOf(locationFilter.toLowerCase()) === -1) {
        return false;
      }
      if(jobtypefilter) {
      let selectedJobTypes = jobtypefilter.split(',');
      let jobtypes = joboffer.types.split(',');
      if (jobtypefilter && !selectedJobTypes.some(selectedType =>
        jobtypes.some(type => type.toLowerCase().includes(selectedType.toLowerCase())) ||
        joboffer.title.toLowerCase().includes(selectedType.toLowerCase()))) {
      return false;
    }
  }

      return true;
    });
  }
}
