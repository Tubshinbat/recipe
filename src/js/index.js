// fetch()
// axios API серверээс татах боломжтой.

require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

/**
 *  Web app төлөв
 *  - Тухайн үзүүлж байгаа жор
 *  - Лайкласан жорууд
 *  - Захиалж байгаа жорын найрлаганууд
 */

const state = {};

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