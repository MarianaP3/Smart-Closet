import { Component, signal } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { ControlsComponent } from '../../components/controls/controls.component';
import { CountryCardComponent } from '../../components/country-card/country-card.component';

@Component({
  selector: 'app-home-page',
  imports: [CountryCardComponent, ControlsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public country = signal<Country>({
    name: 'Spain',
    capital: 'Madrid',
    region: 'Europe',
    population: 48300000,
    flag: 'https://flagcdn.com/es.svg',
  });

  public countries = signal<Country[]>([
    {
      name: 'United States',
      capital: 'Washington, D.C.',
      region: 'Americas',
      population: 334900000,
      flag: 'https://flagcdn.com/us.svg',
    },
    {
      name: 'Afghanistan',
      capital: 'Kabul',
      region: 'Asia',
      population: 40218234,
      flag: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg',
    },
    {
      name: 'Albania',
      capital: 'Tirana',
      region: 'Europe',
      population: 2837743,
      flag: 'https://flagcdn.com/al.svg',
    },
    {
      name: 'Argentina',
      capital: 'Buenos Aires',
      region: 'Americas',
      population: 45810000,
      flag: 'https://flagcdn.com/ar.svg',
    },
    {
      name: 'Australia',
      capital: 'Canberra',
      region: 'Oceania',
      population: 26010000,
      flag: 'https://flagcdn.com/au.svg',
    },
    {
      name: 'Brazil',
      capital: 'Brasília',
      region: 'Americas',
      population: 216400000,
      flag: 'https://flagcdn.com/br.svg',
    },
    {
      name: 'Canada',
      capital: 'Ottawa',
      region: 'Americas',
      population: 38900000,
      flag: 'https://flagcdn.com/ca.svg',
    },
    {
      name: 'China',
      capital: 'Beijing',
      region: 'Asia',
      population: 1412000000,
      flag: 'https://flagcdn.com/cn.svg',
    },
    {
      name: 'Egypt',
      capital: 'Cairo',
      region: 'Africa',
      population: 112700000,
      flag: 'https://flagcdn.com/eg.svg',
    },
    {
      name: 'France',
      capital: 'Paris',
      region: 'Europe',
      population: 67000000,
      flag: 'https://flagcdn.com/fr.svg',
    },
    {
      name: 'Germany',
      capital: 'Berlin',
      region: 'Europe',
      population: 83200000,
      flag: 'https://flagcdn.com/de.svg',
    },
    {
      name: 'India',
      capital: 'New Delhi',
      region: 'Asia',
      population: 1429000000,
      flag: 'https://flagcdn.com/in.svg',
    },
    {
      name: 'Japan',
      capital: 'Tokyo',
      region: 'Asia',
      population: 125000000,
      flag: 'https://flagcdn.com/jp.svg',
    },
    {
      name: 'Mexico',
      capital: 'Mexico City',
      region: 'Americas',
      population: 126000000,
      flag: 'https://flagcdn.com/mx.svg',
    },
    {
      name: 'Nigeria',
      capital: 'Abuja',
      region: 'Africa',
      population: 227000000,
      flag: 'https://flagcdn.com/ng.svg',
    },
    {
      name: 'South Africa',
      capital: 'Pretoria',
      region: 'Africa',
      population: 60400000,
      flag: 'https://flagcdn.com/za.svg',
    },
    {
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 48300000,
      flag: 'https://flagcdn.com/es.svg',
    },
    {
      name: 'United Kingdom',
      capital: 'London',
      region: 'Europe',
      population: 67700000,
      flag: 'https://flagcdn.com/gb.svg',
    },
  ]);

  orderByName(): void {
    this.countries.update((countries) =>
      [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  orderByPopulation(): void {
    this.countries.update((countries) =>
      [...countries].sort((a, b) => a.population - b.population),
    );
  }
}
