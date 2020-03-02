import { elements } from "./base";

const renderRecipe = recipe => {
    // console.log(recipe);

    // publisher: "Simply Recipes"
    // title: "How to Grill Pizza"
    // source_url: "http://www.simplyrecipes.com/recipes/how_to_grill_pizza/"
    // recipe_id: "36476"
    // image_url: "http://forkify-api.herokuapp.com/images/howtogrillpizzad300x20086a60e1b.jpg"
    // social_rank: 99.99999704095504
    // publisher_url: "http://simplyrecipes.com"

    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    // ul - рүү нэмнэ
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);

}

export const clearSearchQuery = () => {
    elements.searchInput.value = '';
}
export const clearSearchResult = () => {
    elements.searchResultList.innerHTML = '';
}
export const getInput = () => elements.searchInput.value;
export const renderRecipes = recipes => {

    recipes.forEach(renderRecipe);
};