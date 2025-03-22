//importing playwright
import { test, expect } from "@playwright/test";
import postRequestData from "../../test-data/api_requests/post_example.json";
import { formatAPIRequest } from "../../src/utils/apihelpers";
import path from "path";
import fs from "fs";
test.use({
  baseURL: process.env.BASE_API_URL,
});
/**
 * Author: Anuvrat Singh
 */
test("Post request using dynamic data 01", async ({ request }) => {
  const filepath = path.join(
    __dirname,
    "../../test-data/api_requests/dynamic_post_01.json"
  );
  const jsonTemplate = fs.readFileSync(filepath, "utf-8");
  const values = ["Anuvrat", "Singh", 1000];
  const postRequestData = await formatAPIRequest(jsonTemplate, values);

  //create post api request and save it in response
  const response = await request.post(`/booking`, {
    data: JSON.parse(postRequestData),
  });
  //convert response into json format
  const jsonResponse = await response.json();
  //log the response for debugging
  console.log(
    "Response object in json format: " + JSON.stringify(jsonResponse, null, 2)
  );
  //perform validations
  //use api response object to perform api response level validations
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");
  expect(response.headers()["content-type"]).toContain("application/json");

  //validate property/key in response
  //use jsonResponse object to perform json response level validation of api call
  expect(jsonResponse.booking).toHaveProperty("firstname");
  expect(jsonResponse.booking).toHaveProperty("lastname");
  expect(jsonResponse.booking.bookingdates).toHaveProperty("checkin");
  expect(jsonResponse.booking.bookingdates).toHaveProperty("checkout");

  //validate api response body -> actual values in the response body
  expect(jsonResponse).toHaveProperty("bookingid");
  expect(jsonResponse.booking.firstname).toBe("Anuvrat");
  expect(jsonResponse.booking.lastname).toBe("Singh");
  expect(jsonResponse.booking.bookingdates.checkin).toBe("2025-01-01");
  expect(jsonResponse.booking.bookingdates.checkout).toBe("2025-01-02");
});
