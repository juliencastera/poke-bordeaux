import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { en } from '../../translations/en';
import { fr } from '../../translations/fr';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { PokemonAvatarComponent } from './components/pokemon-avatar/pokemon-avatar.component';
import { AuthService } from './services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    BottomNavigationComponent,
    PokemonAvatarComponent,
    NgIf,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app';

  constructor(
    private readonly translate: TranslateService,
    public readonly authService: AuthService
  ) {
    translate.setTranslation('en', en);
    translate.setTranslation('fr', fr);

    translate.setDefaultLang(translate.getBrowserLang() === 'fr' ? 'fr' : 'en');
  }
}
