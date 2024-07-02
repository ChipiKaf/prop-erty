import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(value: T[], filterString: string, propName: keyof T): string[] {
    const resultArray: T[] = [];
    if (value) {
      if (value.length === 0 || filterString === '' || propName === '') {
        return value as unknown as string[];
      }

      for (const item of value) {
        if (item[propName] === filterString) {
          resultArray.push(item);
        }
      }
      return resultArray as unknown as string[];
    }
    return resultArray as unknown as string[];
  }
}
