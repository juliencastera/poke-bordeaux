import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserProfile } from '../../../model/user';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-options',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, TranslateModule],
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss'],
})
export class ProfileOptionsComponent {
  @Input() options: UserProfile['options'] | undefined;
  @Output() toggleOptionEvent = new EventEmitter<
    PickOne<UserProfile['options']>
  >();

  toggleOption($event: PickOne<UserProfile['options']>) {
    this.toggleOptionEvent.emit($event);
  }
}
