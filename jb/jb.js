
document.addEventListener('DOMContentLoaded', function() {
    const toggleIcon = document.querySelector('.toggle-icon'); // 세모 버튼
    const cards = document.getElementById('cards'); // 카드 섹션
    const menu = document.querySelector('.menu'); // 슬라이드 메뉴
    const body = document.body; // body 요소를 가져옵니다.

    // 햄버거 메뉴 토글 기능
    const hamburgerButton = document.querySelector('.menu-icon'); // 햄버거 버튼
    hamburgerButton.addEventListener('click', function(event) {
        // 슬라이드 메뉴 토글 기능
        if (menu.style.right === "0px") {
            menu.style.right = "-250px"; // 메뉴 숨기기
        } else {
            menu.style.right = "0px"; // 메뉴 표시하기
        }

        event.stopPropagation(); // 이벤트 전파 중지
    });

    // 카드 토글 기능
    toggleIcon.addEventListener('click', function(event) {
        if (cards.style.display === 'none' || cards.style.display === '') {
            cards.style.display = 'block';  
            toggleIcon.textContent = '▲';  // 아이콘을 '▲'로 변경
        } else {
            cards.style.display = 'none';  
            toggleIcon.textContent = '▼';  // 아이콘을 다시 '▼'로 변경
        }

        event.stopPropagation(); // 이벤트 전파 중지
    });

    // 화면의 아무 곳이나 클릭했을 때 슬라이드 메뉴를 닫기
    body.addEventListener('click', function() {
        if (menu.style.right === "0px") {
            menu.style.right = "-250px"; // 메뉴 숨기기
        }
    });

    // 메뉴 클릭 시 이벤트 전파 중지
    menu.addEventListener('click', function(event) {
        event.stopPropagation(); // 메뉴 클릭 시 이벤트 전파 중지
    });
});
