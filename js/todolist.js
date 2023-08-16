//enter키 입력시
const addTodoOnKeyUpHandle = (event) => {
    // console.log(event.keyCode);
    if(event.keyCode === 13) {
        generateTodoObj();
    }
}

//체크박스 체크상태 확인
const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompleteStatus(target.value, target.checked);
}

//수정 버튼 클릭시
const modifyTodoOnClickHandle = (target) => {
    openModal();
    modifyModal(TodoListService.getInstance().getTodoById(target.value));
}

//삭제 버튼 클릭시
const deleteTodoOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value);
    closeModal();
}

const generateTodoObj = () => {
    const todoContent = document.querySelector(".todolist-insert-items .text-input").value;
    console.log(todoContent);
    if(!todoContent){           //공백시 종료
        return;
    }
    const todoObj = {
        id: 0,
        todoContent: todoContent,
        createDate : DateUtils.toStringByFormatting(Calendar.getInstance().nowMonth),
        completeStatus: false
    };

    // console.log(todoObj.createDate);
    TodoListService.getInstance().addTodo(todoObj);     //li에 추가

    //추가 된 후 text-input 초기화
    document.querySelector(".todolist-insert-items .text-input").value = null;
}

class TodoListService{
    static #instance = null;
    
    static getInstance() {
        if(this.#instance === null){
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }
    
    todoList = new Array();
    todoIndex = 1;
    
    constructor() {
        this.loadTodoList();
        this.changeTodolistView(document.getElementById("todolist-view"));
    }
    
    //JSON.parse(JSON 문자열) : JSON 문자열 -> 객체
    //JSON.stringify(객체) : 객체 -> JSON 문자열

    loadTodoList() {    //새로고침 이후 로드
        console.log(!!localStorage.getItem("todoList"));
        // console.log(todo.todoContent, "createDate: " + todo.createDate, "nowDay: " + this.nowday);

        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array();
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1: 1;
        //값이 있으면 .id를 하고, 없으면 하지 않음
    }

    saveLocalStorage(){ //로컬 스토리지에 저장하는 문장을 따로 함수로 뺌
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    getTodoById(id) {   //수정시 id 전달을 위함
        //람다에서 {} 없으면 return 필요 없음
        // console.log(this.todoList);
        // console.log(this.todoList.filter(todo => todo.id === parseInt(id)));
        // console.log(this.todoList.filter(todo => todo.id === parseInt(id))[0]);
        //확인 : console 창 입력 : TodoListService.getInstance().getTodoById(2);
        console.log(this.todoList.filter(todo => todo.id === parseInt(id))[0]);
        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    addTodo(todoObj) {
        const todo = {
            ...todoObj,
            id: this.todoIndex
        }

        this.todoList.push(todo);

        this.saveLocalStorage();

        this.updateTodoList();      //추가된 후 리스트 업데이트

        this.todoIndex++;
    }

    setCompleteStatus(id,status) {
        console.log(id,status);
        this.todoList.forEach((todo,index) => {
            if(todo.id === parseInt(id)){   //todo.id는 숫자, 태그로 전달된 id는 문자열임 -> 변환 필요(parseInt)
                this.todoList[index].completeStatus = status;
            }
        });
        this.saveLocalStorage();
    }

    setTodo(todoObj){       //모달 창을 통해 수정시
        for(let i = 0; i < this.todoList.length; i++){
            if(this.todoList[i].id === todoObj.id){
                this.todoList[i] = todoObj;
                break;
            }
        }
        this.saveLocalStorage();
        this.updateTodoList();
    }

    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);        //삭제할 거만 빼고 나머지 리스트에 새로 저장
        });
        this.saveLocalStorage();
        this.updateTodoList();
    }

    changeTodolistView(target){
        const todolistMainContainer = document.querySelector(".todolist-main-container");
        const todolistInfo = document.querySelector(".todolist-info");
        let nowday = DateUtils.toStringByFormatting(Calendar.getInstance().nowMonth);

        const filteredTodos = this.todoList.filter(todo => {
            if(todo.createDate == nowday){
                if (target.value === "whole") {
                    todolistInfo.innerHTML = "TodoList... ";
                    return true; // 모든 항목을 표시
                } else if (target.value === "complete") {
                    todolistInfo.innerHTML = "Completed... ";
                    return todo.completeStatus; // 완료된 항목만 표시
                } else if (target.value === "incomplete") {
                    todolistInfo.innerHTML = "Incompleted... ";
                    return !todo.completeStatus; // 미완료된 항목만 표시
                }
            }
        })
        const filteredAndMappedTodos = filteredTodos.map(todo => {
            return `
            <li class="todolist-main-items">
                <div class="todolist-left">
                    <input type="checkbox" id="complete-chkbox${todo.id}" class="complete-chkboxes" 
                    ${todo.completeStatus ? "checked": ""} value="${todo.id}" onchange="checkedOnChangeHandle(this)">
                    <label for="complete-chkbox${todo.id}"></label>
                </div>
                <div class="todolist-center">
                    <pre class="todolist-content">${todo.todoContent}</pre>
                </div>
                <div class="todolist-right">
                    <span class="checkDate">${todo.createDate}</span>
                    <button class="todolist-btn btn" value="${todo.id}" onclick="modifyTodoOnClickHandle(this)">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </div>
            </li>
            `;
        });
        const todoCount = filteredAndMappedTodos.length;        // todolist 개수 저장

        const todolistCount = document.querySelector(".todolist-count");
        todolistCount.innerHTML = `${todoCount}`;              // todolist 개수 출력
        
        todolistMainContainer.innerHTML = filteredAndMappedTodos.join("");  // li 출력
    }

    updateTodoList(){
        const todolistMainContainer = document.querySelector(".todolist-main-container");
        // let nowday = DateUtils.toStringByFormatting(new Date(Calendar.getInstance().nowMonth.getFullYear(), Calendar.getInstance().nowMonth.getMonth(), Calendar.getInstance().calDateEl.innerText));
        let nowday = DateUtils.toStringByFormatting(Calendar.getInstance().nowMonth);

        todolistMainContainer.innerHTML = this.todoList.map(todo => {
            if(todo.createDate == nowday){
                return `
                <li class="todolist-main-items">
                    <div class="todolist-left">
                        <input type="checkbox" id="complete-chkbox${todo.id}" class="complete-chkboxes" 
                        ${todo.completeStatus ? "checked": ""} value="${todo.id}" onchange="checkedOnChangeHandle(this)">
                        <label for="complete-chkbox${todo.id}"></label>
                    </div>
                    <div class="todolist-center">
                        <pre class="todolist-content">${todo.todoContent}</pre>
                    </div>
                    <div class="todolist-right">
                        <span class="checkDate">${todo.createDate}</span>
                        <button class="todolist-btn btn" value="${todo.id}" onclick="modifyTodoOnClickHandle(this)">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                    </div>
                </li>
                `;
            }
        }).join("");
    }
}