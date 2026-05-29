import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-card',
  imports: [DecimalPipe],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.css',
})
export class CountryCardComponent {
  // country = signal<Country>({
  //   name: 'Spain',
  //   capital: 'Madrid',
  //   region: 'Europe',
  //   population: 47351567,
  //   flag: 'https://flagcdn.com/w320/es.png',
  // });
  country = input.required<Country>();

  
}
