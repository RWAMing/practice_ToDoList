// 할 일 입력란
const typeBox_TD = document.querySelector('#typeBox_Todo'); // input[type="text"] 입력칸
const btn_add = document.querySelector('#btn_add'); // btn


// 리스트
const listBox = document.querySelectorAll('.list_wrap')[0]; // 리스트 div
const TD_guide = document.querySelector('.list_wrap p'); // 리스트 내 설명 p태그


// ul, edit버튼
const new_ul = document.createElement('ul'); // create ul
const btn_edit = document.querySelector('.btn_edit'); // edit버튼

btn_edit.addEventListener('click', open_edit) // edit 클릭시

let mode_edit = false;
function open_edit() { // btn_edit.addEventListener('click', open_edit)
    if (mode_edit) {
        mode_edit = false;
        btn_edit.innerText = 'edit';
        hide_btn_change_order();
    }else{
        mode_edit = true;
        btn_edit.innerText = 'done';
        show_btn_change_order();
    }
    drag_btn_change_order();
}

// basic style -> edit
function show_btn_change_order() {
    const lists_style = document.querySelectorAll('.list_style');
    lists_style.forEach(function (list_style) {
        list_style.style.opacity = '0';
        setTimeout(function () {
            list_style.innerHTML = '&equiv;';
            list_style.classList.add('edit_style');
            list_style.style.opacity = '1';
        }, 250)
    });
}
// edit -> basic style
function hide_btn_change_order() {
    const lists_style = document.querySelectorAll('.list_style');
    lists_style.forEach(function (list_style) {
        list_style.style.opacity = '0';
        setTimeout(function () {
            list_style.innerHTML = '';
            list_style.classList.remove('edit_style');
            list_style.style.opacity = '1';
        }, 250)
    });
}

// 드래그
function drag_btn_change_order() {
    const lists_style_edit = document.querySelectorAll('.list_style');
    for (let i = 0; i < lists_style_edit.length; i++) {
        if (mode_edit) {
            lists_style_edit[i].addEventListener('mousedown', drag_start);
        } else {
            lists_style_edit[i].removeEventListener('mousedown', drag_start);
        }
    }
}
// 드래그 이벤트리스너

// 클릭한 인덱스번호 뽑기
let clicked_li;
let drag_li;
let upper_ul;
let clicked_lists;
let clicked_index;
let clicked_Y;

// 드래그 준비
function drag_start(list_clicked) {
    clicked_li = list_clicked.target; // 여러 요소에 동일한 이벤트 핸들러를 적용할 때, 각 요소마다 발생한 이벤트의 대상이 무엇인지 알아야 하므로 .target 사용
    clicked_Y = list_clicked.clientY;
    window.addEventListener('mousemove', drag_move);
    window.addEventListener('mouseup', drag_finish);

    // 클릭한 인덱스번호 뽑기
    drag_li = clicked_li.closest('li');
    upper_ul = clicked_li.closest('ul');
    clicked_lists = Array.from(upper_ul.getElementsByTagName('li'));
    clicked_index = clicked_lists.indexOf(drag_li);
}
// 드래그 중
let adjust_top = 0;
function drag_move(view) {

    //위치 이동
    const dragged_Y = view.clientY;
    const dragged_distance = dragged_Y - clicked_Y;
    const ul_top_Y = document.querySelector('ul').getBoundingClientRect().top + 31;
    const ul_bottom_Y = document.querySelector('ul').getBoundingClientRect().bottom - 19;

    // 순서 변경
    const now_lists = Array.from(upper_ul.getElementsByTagName('li'));
    const now_index = now_lists.indexOf(clicked_li.closest('li'));
    let prev_index = now_index - 1;
    let next_index = now_index + 1;
    let unit = 20 + now_index * 40 - clicked_index * 40;
    let unit_reverse = -20 + now_index * 40 - clicked_index * 40;


    if (dragged_Y >= ul_top_Y && dragged_Y <= ul_bottom_Y) { // ul 뚫지 못하게
        if (dragged_distance > unit) { // 아래로 반칸
            if (now_lists.length - 1 == now_index) { // 마지막칸에서는 움직임X
                return false;
            }
            now_lists[next_index].insertAdjacentElement('afterend', drag_li);
            adjust_top++;
        }
        else if (dragged_distance <= unit_reverse) { // 위로 반칸
            now_lists[prev_index].insertAdjacentElement('beforebegin', drag_li);
            adjust_top--;
        } else {
            drag_li.style.top = dragged_distance - (adjust_top * 40) + 'px';
        }
    }
}
// 드래그 끝
function drag_finish() {
    window.removeEventListener('mousemove', drag_move);
    window.removeEventListener('mouseup', drag_finish);
    drag_li.style.top = '0px';
    adjust_top = 0;
}

