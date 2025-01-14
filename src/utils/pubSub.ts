type Message = { challengersOn: number, createdAt: Date, endedAt?: Date }

type Subscriber = (msg: Message) => void;

class PubSub{
  private channels: Record<string, Subscriber[]> = {};

  publish(challengeId: string, msg: Message){
    if(!this.channels[challengeId])
      return;
    for(const sub of this.channels[challengeId]){
      if(!msg.endedAt) msg.endedAt = null;
      sub(msg);
    }
  }

  subscribe(challengeId: string, sub: Subscriber){
    if(!this.channels[challengeId])
      this.channels[challengeId] = [];

    this.channels[challengeId].push(sub);
  }

}

export const pubSub = new PubSub();