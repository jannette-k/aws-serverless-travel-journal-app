const API_BASE = process.env.REACT_APP_API_GATEWAY_ENDPOINT
console.log("API BASE:", API_BASE);
// "https://a4n4qq3ty8.execute-api.eu-north-1.amazonaws.com/dev";

const getToken = () => localStorage.getItem("access_token");

export const fetchTrips = async () => {
  const res = await fetch(`${API_BASE}/trips`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const addTripApi = async (trip) => {
  const res = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(trip),
  });
  return res.json();
};

export const updateTripApi = async (id, trip) => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(trip),
  });
  return res.json();
};

export const deleteTripApi = async (id) => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};