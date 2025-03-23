//importing playwright
import { test, expect } from "@playwright/test";
import { getPostAPIRequestBody } from "../../src/utils/apihelpers";
import { faker, Faker } from "@faker-js/faker";
test.use({
  baseURL: process.env.BASE_API_URL,
});
/**
 * Author: Anuvrat Singh
 */
test("GET booking details after creating a booking - using query params", async ({
  request,
}) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ min: 1000, max: 10000 });
  const postAPIBody = await getPostAPIRequestBody(
    firstName,
    lastName,
    totalPrice,
    true,
    "Breakfast",
    "01-01-2025",
    "01-02-2025"
  );

  //create post api request and save it in response
  const response = await request.post(`/booking`, {
    data: postAPIBody,
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

  //create GET api request using query params
  //https://restful-booker.herokuapp.com/booking/:id

  const bookingID = jsonResponse.bookingid;
  console.log("booking id: " + bookingID);
  const getAPIresponse = await request.get(`/booking/`, {
    params: {
      firstName: firstName,
      lastName: lastName,
    },
  });

  //use api response object to perform api response level validations
  expect(getAPIresponse.status()).toBe(200);
  expect(getAPIresponse.statusText()).toBe("OK");
  expect(getAPIresponse.headers()["content-type"]).toContain(
    "application/json"
  );

  const getAPI_JSONresponse = await getAPIresponse.json();
  console.log(
    "GET API response : " + JSON.stringify(getAPI_JSONresponse, null, 2)
  );
});
