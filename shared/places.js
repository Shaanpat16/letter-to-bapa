export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
  "DR Congo","Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana",
  "Haiti","Honduras","Hong Kong","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Macau","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Samoa","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe"
];

export const CITIES = [
  "London","Leicester","Birmingham","Manchester","Leeds","Bradford","Coventry","Wolverhampton","Nottingham","Derby","Preston","Bolton","Luton","Watford","Harrow","Wembley","Edgware","Hounslow","Southall","Ilford","Croydon","Slough","Reading","Oxford","Cambridge","Bristol","Cardiff","Glasgow","Edinburgh","Newcastle","Sheffield","Liverpool","Milton Keynes","Peterborough","Northampton","Swindon","Southampton","Brighton","Norwich","Stoke-on-Trent","Blackburn","Huddersfield","Wellingborough","Rugby","Loughborough","Ashton-under-Lyne",
  "New York","New Jersey","Edison","Robbinsville","Chicago","Houston","Dallas","Atlanta","Los Angeles","San Francisco","San Jose","Seattle","Boston","Philadelphia","Washington DC","Detroit","Phoenix","Austin","Charlotte","Raleigh","Orlando","Tampa","Miami","Denver","Portland","Sacramento","San Diego","Las Vegas","Minneapolis","Columbus","Cleveland","Pittsburgh","Nashville","Kansas City","St Louis","Indianapolis","Milwaukee","Hartford","Baltimore","Richmond","Albany","Buffalo","Rochester","Cincinnati","Louisville","Memphis","Oklahoma City","Salt Lake City","Tucson","Albuquerque","Omaha","Des Moines","Boise","Anchorage","Honolulu",
  "Toronto","Brampton","Mississauga","Scarborough","Vancouver","Surrey","Calgary","Edmonton","Ottawa","Montreal","Winnipeg","Hamilton","London ON","Windsor","Halifax","Saskatoon","Regina","Victoria",
  "Ahmedabad","Gandhinagar","Vadodara","Surat","Rajkot","Bhavnagar","Jamnagar","Junagadh","Anand","Nadiad","Bharuch","Navsari","Valsad","Mehsana","Palanpur","Bhuj","Gondal","Amreli","Porbandar","Veraval","Godhra","Patan","Morbi","Sarangpur","Salangpur","Mumbai","Pune","Nagpur","Nashik","Thane","Delhi","New Delhi","Noida","Gurugram","Jaipur","Udaipur","Jodhpur","Indore","Bhopal","Lucknow","Kanpur","Varanasi","Patna","Kolkata","Bengaluru","Chennai","Hyderabad","Coimbatore","Kochi","Thiruvananthapuram","Chandigarh","Ludhiana","Amritsar","Dehradun","Guwahati","Bhubaneswar","Raipur","Ranchi","Goa",
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Kampala","Jinja","Entebbe","Dar es Salaam","Arusha","Mwanza","Zanzibar","Lusaka","Kitwe","Ndola","Harare","Bulawayo","Gaborone","Francistown","Lilongwe","Blantyre","Maputo","Johannesburg","Pretoria","Durban","Cape Town","Port Elizabeth","Lenasia","Laudium","Kigali","Addis Ababa","Lagos","Abuja","Accra","Antananarivo","Port Louis","Windhoek",
  "Sydney","Melbourne","Brisbane","Perth","Adelaide","Canberra","Gold Coast","Auckland","Wellington","Christchurch",
  "Dubai","Abu Dhabi","Sharjah","Ajman","Muscat","Doha","Manama","Kuwait City","Riyadh","Jeddah","Dammam",
  "Singapore","Kuala Lumpur","Bangkok","Hong Kong","Jakarta","Tokyo","Osaka","Seoul","Shanghai","Beijing","Manila","Ho Chi Minh City","Colombo","Kathmandu","Dhaka","Karachi","Lahore","Islamabad",
  "Lisbon","Porto","Madrid","Barcelona","Paris","Lyon","Marseille","Brussels","Antwerp","Amsterdam","Rotterdam","The Hague","Berlin","Frankfurt","Munich","Hamburg","Cologne","Zurich","Geneva","Basel","Vienna","Milan","Rome","Bologna","Dublin","Stockholm","Oslo","Copenhagen","Helsinki","Warsaw","Prague","Budapest","Athens","Istanbul",
  "Georgetown","Port of Spain","Paramaribo","Kingston","Bridgetown","Suva","Nadi","Mexico City","Sao Paulo","Buenos Aires","Santiago","Lima","Bogota","Panama City"
];

