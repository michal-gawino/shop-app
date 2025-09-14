import { RxStompConfig } from "@stomp/rx-stomp";
import { ChatService } from "./chat/chat.service";

export const websocketConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:8081/ws',

  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 500,

  debug: (msg: string): void => {
    
  },
  logRawCommunication: true
};


export function websocketFactory() {
  const rxStomp = new ChatService();
  rxStomp.configure(websocketConfig);
  rxStomp.activate();
  return rxStomp;
}