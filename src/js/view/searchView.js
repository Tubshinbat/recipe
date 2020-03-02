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
    elements.pageButtons.innerHTML = '';
}
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 5) => {

    const start = (currentPage - 1) * resPerPage;
    const end = currentPage * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Хуудаслалтын товчуудыг гаргаж өгөх
    const totalPages = Math.ceil(recipes.length / resPerPage);
    renderButtons(currentPage, totalPages);
};

// type ==> 'prev' 'next'
const createButton = (page, type, direction) =>
    `<button class="btn-inline results__btn--${type}" data-goto="${page}">
<span>Хуудас ${page}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
</svg>
</button>`;

const renderButtons = (currentPage, totalPages) => {
    let buttonHtml;

    if (currentPage === 1 && totalPages > 1) {
        // 1-р хуудсан дээр байна, 2-р хуудас гэдэг товчийг гарга
        buttonHtml = createButton(2, "next", 'right');
    } else if (currentPage < totalPages) {
        // Өмнөх болон дараачийн хуудас руу шилжих товчуудыг үзүүл
        buttonHtml = createButton(currentPage - 1, "prev", 'left');
        buttonHtml += createButton(currentPage + 1, "next", 'right');
    }
    else if (currentPage === totalPages) {
        // Хамгийн сүүлийн хуудас дээр байна. өмнөх рүү шилжүүлэх товчийг л үзүүлнэ
        buttonHtml = createButton(currentPage - 1, "prev", 'left');
    }

    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHtml);
}
