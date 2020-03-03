export default class Likes {
    constructor() {
        this.readDataFromLocalStorage();
        if (!this.like)
            this.likes = [];
    }

    addLike(id, title, publisher, img) {
        const like = { id, title, publisher, img };
        this.likes.push(like);
        //  storage руу хадгална
        this.saveDataToLocalStorage();
        return like;
    }

    deleteLike(id) {
        // id гэдэг ID-тэй орцын индексийг массиваас хайж олно.
        const index = this.likes.findIndex(el => el.id === id);

        // Уг индекс дээрх элементийг массиваас устгана
        this.likes.splice(index, 1);
        this.saveDataToLocalStorage();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }
    saveDataToLocalStorage() {
        localStorage.setItem("likes", JSON.stringify(this.likes));
    }

    readDataFromLocalStorage() {
        this.likes = JSON.parse(localStorage.getItem('likes'));
    }
}
