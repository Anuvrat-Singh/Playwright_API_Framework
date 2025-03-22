//importing playwright
import { test, expect } from "@playwright/test";
import postRequestData from "../../test-data/api_requests/post_example.json";
import { formatAPIRequest } from "../../src/utils/apihelpers";
import path from "path";
import fs from "fs";
import { faker, Faker } from "@faker-js/faker";
test.use({
  baseURL: process.env.BASE_API_URL,
});
/**
 * Author: Anuvrat Singh
 */
test("Post request using dynamic data 02 - using faker lib", async ({
  request,
}) => {
  const filepath = path.join(
    __dirname,
    "../../test-data/api_requests/dynamic_post_01.json"
  );

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ min: 1000, max: 10000 });
  const jsonTemplate = fs.readFileSync(filepath, "utf-8");
  const values = [firstName, lastName, totalPrice];
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
  expect(jsonResponse.booking.firstname).toBe(firstName);
  expect(jsonResponse.booking.lastname).toBe(lastName);
  expect(jsonResponse.booking.bookingdates.checkin).toBe("2025-01-01");
  expect(jsonResponse.booking.bookingdates.checkout).toBe("2025-01-02");
});
