import SteamMarketApi from "../steam/api/SteamMarketApi";

export interface CardOrderOperationContext {
  orderId: string,
  quantity: number
}

class SteamCardTraderProcess {
  private readonly steamApi: SteamMarketApi;
  private readonly cardOrderOperationContexts: Array<CardOrderOperationContext>;
  private readonly interval: NodeJS.Timer;
  private readonly sessionId: string;

  constructor(steamApi: SteamMarketApi, sessionId: string, cardOrderOperationContexts: Array<CardOrderOperationContext>) {
    this.steamApi = steamApi;
    this.sessionId = sessionId;
    this.cardOrderOperationContexts = cardOrderOperationContexts;


    const self = this;
    this.interval = setInterval(async () => {
      await this.checkOrders(self);
    }, 4000);
  }

  private async checkOrders(self: SteamCardTraderProcess) {
    if (self.cardOrderOperationContexts.length ===0){
      console.log("Terminate task")
      clearInterval(self.interval)
    }

    for (let context of self.cardOrderOperationContexts) {
      const currentStatus = await self.steamApi.getOrderStatus(self.sessionId, context.orderId);
      if (!currentStatus.active || currentStatus.purchased === context.quantity) {
        this.deleteOrder(context.orderId);
      }
      console.log(currentStatus.purchased);
    }
  }

  public async cancel() {
    for (let context of this.cardOrderOperationContexts) {
      await this.steamApi.cancelOrder(this.sessionId, context.orderId);
      this.deleteOrder(context.orderId);
    }
  }

  private deleteOrder(orderId: string) {
    const result = this.cardOrderOperationContexts.find(context => {
      return context.orderId === orderId;
    });
    if (result !== undefined) {
      console.log(`delete order ${orderId}`);
      this.cardOrderOperationContexts.splice(
        this.cardOrderOperationContexts.indexOf(result), 1
      );
    }
  }
}

export default SteamCardTraderProcess;