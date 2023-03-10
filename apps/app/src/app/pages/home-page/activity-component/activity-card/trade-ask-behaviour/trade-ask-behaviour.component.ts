import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseActivity,
  TradeAskActivityPayload,
} from '../../../../../model/activity';
import { UserProfile } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';
import { PokemonService } from '../../../../../services/pokemon.service';
import { Pokemon } from '../../../../../components/pokemon-avatar/model/pokemon';
import { ActivityService } from '../../../../../services/activity.service';
import { ObserveVisibilityDirective } from '../../../../../directives/observe-visibility.directive';
import { combineLatest, map, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

export type TradeAskBehaviourComponentViewModel = Observable<{
  targetPokemon: Pokemon;
  asker: UserProfile;
  askerPokemon: Pokemon;
}>;

@Component({
  selector: 'app-trade-ask-behaviour',
  standalone: true,
  imports: [CommonModule, ObserveVisibilityDirective, TranslateModule],
  templateUrl: './trade-ask-behaviour.component.html',
})
export class TradeAskBehaviourComponent {
  @Input() activity!: BaseActivity<TradeAskActivityPayload>;
  @Output() setPokemonImage = new EventEmitter<string>();

  viewModel$?: TradeAskBehaviourComponentViewModel;

  constructor(
    private readonly userService: UserService,
    private readonly pokemonService: PokemonService,
    private readonly activityService: ActivityService,
    private readonly ref: ChangeDetectorRef
  ) {}

  async accept() {
    await this.activityService.acceptTrade(this.activity);
  }

  async decline() {
    await this.activityService.declineTrade(this.activity);
  }

  onVisible() {
    this.viewModel$ = combineLatest([
      this.userService.getUserFromFirestore(this.activity.data.askerId),
      this.pokemonService.getPokemonFromId(this.activity.data.askerPokemonId),
      this.pokemonService.getPokemonFromId(this.activity.data.userPokemonId),
    ]).pipe(
      map(([asker, askerPokemon, targetPokemon]) => ({
        asker,
        askerPokemon,
        targetPokemon,
      }))
    );

    this.viewModel$.subscribe(({ askerPokemon }) => {
      this.setPokemonImage.emit(askerPokemon.image);
      this.ref.detectChanges();
    });
  }
}