// li(할일) 추가
function add_TD() {
    const new_li_TD = document.createElement('li');
    if (!typeBox_TD.value.trim() == '') {
        new_li_TD.innerText = typeBox_TD.value; // 유저 입력한 내용으로
    } else {
        new_li_TD.innerText = typeBox_TD.placeholder; // placeholder내용대로
    }
    new_li_TD.append(add_btn_remove());
    new_li_TD.prepend(add_listStyle());
    return new_li_TD;
}
function add_listStyle() { // list style 생성
    const new_listStyle = document.createElement('p');
    new_listStyle.classList.add('list_style');
    if (mode_edit) { // edit 모드일 경우
        new_listStyle.innerHTML = '&equiv;';
        new_listStyle.classList.add('edit_style');
    }
    return new_listStyle
}
function add_btn_remove() { // ToDo 지우기 버튼 x 만들기
    const new_btn_remove = document.createElement('button'); // 태그 button 생성
    new_btn_remove.type = 'button';
    new_btn_remove.classList.add('btn');
    new_btn_remove.classList.add('btn_mini');
    new_btn_remove.innerHTML = '&times;';
    new_btn_remove.addEventListener('click', remove_ToDo) // 클릭시 상위 li 삭제
    function remove_ToDo(clicked_rmv_btn) {
        clicked_rmv_btn.target.closest('li').remove(); // * event.target
        if (document.querySelectorAll('.list_wrap ul li').length == 0) { // 리스트 없으면,
            listBox.append(TD_guide); // 설명 추가
            btn_edit.classList.remove('btn_edit_show');
        }
    }
    return new_btn_remove;
}

// 추가된 To Do 내용 - 유저입력내용 || Placeholder내용
btn_add.addEventListener('click', add_ToDo); // 클릭 -> To Do 추가 실행
function add_ToDo() { // To Do 추가
    if (document.querySelectorAll('.list_wrap p').length != 0) { // 설명 있을때는,
        TD_guide.remove(); // 설명 삭제 
        listBox.append(new_ul); // new ul
        btn_edit.classList.add('btn_edit_show');
    }
    document.querySelector('.list_wrap ul').append(add_TD()); // new li
    typeBox_TD.value = ''; // 기존 입력내용 삭제
    typeBox_TD.placeholder = TD_PH_ex[random_10()]; // placeholder변경
    if (mode_edit) {
        const new_edit = document.querySelector('.list_wrap ul li:last-of-type p');
        new_edit.addEventListener('mousedown', drag_start);
    }
}



// 예시 placeholer - show, hide by focus
const TD_PH_ex = [ // placeholder 예시
    '무탈한 하루를 보내기', // 0
    '멋지게 숨 쉬기', // 1
    '맛있는 밥 먹기', // 2
    '하늘 바라보기', // 3
    '1일 무지출 챌린지', // 4
    '사랑하는 이에게 보고싶다고 말하기', // 5
    '감사일기 쓰기', '카페에서 책 읽기', // 6
    '나에게 사랑한다고 말하기', // 7
    '좋아하는 소비를 위해 저축하기', // 8
    '운동하러 나가기' // 9
];
function random_10() { // 랜덤 index번호 (0~9)
    let i = Math.floor(Math.random() * 10);
    if (i == 10) { // 낮은 확률인 10 제거
        return 9;
    } else { return i; }
}

// 처음 등장
typeBox_TD.placeholder = TD_PH_ex[random_10()];;

// focus - hide
typeBox_TD.addEventListener('focus', hide_PH);
function hide_PH() {
    typeBox_TD.placeholder = '';
}

// blur - show(random)
typeBox_TD.addEventListener('blur', show_PH);
function show_PH() {
    typeBox_TD.placeholder = TD_PH_ex[random_10()];;
}