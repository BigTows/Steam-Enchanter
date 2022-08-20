import "reflect-metadata";
import SteamMarketApiImpl from "../api/steam/SteamMarketApiImpl";
import HttpClient from "../component/http/HttpClient";
import { anyObject, mock } from "jest-mock-extended";


test("Create order", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  const orderId = "18249712748912";

  mockHttp.post.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 1,
        buy_orderid: orderId
      }
    );
  }));

  const result = await steamMarketApi.createOrder(
    {
      sessionId: "124",
      currency: 5,
      appId: 730,
      marketHashName: "Any",
      priceTotal: 23,
      quantity: 151
    }
  );

  const data = new URLSearchParams();
  data.append("sessionid", "124");
  data.append("currency", "5");
  data.append("appid", "730");
  data.append("market_hash_name", "Any");
  data.append("price_total", "23");
  data.append("quantity", "151");
  data.append("billing_state", "");
  data.append("save_my_address", "0");

  expect(mockHttp.post).toHaveBeenCalledWith("localhost/market/createbuyorder/", data, anyObject());
  expect(result).toEqual(orderId);
});


test("Create order, unsuccessful", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  mockHttp.post.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 1243213
      }
    );
  }));


  await expect(() => {
    return steamMarketApi.createOrder(
      {
        sessionId: "124",
        currency: 5,
        appId: 730,
        marketHashName: "Any",
        priceTotal: 23,
        quantity: 151
      }
    );
  }).rejects.toThrowError("Can't place order at Steam :(");
});


test("Get order status", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  const sessionId = "io1n2k3n1knl";
  const orderId = "1252152151";

  mockHttp.get.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 1,
        active: 1,
        purchased: 414,
        quantity: "21415",
        quantity_remaining: "5151"
      }
    );
  }));

  const result = await steamMarketApi.getOrderStatus(sessionId, orderId);

  expect(mockHttp.get).toHaveBeenCalledWith(`localhost/market/getbuyorderstatus/?sessionid=${sessionId}&buy_orderid=${orderId}`);

  expect(result.success).toBe(true);
  expect(result.active).toBe(true);
  expect(result.purchased).toBe(414);
  expect(result.quantity).toBe(21415);
  expect(result.quantityRemaining).toBe(5151);
});



test("Get order status, unsuccessful", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  const sessionId = "io1n2k3n1knl";
  const orderId = "1252152151";

  mockHttp.get.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 2
      }
    );
  }));

  await expect(() => {
    return steamMarketApi.getOrderStatus(sessionId, orderId);
  }).rejects.toThrowError("Can't get order status at Steam :(");

});


test("Cancel order", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  const sessionId = "io1n2k3n1knl";
  const orderId = "1252152151";

  mockHttp.post.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 1
      }
    );
  }));

  await steamMarketApi.cancelOrder(sessionId, orderId);
});


test("Cancel order, unsuccessful", async () => {
  const mockHttp = mock<HttpClient>();
  const steamMarketApi = new SteamMarketApiImpl("localhost", mockHttp);

  const sessionId = "io1n2k3n1knl";
  const orderId = "1252152151";

  mockHttp.post.mockReturnValue(new Promise((resolve) => {
    resolve(
      {
        success: 214124
      }
    );
  }));

  await expect(() => {
    return steamMarketApi.cancelOrder(sessionId, orderId);
  }).rejects.toThrowError("Can't cancel order at Steam :(");
});