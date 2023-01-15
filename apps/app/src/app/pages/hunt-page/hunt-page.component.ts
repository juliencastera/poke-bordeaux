import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

/** COMPONENTS */
import { EnergyStateComponent } from './components/energy-state/energy-state.component';
import { PokeballListComponent } from './components/pokeball-list/pokeball-list.component';

/** INTERFACES */
import { IncrementableCounter } from '../../interfaces/hunt/incrementableCounter.interface';
import { PokeballsState, Pokeball } from '../../interfaces/hunt/pokeballsState.interface';

/** CONSTANTS */
import { HuntStep } from '../../enums/hunt/HuntStep.enum';

/** SERVICES */
import { HuntService } from './hunt.service';
import { IntervalService } from '../../services/interval.service';

@Component({
  selector: 'app-hunt-page',
  standalone: true,
  imports: [
    CommonModule,
    EnergyStateComponent,
    PokeballListComponent,
    MatButtonModule,
  ],
  templateUrl: './hunt-page.component.html',
  styleUrls: ['./hunt-page.component.scss'],
})
export class HuntPageComponent {
  energyState!: IncrementableCounter;
  pokeballsState!: PokeballsState;
  step: HuntStep = HuntStep.HUNT;
  selectedBall: Pokeball | null = null;

  constructor(
    private readonly huntService: HuntService,
    private readonly intervalService: IntervalService
  ) {
    this.huntService.huntState$.subscribe((huntState) => {
      if (huntState === null) return;

      this.energyState = huntState.energyState;
      this.pokeballsState = huntState.pokeballsState;
    });

    this.intervalService.interval$.subscribe(() => {
      if (this.energyState) {
        this.energyState = this.huntService.handleEnergyIncrementation(this.energyState);
      };

      if (this.pokeballsState) {
        this.pokeballsState = this.huntService.handlePokeballsIncrementation(this.pokeballsState);
      }
    });
  }

  goToBallSelection() {
    this.huntService.decrementEnergyState(this.energyState);
    this.setStep(HuntStep.BALL_SELECTION);
  }

  giveUp() {
    this.selectedBall = null;
    this.setStep(HuntStep.HUNT);
  }

  selectBall(pokeball: Pokeball) {
    this.selectedBall = pokeball;
  }

  capture() {
    if (!this.selectedBall) return;
  }

  private setStep(step: HuntStep) {
    this.step = step;
  }
}
