type Message = { challengeId: string, challengersOn: number }

type Subscriber = (msg: Message) => void;

class PubSub{
  private channels!: Subscriber[]

  publish(msg: Message){
    if(!this.channels[msg.challengeId])
      return;

    this.channels[msg.challengeId].push(msg);
  }

  subscribe(msg: Message){
    if(!this.channels[msg.challengeId])
      this.channels[msg.challengeId] = [];

    for(const sub of this.channels[msg.challengeId]){
      sub(msg);
    }
  }

}

export const pubSub = new PubSub();
