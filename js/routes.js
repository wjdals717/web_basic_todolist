class Routes {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null){
            this.#instance = new Routes();
        }
        return this.#instance;
    }

    routeState = "first-page";
    // routeState = "date-page";

    show() {
        this.clear();
        switch (this.routeState) {
            case "first-page":
                const welcomePage = document.querySelector(".first-page-container");
                welcomePage.classList.remove("invisible");
                break;
            case "date-page":
                const todolistPage = document.querySelector(".date-page-container");
                todolistPage.classList.remove("invisible");
                break;
        }
    }

    clear() {
        const pages = document.querySelectorAll(".main-container > div"); /* div 여러 개를 리스트로 들고 옴*/
        pages.forEach(pages => {
            pages.classList.add("invisible"); /* 모든 page를 invisible을 걸어두고 보여줄 페이지만 invisible을 제거해 보여지도록 함*/
        });
    }
}