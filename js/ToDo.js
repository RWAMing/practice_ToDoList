window.addEventListener('load',function(){
    

// variables & return value

// 할 일 입력란
    // typeBox_Todo
        var typeBox_TD = document.querySelector('#typeBox_Todo');

    // typeBox_Todo value
        function typeBox_TD_txt() { // 유저가 input에 입력한 ToDo
            return document.querySelector('#typeBox_Todo').value;
        }
        function TD_txt_blank() { // 빈칸인지 체크
            return typeBox_TD_txt().replace(/\s*/g,'')=='';
        }
        
    

    // button for add
        var btn_add = document.querySelector('#btn_add'); // btn


// 리스트
    // list box
        var listBox = document.querySelectorAll('.list_wrap')[0]; // 리스트 div
        var TD_guide = document.querySelector('.list_wrap p'); // 설명 p태그
        function TD_guide_for_chk() { //설명(배열) 유무 확인용
            return document.querySelectorAll('.list_wrap p');
        }
        function have_TD_guide() { // 리스트 p 배열
            return TD_guide_for_chk().length!=0;
        }
        function list_ul() { // 리스트 ul 인식
            return document.querySelector('.list_wrap ul');
        }
        function lists_li() {  // 리스트들 li(배열) 인식
            return document.querySelectorAll('.list_wrap ul li');
        }

        



// functions

// 할일 추가
    // ul, edit버튼 만들기
        var new_ul = document.createElement('ul'); // create ul
        var new_btn_edit = document.createElement('button'); // create btn_edit
        function add_btn_edit() {
            new_btn_edit.type = 'button';
            new_btn_edit.classList.add('btn');
            new_btn_edit.classList.add('btn_mini');
            new_btn_edit.classList.add('btn_edit');
            new_btn_edit.innerHTML = 'edit';
            new_btn_edit.addEventListener('click',open_edit) // edit 클릭시
            return new_btn_edit;
        }
        // edit 클릭시
            function open_edit(){
                show_btn_change_order();
            }
            // list-style 모양 변경
            function show_btn_change_order() {
                var lists_style = document.querySelectorAll('.list_style');
                lists_style.forEach(function(list_style) {
                    list_style.style.opacity='0';
                    list_style.style.backgroundColor='transparent';
                    var appear_timer;
                    appear_timer = setTimeout(function() { // 이동 모드로 변경
                        list_style.innerHTML = '&equiv;';
                        list_style.style.position = 'relative';
                        list_style.style.right = '7px';
                        list_style.style.height = '40px';
                        list_style.style.margin = '0';
                        list_style.style.opacity='1';
                        list_style.style.cursor='pointer';
                        list_style.style.userSelect='none';
                    }, 300);
                });
            }
        // 생성된 btn_edit 인식 - 삭제할 때 필요
            function btn_edit(){
                return document.querySelector('.btn_edit');
            }

    // li(할일) 만들기
        function add_TD() {
            var new_li_TD = document.createElement('li');
            if(!TD_txt_blank()){
                new_li_TD.innerText = typeBox_TD_txt(); // 유저 입력한 내용으로
            }else{
                new_li_TD.innerText = typeBox_TD.placeholder; // placeholder내용대로
            }
            new_li_TD.append(add_btn_remove());
            new_li_TD.prepend(add_listStyle());
            return new_li_TD;
        }
        function add_listStyle() { // list style 생성
            var new_listStyle = document.createElement('p');
            new_listStyle.classList.add('list_style');
            return new_listStyle
        }
        function add_btn_remove() { // ToDo 지우기 버튼 x 만들기
            var new_btn_remove = document.createElement('button'); // 태그 button 생성
            new_btn_remove.type = 'button';
            new_btn_remove.classList.add('btn');
            new_btn_remove.classList.add('btn_mini');
            new_btn_remove.innerHTML = '&times;';
            new_btn_remove.addEventListener('click',remove_ToDo) // 클릭시 상위 li 삭제
            function remove_ToDo (clicked_rmv_btn){
                clicked_rmv_btn.target.closest('li').remove(); // * event.target
                if(lists_li().length==0){ // 리스트 없으면,
                    listBox.append(TD_guide); // 설명 추가
                    list_ul().remove(btn_edit()); // edit 삭제
                }
            }
            return new_btn_remove;
        }

    // 유저입력 To Do, placeholder To Do 입력
        btn_add.addEventListener('click',add_ToDo); // 클릭 -> To Do 추가 실행
        function add_ToDo() { // To Do 추가
            if (have_TD_guide()){ // 설명 있을때는,
                TD_guide.remove(); // 설명 삭제 
                listBox.append(new_ul); // new ul
                if (document.querySelectorAll('.btn_edit').length==0) { // edit 없을때만 생성
                    list_ul().append(add_btn_edit());
                }
            }
                list_ul().append(add_TD()); // new li
                typeBox_TD.value = ''; // 기존 입력내용 삭제
                typeBox_TD.placeholder = random_TD_PH_ex(); // placeholder변경
        }


// 예시 placeholer - show, hide by focus
    var TD_PH_ex = [ // placeholder 예시
        '무탈한 하루를 보내기', // 0
        '멋지게 숨 쉬기', // 1
        '맛있는 밥 먹기', // 2
        '하늘 바라보기', // 3
        '1일 무지출 챌린지', // 4
        '사랑하는 이에게 보고싶다고 말하기', // 5
        '감사일기 쓰기','카페에서 책 읽기', // 6
        '나에게 사랑한다고 말하기', // 7
        '좋아하는 소비를 위해 저축하기', // 8
        '운동하러 나가기' // 9
    ];
    function random_10() { // 랜덤 index번호 (0~9)
        var i = Math.floor(Math.random()*10);
        if(i==10){ // 낮은 확률인 10 제거
            return 9;
        }else{return i;}
    }
    function random_TD_PH_ex() { // 랜덤 placeholder
        return TD_PH_ex[random_10()];
    }

    // 처음 등장
        typeBox_TD.placeholder = random_TD_PH_ex();

    // focus - hide
        typeBox_TD.addEventListener('focus',hide_PH);
        function hide_PH() {
            typeBox_TD.placeholder = '';
        }
    
    // blur - show(random)
        typeBox_TD.addEventListener('blur',show_PH);
        function show_PH() {
            typeBox_TD.placeholder = random_TD_PH_ex();
        }

});


// 커밋 어케써 ^^ 제발 푸시해라