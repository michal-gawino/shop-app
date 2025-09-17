import { RxStompConfig } from '@stomp/rx-stomp';
import { ChatService } from './chat/chat.service';
import { environment } from '../environments/environment';

export const websocketConfig: RxStompConfig = {
  brokerURL: 'ws://' + new URL(environment.apiUrl).host + '/ws',

  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 500,

  debug: (msg: string): void => {},
  logRawCommunication: true,
};

export function websocketFactory() {
  const rxStomp = new ChatService();
  rxStomp.configure(websocketConfig);
  rxStomp.activate();
  return rxStomp;
}
