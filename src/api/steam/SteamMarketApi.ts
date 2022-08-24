export interface CreateMarkerOrderRequest {
  sessionId: string,
  currency: number,
  appId: number,
  marketHashName: string,
  priceTotal: number,
  quantity: number,
}

export interface OrderStatusResponse {
  success: boolean,
  active: boolean,
  purchased: number,
  quantity: number,
  quantityRemaining: number
}


interface SteamMarketApi {
  createOrder(request: CreateMarkerOrderRequest): Promise<string>;

  getOrderStatus(sessionId: string, orderId: string): Promise<OrderStatusResponse>;

  cancelOrder(sessionId: string, orderId: string): Promise<void>;
}

export default SteamMarketApi;