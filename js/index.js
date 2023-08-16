window.onload = () => {
    // Calendar.getInstance().buildCalendar();
    TodoListService.getInstance().updateTodoList();

    // 첫 번째 페이지의 컨테이너 요소 선택
    // const firstPageContainer = document.querySelector(".first-page-container");
    // if (firstPageContainer) {
    //     const calendar1 = new Calendar();
    //     calendar1.buildCalendar();
    // }

    // // 두 번째 페이지의 컨테이너 요소 선택
    // const datePageContainer = document.querySelector(".date-page-container");
    // if (datePageContainer) {
    //     const calendar2 = new Calendar();
    //     calendar2.buildCalendar();
    // }
}