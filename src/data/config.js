export const SITE = {
  name: "Maison Wood",
  email: "hello@maisonwood.com",
  phone: "+880 1700-000000",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
  hours: "Sat – Thu, 10:00 AM – 8:00 PM",
};

export const SHIPPING = { dhaka: 500, outside: 1200, freeAbove: 100000 };

export const COUPONS = {
  WELCOME10: { type: "percent", value: 10, min: 0, label: "10% off your order" },
  FURNI500: { type: "flat", value: 500, min: 20000, label: "৳500 off orders above ৳20,000" },
};

export const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay in cash when your order arrives." },
  { id: "bkash", label: "bKash", desc: "Send money to 01700-000000 (Personal), then enter the details below.", number: "01700-000000" },
  { id: "nagad", label: "Nagad", desc: "Send money to 01800-000000 (Personal), then enter the details below.", number: "01800-000000" },
];

export const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export const DISTRICTS = [
  "Bagerhat","Bandarban","Barguna","Barishal","Bhola","Bogura","Brahmanbaria","Chandpur","Chapainawabganj","Chattogram",
  "Chuadanga","Cox's Bazar","Cumilla","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha","Gazipur","Gopalganj",
  "Habiganj","Jamalpur","Jashore","Jhalokati","Jhenaidah","Joypurhat","Khagrachhari","Khulna","Kishoreganj","Kurigram",
  "Kushtia","Lakshmipur","Lalmonirhat","Madaripur","Magura","Manikganj","Meherpur","Moulvibazar","Munshiganj","Mymensingh",
  "Naogaon","Narail","Narayanganj","Narsingdi","Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh",
  "Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati","Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj",
  "Sunamganj","Sylhet","Tangail","Thakurgaon",
];
