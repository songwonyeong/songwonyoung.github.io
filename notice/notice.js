let posts = []; // Array to store posts
const postsPerPage = 5; // Number of posts per page
let currentPage = 1; // Current page number

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

function showWriteScreen() {
    // Clear previous input fields
    document.getElementById('title-box').value = '';
    document.getElementById('content-box').value = '';
    document.getElementById('image-input').value = ''; // Reset the file input
    document.getElementById('view-post-image').src = ''; // Clear image preview
    document.getElementById('view-post-image').style.display = 'none'; // Hide image on write screen

    document.getElementById('board-screen').classList.add('hidden');
    document.getElementById('write-screen').classList.remove('hidden');
}

function previewPost() {
    const title = document.getElementById('title-box').value;
    const content = document.getElementById('content-box').value;
    const imageInput = document.getElementById('image-input').files[0];
    let imageSrc = '';

    if (!title || !content) {
        alert('제목과 내용을 입력하세요!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        imageSrc = e.target.result;

        const post = {
            title: title,
            content: content,
            imageSrc: imageSrc,
            time: new Date().toLocaleTimeString(),
        };

        posts.unshift(post); // Add to the beginning for recent first
        displayPosts();
        showBoardScreen();
    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    } else {
        const post = {
            title: title,
            content: content,
            imageSrc: null, // No image
            time: new Date().toLocaleTimeString(),
        };

        posts.unshift(post);
        displayPosts();
        showBoardScreen();
    }
}

function showBoardScreen() {
    document.getElementById('write-screen').classList.add('hidden');
    document.getElementById('board-screen').classList.remove('hidden');
}

function displayPosts(filteredPosts = posts) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; // Clear previous list

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    if (paginatedPosts.length === 0) {
        postList.innerHTML = '<li class="no-posts">아직 작성된 게시물이 없습니다! 첫 게시물을 작성해보세요!</li>';
    } else {
        paginatedPosts.forEach((post, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${post.title}</strong> <span>${post.time}</span>`;
            listItem.onclick = function () {
                viewPost(start + index); // Open post on click
            };
            postList.appendChild(listItem);
        });
    }
    updatePagination(filteredPosts.length);
}

function updatePagination(totalPosts) {
    const footer = document.querySelector('footer');
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    footer.innerHTML = `페이지 번호: ${currentPage} / ${totalPages}`;

    // Handle pagination buttons
    if (totalPages > 1) {
        const prevButton = currentPage > 1 ? `<button onclick="changePage(currentPage - 1)">이전</button>` : '';
        const nextButton = currentPage < totalPages ? `<button onclick="changePage(currentPage + 1)">다음</button>` : '';
        footer.innerHTML += ` ${prevButton} ${nextButton}`;
    }
}

function changePage(page) {
    currentPage = page;
    displayPosts();
}

function viewPost(index) {
    const post = posts[index];
    document.getElementById('view-post-title').innerText = post.title;
    document.getElementById('view-post-content').innerText = post.content;
    document.getElementById('view-post-image').src = post.imageSrc || ''; // Show image or blank

    // Only show the image if it exists
    document.getElementById('view-post-image').style.display = post.imageSrc ? 'block' : 'none';

    document.getElementById('board-screen').classList.add('hidden');
    document.getElementById('view-post-screen').classList.remove('hidden');
}

function goBackToBoard() {
    document.getElementById('view-post-screen').classList.add('hidden');
    document.getElementById('board-screen').classList.remove('hidden');
}

// Search function
function searchPosts() {
    const keyword = document.getElementById('search-box').value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(keyword) || 
        post.content.toLowerCase().includes(keyword)
    );

    currentPage = 1; // Reset to first page on search
    displaySearchResults(filteredPosts);
    updatePagination(filteredPosts.length);
}

// Display search results
function displaySearchResults(filteredPosts) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; // Clear previous list

    if (filteredPosts.length === 0) {
        postList.innerHTML = '<li class="no-posts">검색 기능은 추후 업데이트할 예정입니다.</li>';
    } else {
        filteredPosts.forEach((post, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${post.title}</strong>`;
            listItem.onclick = function () {
                viewPost(posts.indexOf(post)); // Open the post when clicked
            };
            postList.appendChild(listItem);
        });
    }
}

// Add event listener for 'Enter' key in search box
document.getElementById('search-box').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchPosts();
    }
});