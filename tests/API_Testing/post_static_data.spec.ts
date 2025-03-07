//importing playwright
import { test, expect } from "@playwright/test";
import postRequestData from "../../test-data/api_requests/post_example.json";
test.use({
    baseURL: process.env.BASE_API_URL,
  });
/**
 * Author: Anuvrat Singh
 */
test("Post request using static data", async ({ request }) => {
  const response = await request.post(`/booking`, { data: postRequestData });
  const jsonResponse = JSON.stringify(response, null, 2);
  console.log("Response object in json format: " + jsonResponse);

  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");
});