/** Approximate city centres for the letter-flight map. */
export const CITY_COORDS = {
  London: [51.5074, -0.1278],
  Wembley: [51.556, -0.2796],
  Leicester: [52.6369, -1.1398],
  Birmingham: [52.4862, -1.8904],
  Manchester: [53.4808, -2.2426],
  Leeds: [53.8008, -1.5491],
  Bradford: [53.796, -1.7594],
  Coventry: [52.4068, -1.5197],
  Nottingham: [52.9548, -1.1581],
  Harrow: [51.5806, -0.342],
  Edgware: [51.6137, -0.2753],
  Southall: [51.511, -0.3757],
  Croydon: [51.3762, -0.0982],
  Slough: [51.5105, -0.595],
  Bristol: [51.4545, -2.5879],
  Cardiff: [51.4816, -3.1791],
  Glasgow: [55.8642, -4.2518],
  Edinburgh: [55.9533, -3.1883],
  Liverpool: [53.4084, -2.9916],
  "Milton Keynes": [52.0406, -0.7594],
  "New York": [40.7128, -74.006],
  "New Jersey": [40.3573, -74.6672],
  Edison: [40.5187, -74.4121],
  Robbinsville: [40.2118, -74.629],
  Chicago: [41.8781, -87.6298],
  Houston: [29.7604, -95.3698],
  Dallas: [32.7767, -96.797],
  Atlanta: [33.749, -84.388],
  "Los Angeles": [34.0522, -118.2437],
  "San Francisco": [37.7749, -122.4194],
  "San Jose": [37.3382, -121.8863],
  Seattle: [47.6062, -122.3321],
  Boston: [42.3601, -71.0589],
  Philadelphia: [39.9526, -75.1652],
  "Washington DC": [38.9072, -77.0369],
  Detroit: [42.3314, -83.0458],
  Phoenix: [33.4484, -112.074],
  Austin: [30.2672, -97.7431],
  Orlando: [28.5383, -81.3792],
  Miami: [25.7617, -80.1918],
  Denver: [39.7392, -104.9903],
  Toronto: [43.6532, -79.3832],
  Brampton: [43.7315, -79.7624],
  Mississauga: [43.589, -79.6441],
  Vancouver: [49.2827, -123.1207],
  Calgary: [51.0447, -114.0719],
  Edmonton: [53.5461, -113.4938],
  Ottawa: [45.4215, -75.6972],
  Montreal: [45.5017, -73.5673],
  Ahmedabad: [23.0225, 72.5714],
  Gandhinagar: [23.2156, 72.6369],
  Vadodara: [22.3072, 73.1812],
  Surat: [21.1702, 72.8311],
  Rajkot: [22.3039, 70.8022],
  Sarangpur: [22.1565, 71.7714],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Delhi: [28.6139, 77.209],
  "New Delhi": [28.6139, 77.209],
  Noida: [28.5355, 77.391],
  Gurugram: [28.4595, 77.0266],
  Jaipur: [26.9124, 75.7873],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Nairobi: [1.2921, 36.8219],
  Kampala: [0.3476, 32.5825],
  Johannesburg: [-26.2041, 28.0473],
  "Cape Town": [-33.9249, 18.4241],
  Durban: [-29.8587, 31.0218],
  Lenasia: [-26.3167, 27.8167],
  Sydney: [-33.8688, 151.2093],
  Melbourne: [-37.8136, 144.9631],
  Auckland: [-36.8485, 174.7633],
  Dubai: [25.2048, 55.2708],
  "Abu Dhabi": [24.4539, 54.3773],
  Doha: [25.2854, 51.531],
  Singapore: [1.3521, 103.8198],
  "Hong Kong": [22.3193, 114.1694],
  Nairobi: [1.2921, 36.8219],
  Paris: [48.8566, 2.3522],
  Berlin: [52.52, 13.405],
  Lisbon: [38.7223, -9.1393],
  Dublin: [53.3498, -6.2603],
  "Port of Spain": [10.6596, -61.5086]
};

export const COUNTRY_COORDS = {
  "United Kingdom": [54.0, -2.0],
  "United States": [39.8, -98.5],
  India: [22.0, 79.0],
  Canada: [56.1, -106.3],
  Kenya: [0.02, 37.9],
  "South Africa": [-30.6, 22.9],
  Australia: [-25.3, 133.8],
  "New Zealand": [-40.9, 174.9],
  "United Arab Emirates": [23.4, 53.8],
  France: [46.2, 2.2],
  Germany: [51.2, 10.4],
  Portugal: [39.4, -8.2],
  Singapore: [1.35, 103.8],
  Uganda: [1.37, 32.29],
  Tanzania: [-6.37, 34.89]
};

export const LONDON = { name: "London", lat: 51.556, lng: -0.2796, label: "OVO Arena, Wembley" };

export function coordsFor(city, country) {
  if (city && CITY_COORDS[city]) {
    const [lat, lng] = CITY_COORDS[city];
    return { lat, lng, label: city };
  }
  if (country && COUNTRY_COORDS[country]) {
    const [lat, lng] = COUNTRY_COORDS[country];
    return { lat, lng, label: country };
  }
  return { lat: 40.7, lng: -74.0, label: city || country || "You" };
}

export function guessCountryFromLocale() {
  try {
    const loc = (typeof navigator !== "undefined" && (navigator.languages?.[0] || navigator.language)) || "";
    const region = loc.split("-").pop()?.toUpperCase();
    const map = {
      US: "United States", GB: "United Kingdom", IN: "India", CA: "Canada",
      AU: "Australia", KE: "Kenya", ZA: "South Africa", AE: "United Arab Emirates",
      NZ: "New Zealand", PT: "Portugal", FR: "France", DE: "Germany",
      SG: "Singapore", UG: "Uganda", TZ: "Tanzania", IE: "Ireland"
    };
    return map[region] || "United Kingdom";
  } catch {
    return "United Kingdom";
  }
}
