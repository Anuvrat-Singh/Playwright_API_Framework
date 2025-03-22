interface bookingAPI {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  additionalneeds: string;
  bookingdates: bookingDates;
}

interface bookingDates {
  checkin: string;
  checkout: string;
}
