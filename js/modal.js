const openModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.remove("invisible");
}

const closeModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.add("invisible");
    modal.innerHTML = "";
}

// const modifyTodoOnKeyUpHandle = (event, id) => {
//     if(event.keyCode === 13) {
//         modifySubmitButtonOnClick(id);
//     }
// }

const modifySubmitButtonOnClick = (id) => {
    const newTodoContent = document.querySelector(".modal-main .text-input").value;
    const todo = TodoListService.getInstance().getTodoById(id);
    if(todo.todoContent === newTodoContent || !newTodoContent){ //값이 같거나 공백일 경우
        return;
    }
    const todoObj = {
        ...todo,
        todoContent: newTodoContent
    }
    TodoListService.getInstance().setTodo(todoObj);
}

const modifyModal = (todo) => {
    const modal = document.querySelector(".modal");
    console.log("여기 옴?");
    modal.innerHTML = `
        <div class="modal-container">
            <header class="modal-header">
                <h1 class="modal-title">
                    ToDo 수정
                </h1>
                <button class="delete-button btn" value="${todo.id}" onclick="deleteTodoOnClickHandle(this)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </header>
            <main class="modal-main">
                <p class="modal-message">
                    ToDo를 수정해주세요.
                </p>
                <input type="text" class="text-input w-f" value="${todo.todoContent}">
            </main>
            <footer class="modal-footer">
                <button class="btn" onclick="modifySubmitButtonOnClick(${todo.id}); closeModal();">확인</button>
                <button class="btn" onclick="closeModal()">닫기</button>
            </footer>
        </div>
    `;
}