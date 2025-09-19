const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const recipeContainer = document.querySelector(".recipe-container");
const baseUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const modeButton = document.querySelector(".mode-button");
const body = document.querySelector("body");
const randomButton = document.querySelector(".random-button");

function renderMeal(meal) {
  const mealName = meal.strMeal;
      const mealImgUrl = meal.strMealThumb;
      const mealCategory = meal.strCategory;
      const mealInstructions = meal.strInstructions;
      const mealLink = meal.strYoutube;

      const article = document.createElement("article");
      article.classList.add("recipe-card");
      recipeContainer.append(article);

      const recipeImg = document.createElement("img");
      recipeImg.src = mealImgUrl;
      recipeImg.alt = mealName;
      recipeImg.classList.add("recipe-img");
      article.append(recipeImg);

      const recipeName = document.createElement("h2");
      recipeName.classList.add("recipe-name");
      recipeName.textContent = mealName;
      article.append(recipeName);

      const recipeCategory = document.createElement("h3");
      recipeCategory.classList.add("category");
      recipeCategory.textContent = mealCategory;
      article.append(recipeCategory);

      const shortInstructions = document.createElement("p");
      shortInstructions.textContent =
        mealInstructions.substring(0, 150) + "...";
      shortInstructions.classList.add("instructions");
      article.append(shortInstructions);

      const readMore = document.createElement("button");
      readMore.classList.add("read-more");
      readMore.textContent = "Read More";
      readMore.addEventListener("click", () => {
        if (readMore.textContent === "Read More") {
          shortInstructions.textContent = mealInstructions;
          readMore.textContent = "Read Less";
        } else {
          shortInstructions.textContent =
            mealInstructions.substring(0, 150) + "...";
          readMore.textContent = "Read More";
        }
      });
      article.append(readMore);

      const viewButton = document.createElement("button");
      viewButton.classList.add("link-button");
      article.append(viewButton);

      const buttonLink = document.createElement("a");
      buttonLink.href = mealLink;
      buttonLink.textContent = "View Recipe";
      buttonLink.target = "_blank";
      viewButton.append(buttonLink);

      const ingredientsList = document.createElement("ul");
      ingredientsList.classList.add("ingredients-list");
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
          const li = document.createElement("li");
          li.textContent = `${measure} ${ingredient}`;
          ingredientsList.append(li);
        }
      }
      const showIngredients = document.createElement("button");
      showIngredients.classList.add("show-ingredients");
      showIngredients.textContent = "Show Ingredients";
      showIngredients.addEventListener("click", () => {
        if (showIngredients.textContent === "Show Ingredients") {
          article.append(ingredientsList);
          showIngredients.textContent = "Hide Ingredients";
        } else {
          article.remove(ingredientsList);
          showIngredients.textContent = "Show Ingredients";
        }
      });
      article.append(showIngredients);
}

const search = async () => {
  const input = searchInput.value.trim();
  if (input === "") {
    alert("Input cannot be empty!");
    return;
  }
  const message = document.createElement("p");
  const url = `${baseUrl}${input.toLowerCase()}`;
  const response = await fetch(url);
  message.textContent = "Loading...";
  recipeContainer.append(message);
  if (response.ok) {
    const data = await response.json();
    recipeContainer.innerHTML = "";
    if (!data.meals) {
      message.textContent = "No recipes found for your search";
      message.classList.add("message");
      recipeContainer.append(message);
      return;
    }
    for (let meal of data.meals) {
      renderMeal(meal);
    }
  }
};

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    search();
  }
});

searchButton.addEventListener("click", () => {
  search();
});

modeButton.addEventListener("click", () => {
  if (modeButton.textContent === "Dark Mode") {
    body.classList.add("dark");
    body.classList.remove("light");
    modeButton.textContent = "Light Mode";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    modeButton.textContent = "Dark Mode";
  }
});

randomButton.addEventListener("click" , async () => {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php";
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    recipeContainer.innerHTML = "";
    renderMeal(data.meals[0]);
  }
});
