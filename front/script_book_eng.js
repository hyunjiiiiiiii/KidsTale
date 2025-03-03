// 현재 페이지 인덱스
let currentPage = 0;
let bookData = [];
let bookContent = '';

// 서버에서 책 제목, 내용, 이미지 데이터를 받아오는 함수
async function fetchBookData() {
    const lang = 'eng';
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
    const bookId = localStorage.getItem('id_book');
    const drawingId = localStorage.getItem('drawingId')
    

    try {
        // 책 정보를 서버로부터 요청 (user_id와 lang을 사용)
        const response = await fetch(`/book/${lang}?id_book=${bookId}&drawing_id=${drawingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 토큰 추가
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            // 책 제목 및 표지 이미지 업데이트
            document.getElementById('book-title').innerText = data.title;
            document.getElementById('book-author').innerText = `Author: ${data.author}`;
            document.getElementById('book-cover').src = data.imagePath;

            // 텍스트 파일 경로로 책 내용 가져오기
            bookContent = await fetchTextFile(data.txtPath);
            console.log(bookContent);

            // 책 내용을 페이지별로 나눔
            bookData = splitBookContent(bookContent);
            lastPageIndex = bookData.length - 1;
        } else {
            throw new Error('책 정보를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('데이터를 불러오는 중 오류:', error);
        alert('서버 요청 중 오류가 발생했습니다.');
    }
}

// 텍스트 파일을 읽어서 내용을 반환하는 함수
async function fetchTextFile(txtPath) {
    try {
        const response = await fetch(txtPath);
        return await response.text();
    } catch (error) {
        console.error('텍스트 파일을 불러오는 중 오류:', error);
        return '';
    }
}

function splitBookContent(content) {
    // 문단 단위로 텍스트를 나누기 (줄바꿈을 기준으로 분할)
    let paragraphs = content.split(/\r?\n+/); // \n 또는 \r\n 으로 구분
    return paragraphs;
}

function displayPage(pageIndex) {
    const contentPage = document.getElementById('content-page');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // 이전 페이지와 다음 페이지 버튼 표시 여부 결정
    prevButton.style.display = pageIndex === 0 ? 'none' : 'block';
    nextButton.style.display = pageIndex === bookData.length - 1 ? 'none' : 'block';

    // 페이지 내용 업데이트 (각 문단을 표시)
    document.getElementById('content-text').innerText = bookData[pageIndex];

    // 페이지 컨테이너 표시
    contentPage.style.display = 'block';
}

// 다음 페이지로 이동
function nextPage() {
    if (currentPage < bookData.length - 1) {
        currentPage++;
        displayPage(currentPage);
    }
}

// 이전 페이지로 이동
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage(currentPage);
    }
}

// 페이지 초기화 및 데이터 로딩
document.addEventListener('DOMContentLoaded', async function() {
    await fetchBookData();
    displayPage(0); // 첫 페이지 (표지) 표시
});
