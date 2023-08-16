class Calendar {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null){
            this.#instance = new Calendar();
        }
        return this.#instance;
    }
    
    nowMonth = new Date();      // 현재 달을 페이지를 로드한 날의 달로 초기화
    today = new Date();         // 페이지를 로드한 날짜를 저장
    calDateEl = new Date();
    selectedDateElement = null;
    
    constructor() {
        this.today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화
        this.buildCalendar();
        console.log(document.querySelector(".today"));
    }
    
    buildCalendar() {   //현재 달
        let firstDate = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), 1);     // 이번달 1일
        let lastDate = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() + 1, 0);  // 이번달 마지막날
        
        let tbody_Calendar = document.querySelectorAll(".calendar > tbody");

        tbody_Calendar.forEach((tbody_Calendar_el) => {
            console.log(tbody_Calendar_el);
            
            let calYearEl = document.querySelectorAll(".calYear");      // 연도 숫자 갱신
            calYearEl.forEach((element) => {    
                element.innerText = this.nowMonth.getFullYear(); 
            });

            let calMonthEl = document.querySelectorAll(".calMonth");    // 월 숫자 갱신
            calMonthEl.forEach((element) => {
                element.innerText = this.leftPad(this.nowMonth.getMonth() + 1);
            });
            
            this.calDateEl = document.querySelector(".calDate");        //로드 시 오늘 날짜 선택
            this.calDateEl.innerText = this.leftPad(this.nowMonth.getDate());

            while (tbody_Calendar_el.rows.length > 0) { // 이전 출력결과가 남아있는 경우 초기화
                tbody_Calendar_el.deleteRow(tbody_Calendar_el.rows.length - 1);
            }

            let nowRow = tbody_Calendar_el.insertRow();    // 첫번째 행 추가
            for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
                let nowColumn = nowRow.insertCell();        // 열 추가
            }
        
            for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  
                
                let nowColumn = nowRow.insertCell();                    // 새 열을 추가하고

                let newDIV = document.createElement("p");
                newDIV.innerHTML = this.leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력
                nowColumn.appendChild(newDIV);
                
                if (nowDay.getDay() == 6) {                             // 토요일인 경우
                    nowRow = tbody_Calendar_el.insertRow();             // 새로운 행 추가
                }

                if(newDIV.innerHTML == this.calDateEl.innerText){
                    this.selectedDateElement = newDIV;
                    console.log(this.selectedDateElement.innerHTML);
                }

                // newDIV.innerText = this.calDateEl.innerText;
                //  Calendar.getInstance().choiceDate(this.calDateEl);
                
                newDIV.onclick = function () { Calendar.getInstance().choiceDate(this); }

                if (nowDay.getFullYear() == this.today.getFullYear() && nowDay.getMonth() == this.today.getMonth() && nowDay.getDate() == this.today.getDate()) { // 오늘인 경우           
                    newDIV.className = "today";
                    // newDIV.classList.add(".choiceDay");
                }
                else if (nowDay < this.today) {                  // 지난날인 경우
                    newDIV.className = "pastDay";
                }
                else {                                      // 미래인 경우
                    newDIV.className = "futureDay";
                }
            }
        });
    }

    choiceDate(newDIV) {    // 날짜 선택
        if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
            document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
        }
        newDIV.classList.add("choiceDay");           // 선택된 날짜에 "choiceDay" class 추가

        this.nowMonth.setDate(newDIV.innerHTML);
        console.log(this.nowMonth.getDate());
        // this.choiceDay = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), newDIV.innerHTML);
        // console.log(this.choiceDay.getDate());

        this.calDateEl.innerText = document.querySelector(".choiceDay").innerHTML;          //선택된 날짜 갱신
        console.log("choiceDate: " + document.querySelector(".choiceDay").innerHTML);
        
        TodoListService.getInstance().updateTodoList();
        document.getElementById("todolist-view").value = "whole";
        TodoListService.getInstance().changeTodolistView(document.getElementById("todolist-view"));
    }

    prevCalendar() {        //이전 달
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() - 1, this.nowMonth.getDate());   // 현재 달을 1 감소
        this.updateCalendarAndTodolist();
    }

    nextCalendar() {        //다음 달
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() + 1, this.nowMonth.getDate());   // 현재 달을 1 증가
        this.updateCalendarAndTodolist();
    }

    prevDate() {            //이전 날
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), this.nowMonth.getDate() - 1);   // 현재 일을 1 감소
        this.updateCalendarAndTodolist();
    }

    nextDate() {            //다음 날
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), this.nowMonth.getDate() + 1);   // 현재 일을 1 증가
        this.updateCalendarAndTodolist();
    }

    updateCalendarAndTodolist() {
        this.buildCalendar();
        TodoListService.getInstance().updateTodoList();
        this.choiceDate(this.selectedDateElement);

        document.getElementById("todolist-view").value = "whole";
        TodoListService.getInstance().changeTodolistView(document.getElementById("todolist-view"));
    }

    // input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
    leftPad(value) {
        if (value < 10) {
            value = "0" + value;
            return value;
        }
        return value;
    }
}