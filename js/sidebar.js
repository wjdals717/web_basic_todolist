const sidebarToggleButtononClickHandle = () => {
    const sidebar = document.querySelector(".sidebar");

    if(sidebar.classList.contains("isSidebarOpen")){
        sidebar.classList.remove("isSidebarOpen");
    }else {
        sidebar.classList.add("isSidebarOpen");
    }
}

const sidebarMenuOnClickHandle = (target) => {
    console.log(target.innerHTML);
    switch (target.innerHTML) {
        case "전체":
            Routes.getInstance().routeState = "first-page";
            break;
        case "날짜별 Todo":
            Routes.getInstance().routeState = "date-page";
            Calendar.getInstance().buildCalendar();
            break;
    }
    Routes.getInstance().show();
    sidebarToggleButtononClickHandle(); /* 메뉴가 클릭되면 사이드바 닫힐 수 있도록 함 */
}
