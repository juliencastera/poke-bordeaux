import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import isEqual from 'lodash.isequal';

/** MATERIAL */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';

/** COMPONENTS */
import { FilterPageComponent } from '../filter-page/filter-page.component';
import { PokemonAvatarComponent } from '../../components/pokemon-avatar/pokemon-avatar.component';
import { Pokemon } from '../../components/pokemon-avatar/model/pokemon';

/** SERVICES */
import { PokedexPokemon, PokedexService } from './pokedex.service';

/** INTERFACES */
import { PokedexFilters } from '../../../interfaces';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    PokemonAvatarComponent,
    MatGridListModule,
    TranslateModule,
  ],
  templateUrl: './pokedex-page.component.html',
  styleUrls: ['./pokedex-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexPageComponent {
  // Main properties
  pokemons: PokedexPokemon[] = [];
  filteredPokemons: PokedexPokemon[] = [];

  // Filter properties
  pokedexFilters: PokedexFilters = {
    hideUnknown: false,
    hideKnownNotOwned: false,
    selectedTypes: [],
    searchNameValue: '',
  };

  // Pokemon informations
  selectedPokemon: Pokemon | null = null;

  constructor(
    private readonly dialog: MatDialog,
    private readonly pokedexService: PokedexService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.pokedexService.pokedexPokemons$.subscribe((pokemons) => {
      if (!pokemons) return;

      pokemons.forEach((pokemon) => {
        const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
        if (index >= 0) {
          if (!isEqual(this.pokemons[index], pokemon)) {
            this.pokemons[index] = pokemon;
          }
        } else {
          this.pokemons.push(pokemon);
        }
      });

      this.changeDetectorRef.markForCheck();
      this.handleFilters();
      this.handleSearchFilter();
    });
  }

  setSelectedPokemon(p: Pokemon) {
    this.selectedPokemon = p;
  }

  unselectPokemon() {
    this.selectedPokemon = null;
  }

  handleFilters() {
    const selectedTypes = new Set<string>(
      this.pokedexFilters.selectedTypes.map((t) => t.name.toLowerCase())
    );
    const hideUnknown = this.pokedexFilters.hideUnknown;
    const hideKnownNotOwned = this.pokedexFilters.hideKnownNotOwned;

    this.filteredPokemons = this.pokemons.filter((pokemon) => {
      if (selectedTypes.size > 0) {
        if (
          !pokemon.types.some((t) => selectedTypes.has(t.name.toLowerCase()))
        ) {
          return false;
        }
      }

      if (hideUnknown && pokemon.quantity === undefined) return false;

      return !(hideKnownNotOwned && pokemon.quantity === 0);
    });
    this.changeDetectorRef.markForCheck();
  }

  handleSearchFilter() {
    this.filteredPokemons = this.pokemons.filter((p) =>
      p.name
        .toLowerCase()
        .includes(this.pokedexFilters.searchNameValue.toLowerCase())
    );
    this.changeDetectorRef.markForCheck();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterPageComponent, {
      width: '400px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: this.pokedexFilters,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pokedexFilters = {
          ...this.pokedexFilters,
          selectedTypes: result.data.types,
          hideKnownNotOwned: result.data.hideKnownNotOwned,
          hideUnknown: result.data.hideUnknown,
        };
        this.handleFilters();
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  handleFavoritePokemon(pokemon: PokedexPokemon): void {
    this.pokedexService.handleFavoritePokemon(pokemon);
    this.changeDetectorRef.markForCheck();
  }
}
