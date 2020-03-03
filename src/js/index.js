// fetch()
// axios API серверээс татах боломжтой.

require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from './model/Recipe';
import { renderRecipe, clearRecipe, highlightSelectedRecipe } from './view/recipeView';
import List from "./model/List";
import * as likesView from './view/likesView';
import * as listView from "./view/listView";
import Like from "./model/Like";
/**
 *  Web app төлөв
 *  - Тухайн үзүүлж байгаа жор
 *  - Лайкласан жорууд
 *  - Захиалж байгаа жорын найрлаганууд
 */

const state = {};

// Лайк цэсийг хаах
/**
 * MCV 
 * Хайлтын контроллер = Model ===> Controller <== View
 * Холбох үүрэгтэй
 */

const controlSearch = async () => {
    // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
    const query = searchView.getInput();

    if (query) {
        // 2) Шинээр хайлтын обьектийг үүсгэж өгнө
        state.search = new Search(query);
        // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ
        searchView.clearSearchQuery();
        searchView.clearSearchResult();
        renderLoader(elements.searchResultDiv);

        // 4) Хайлтыг гүйцэтгэнэ
        await state.search.doSearch();
        // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ
        clearLoader();
        if (state.search.result === undefined) alert('хайлтаар илэрцгүй');
        else searchView.renderRecipes(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.pageButtons.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    // closest функц ямар нэгэн element-тэй хамгийн ойр DOM target-ыг хайж олно

    if (btn) {
        const gotoPageNumber = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchResult();
        searchView.renderRecipes(state.search.result, gotoPageNumber);
    }
});

/**
 *  Жорын контроллер
 */
const controllRecipe = async () => {
    // 1) URL - аас ID ийг салгах
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 2) Жорын моделийг үүсгэж өгнө
        state.recipe = new Recipe(id);

        // 3) Дэлгэцийг бэлдэнэ
        clearRecipe();

        renderLoader(elements.recipeDiv);
        highlightSelectedRecipe(id);

        // 4) Жороо татаж авчирна
        await state.recipe.getRecipe();
        // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
        clearLoader();
        state.recipe.calcTime();
        state.recipe.calcHuniiToo();

        // 6) Жороо дэлгэцэнд гаргана
        renderRecipe(state.recipe, state.likes.isLiked(id));
    }
}

// window.addEventListener('hashchange', controllRecipe);
// window.addEventListener('load', controllRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controllRecipe));

window.addEventListener('load', e => {
    if (!state.likes) state.likes = new Like();

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // Лайкууд байвал тэдгээрийг цэсэнд нэмж харуулна.
    state.likes.likes.forEach(like => likesView.renderLike())
})

// Найрлагын контроллер

const controlList = () => {
    // Найрлаганы моделийг үүсгэнэ
    state.list = new List();
    // Өмнө харагдаж байсан найрлагыг арилгана
    listView.clearItems();

    // Уг модел рүү одоо харагдаж байгаа жорны бүх найрлагыг авч хийнэ.
    state.recipe.ingredients.forEach(n => {
        // Тухайн найрлагыг модел-руу хийнэ
        const item = state.list.addItem(n);
        // Тухайн найрлагыг дэлгэцэнд гаргана.
        listView.renderItem(item);
    });
};

/**
 * Like Controller
 */

const controlLike = () => {
    // 1) Лайкийн моделийг үүсгэнэ.
    if (!state.likes) state.likes = new Like();

    // 2) Одоо харагдаж байгаа жорын ID-г олж авах 
    const currentRecipeId = state.recipe.id;
    // 3) Энэ жорыг лайкласан эсэхийг шалгах
    if (state.likes.isLiked(currentRecipeId)) {
        // Лайкласан бол лайкийг нь болиулна
        state.likes.deleteLike(currentRecipeId);
        // Лайкын цэснээс устгана
        likesView.deleteLike(currentRecipeId);
        // Лайк товчны лайкласан байдлыг болиулах
        likesView.toggleLikeBtn(false);
    } else {
        // Лайклаагүй бол лайклана
        const newLike = state.likes.addLike(
            currentRecipeId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image_url
        );
        likesView.renderLike(newLike);
        likesView.toggleLikeBtn(true);
    };

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

elements.recipeDiv.addEventListener('click', e => {
    // DOM deer Listener тавих
    if (e.target.matches('.recipe__btn, .recipe__btn *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

elements.shoppingList.addEventListener('click', e => {
    // Click li element's data=itemid filter get
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Олдсон ID-тэй орцыг устгана
    state.list.deleteItem(id);
    // Дэлгэцээс ID орцыг олж бас устгана.
    listView.deleteItem(id);
    // console.log(obj);
});