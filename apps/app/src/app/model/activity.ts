import { Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface BaseActivity<D> {
  id?: string;
  type: ActivityType;
  data: BasePayload & D;
  createdAt: Timestamp;
  isVisible?: Observable<boolean>;
}

export interface BasePayload {
  userId: string;
}

export type ActivityType = 'trade-info' | 'trade-ask' | 'capture';

export interface AskerPayload {
  askerId: string;
  askerPokemonId: number;
}

export interface TargetPayload {
  userPokemonId: number;
}

export interface TradeInfoActivityPayload extends AskerPayload, TargetPayload {}

export interface TradeAskActivityPayload extends AskerPayload, TargetPayload {
  status: 'pending' | 'accepted' | 'declined';
}

export type CaptureActivityPayload = TargetPayload;
