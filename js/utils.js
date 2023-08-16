class DateUtils{
    static leftPad(value){
        if(value >= 10){
            return value;
        }
        return `0${value}`; //value가 10보다 작을 때 0붙이고 출력
    }

    static toStringByFormatting(date){
        const year = date.getFullYear();
        const month = this.leftPad(date.getMonth() + 1);
        const day = this.leftPad(date.getDate());

        return [year, month, day].join("-");
    }
}