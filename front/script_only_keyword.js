// 선택된 키워드를 저장할 배열
let keywords = [];
// 선택된 장르를 저장할 배열 (하나만 선택 가능)
let selectedGenres = [];


// 키워드를 추가하는 함수 (알림창에서 먼저 입력을 받고 버튼 생성)
function addKeyword() {
    // 알림창에서 키워드 입력받기
    const keyword = prompt("키워드를 입력해주세요:");

    // 입력받은 키워드가 유효할 때만 버튼 생성
    if (keyword !== null && keyword.trim() !== "") {
        // 키워드를 배열에 저장
        keywords.push(keyword);

        // 입력한 키워드를 보여주는 버튼 생성
        createKeywordButton(keyword);
    } else {
        alert("키워드를 입력해주세요.");
    }
}

// 키워드 버튼을 생성하는 함수
function createKeywordButton(keyword) {
    const keywordContainer = document.getElementById('keyword-container');

    // 새로운 줄을 생성할지 여부 확인 (4개씩 줄 배치)
    let lastRow = keywordContainer.lastElementChild;
    if (!lastRow || lastRow.children.length >= 4) {
        // 새로운 행 생성
        lastRow = document.createElement('div');
        lastRow.classList.add('keyword-row'); // 스타일을 위해 새로운 클래스 적용
        keywordContainer.appendChild(lastRow);
    }

    // 키워드 버튼 생성
    const newButton = document.createElement('button');
    newButton.classList.add('keyword-button');
    newButton.textContent = keyword;

    // 버튼을 클릭하면 키워드 수정 가능
    newButton.onclick = function() {
        editKeyword(newButton);
    };

    // 새 키워드 버튼을 행에 추가
    lastRow.appendChild(newButton);
}


// 키워드를 수정하는 함수
function editKeyword(button) {
    const newKeyword = prompt("키워드를 수정해주세요:", button.textContent);

    if (newKeyword !== null && newKeyword.trim() !== "") {
        // 키워드 배열에서 수정
        const index = keywords.indexOf(button.textContent);
        if (index !== -1) {
            keywords[index] = newKeyword;
            button.textContent = newKeyword;
        }
    } else {
        alert("유효한 키워드를 입력해주세요.");
    }
}

// ======================================================================== //

// 장르 선택/해제 함수 (하나만 선택 가능)
function toggleGenre(button) {
    const genre = button.innerText;

    // 이미 선택된 장르가 있을 경우 다른 장르를 선택 불가
    if (selectedGenres.length >= 1 && !selectedGenres.includes(genre)) {
        alert("하나의 장르만 선택할 수 있습니다.");
        return;
    }

    // 장르 선택/해제
    if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(item => item !== genre);
        button.classList.remove('selected');
    } else {
        // 장르 배열에 추가 (최대 1개)
        selectedGenres.push(genre);
        button.classList.add('selected');
    }
}

// 다음 버튼 클릭 시 데이터 확인 후 페이지 이동
function goToNextPage() {
    const selectedGenre = document.querySelector('input[name="genre"]:checked');
    
    if (keywords.length < 3) {
        alert('키워드를 최소 3개 이상 입력해주세요.');
        return;
    }

    if (selectedGenres.length === 0) {
        alert('장르를 선택해주세요.');
        return;
    }

    // 키워드와 장르 데이터를 서버로 전송 (예시)
    fetch('/submit-keywords-genres', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: keywords, genre: selectedGenre.value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 생성된 책 페이지로 이동
            window.location.href = '#';
        } else {
            alert('데이터 제출에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('제출 중 오류가 발생했습니다.');
    });
}


