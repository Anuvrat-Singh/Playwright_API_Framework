//importing playwright
import { test, expect } from "@playwright/test";
import { getPostAPIRequestBody } from "../../src/utils/apihelpers";
import { faker } from "@faker-js/faker";
import generateToken from "../../test-data/api_requests/generateAuthToken.json";
import putRequestData from "../../test-data/api_requests/putRequestData.json";
import patchRequestData from "../../test-data/api_requests/patchRequestData.json";
test.use({
  baseURL: process.env.BASE_API_URL,
});
/**
 * Author: Anuvrat Singh
 */
test("DELETE request: Delete booking details after creating a booking", async ({
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

  //create GET api request
  //https://restful-booker.herokuapp.com/booking/:id

  const bookingID = jsonResponse.bookingid;
  console.log("booking id: " + bookingID);
  const getAPIresponse = await request.get(`/booking/${bookingID}`);

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

  //generate auth token
  const tokenResponse = await request.post(`/auth`, { data: generateToken });
  expect(tokenResponse.status()).toBe(200);
  expect(tokenResponse.statusText()).toBe("OK");
  const tokenResponseJSON = await tokenResponse.json();
  const authToken = tokenResponseJSON.token;
  console.log("Token: " + authToken);

  // create patch request
  const patchAPIResponse = await request.patch(`/booking/${bookingID}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${authToken}`,
    },
    data: patchRequestData,
  });
  expect(patchAPIResponse.status()).toBe(200);
  expect(patchAPIResponse.statusText()).toBe("OK");
  const patchAPIResponse_JSON = await patchAPIResponse.json();
  console.log(
    "PUT API response : " + JSON.stringify(patchAPIResponse_JSON, null, 2)
  );

  // create delete request
  const deleteAPIResponse = await request.delete(`/booking/${bookingID}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${authToken}`,
    },
  });
  expect(deleteAPIResponse.status()).toBe(201);
  expect(deleteAPIResponse.statusText()).toBe("Created");
  console.log("Delete api response: " + (await deleteAPIResponse.body()));
});
