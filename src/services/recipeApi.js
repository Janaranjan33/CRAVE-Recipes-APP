import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export async function getCategories() {
  const { data } = await api.get("/categories.php");
  return data.categories || [];
}

export async function getAreas() {
  const { data } = await api.get("/list.php?a=list");
  return data.meals || [];
}

export async function getMealsByName(name) {
  const { data } = await api.get("/search.php", { params: { s: name } });
  return data.meals || [];
}

export async function getMealsByCategory(category) {
  const { data } = await api.get("/filter.php", { params: { c: category } });
  return data.meals || [];
}

export async function getMealsByArea(area) {
  const { data } = await api.get("/filter.php", { params: { a: area } });
  return data.meals || [];
}

export async function getMealsByIngredient(ingredient) {
  const { data } = await api.get("/filter.php", { params: { i: ingredient } });
  return data.meals || [];
}

export async function getMealById(id) {
  const { data } = await api.get("/lookup.php", { params: { i: id } });
  return data.meals?.[0] || null;
}

export async function getRandomMeals(count = 12) {
  const requests = Array.from({ length: count }, () => api.get("/random.php"));
  const results = await Promise.allSettled(requests);
  const meals = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value.data.meals?.[0])
    .filter(Boolean);
  return [...new Map(meals.map((meal) => [meal.idMeal, meal])).values()];
}