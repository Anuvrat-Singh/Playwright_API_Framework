export async function formatAPIRequest(
  template: String,
  values: any[]
): Promise<string> {
  return template.replace(/{(\d+)}/g, (match, p1) => {
    const index = parseInt(p1, 10);
    return index < values.length ? String(values[index]) : match;
  });
}

// create api request on the basis of interface
export async function getPostAPIRequestBody(
  fName: string,
  lName: string,
  price: number,
  depositPaid: boolean,
  additionalneeds: string,
  checkin: string,
  checkout: string
) {
  const apiRequest: bookingAPI = {
    firstname: fName,
    lastname: lName,
    totalprice: price,
    depositpaid: depositPaid,
    additionalneeds: additionalneeds,
    bookingdates: {
      checkin: checkin,
      checkout: checkout,
    },
  };
  return apiRequest;
}
