<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시판</title>
    <link rel="stylesheet" href="notice.css">
</head>
<body>
    <!-- 게시판 첫 화면 -->
     <!--13~17 가져다 쓰시면 됩니다!-->
    <div id="board-screen" class="screen">
        <header>
            <img src="../images/logo.png" alt="로고" class="logo">

            <div class="menu-icon">☰</div>
        </header>

        <div class="menu" id="menu"> <!-- id 추가 -->
            <ul>
                <li><a href="../jb/index.php">홈</a></li>
                <li><a href="../map,event/map,event.html">지도 및 부스 안내</a></li>
                <li><a href="../EVENTS_/index.html">이벤트</a></li>
                <li><a href="../performance/performance.html">무대 프로그램</a></li>
                <li><a href="../food/food.html">푸드&주류 트럭</a></li>
                <li><a href="../BUS/index.html">셔틀버스</a></li>
                <li><a href="../notice/notice.php">게시판</a></li>
            </ul>
        </div>

        <main>
            <div class="search-container">
                <input type="text" placeholder="검색" id="search-box" oninput="searchPosts()">
                <button class="write-btn" onclick="showWriteScreen()">글쓰기</button>
            </div>
            <section class="recent-posts">
                <h2>최근 게시물</h2>
                <ul id="post-list">
                <?php
                    // 데이터베이스 연결
                    $host = 'localhost';
                    $dbname = 'JB_Endless';
                    $username = 'root';
                    $password = '6428';

                    $conn = new mysqli($host, $username, $password, $dbname);
                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }

                    // 페이지 변수 처리
                    $posts_per_page = 5; // 한 페이지에 표시할 게시물 수
                    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1; // 현재 페이지 번호 (기본값은 1)
                    $offset = ($page - 1) * $posts_per_page; // 페이지에 따라 건너뛸 게시물 수

                    // 총 게시물 수 구하기
                    $sql_total = "SELECT COUNT(*) AS total_posts FROM posts";
                    $result_total = $conn->query($sql_total);
                    $total_posts = $result_total->fetch_assoc()['total_posts'];

                    // 총 페이지 수 계산
                    $total_pages = ceil($total_posts / $posts_per_page);

                    // 최신 게시물 가져오기 (페이징 적용)
                    $sql = "SELECT title, content, image_path, created_at FROM posts ORDER BY created_at DESC LIMIT $posts_per_page OFFSET $offset";
                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // 게시물이 있을 경우
                        while($row = $result->fetch_assoc()) {
                            echo '<li>';
                            echo '<strong>제목: ' . htmlspecialchars($row["title"]) . '</strong><br><br>';
                            echo '<span>작성 시간: ' . htmlspecialchars($row["created_at"]) . '</span><br><br>';
                            echo '<p>내용: ' . htmlspecialchars($row["content"]) . '</p><br>';
                            if ($row["image_path"]) {
                                echo '<img src="' . htmlspecialchars($row["image_path"]) . '" alt="Image" style="width:100px;"><br><br>';
                            }
                            echo '</li><br>'; // 게시물 간 줄바꿈
                        }
                    } else {
                        // 게시물이 없을 경우
                        echo '<li class="no-posts">아직 작성된 게시물이 없습니다!<br> 첫 게시물을 작성해보세요!</li>';
                    }

                    $conn->close();
                    ?>
                    
                </ul>
            </section>
        </main>
        <footer>
        <p>페이지 번호: <?php echo $page; ?> / <?php echo $total_pages; ?></p>
        </footer>
        <!-- 페이지네이션 -->
        <div class="pagination">
            <?php if ($page > 1): ?>
                <a href="?page=<?php echo $page - 1; ?>">이전</a>
            <?php endif; ?>

            <?php
            for ($i = 1; $i <= $total_pages; $i++) {
                echo '<a href="?page=' . $i . '"';
                if ($i == $page) {
                    echo ' class="active"'; // 현재 페이지 강조
                }
                echo '>' . $i . '</a> ';
            }
            ?>

            <?php if ($page < $total_pages): ?>
                <a href="?page=<?php echo $page + 1; ?>">다음</a>
            <?php endif; ?>
        </div>
    </div>

    <!-- 글쓰기 화면 -->
    <div id="write-screen" class="screen hidden">
        <header>
            <img src="../images/logo.png" alt="Logo">
            <h1>게시판</h1>
        </header>
        <main>
            <div class="write-form">
            <form action="save_post.php" method="post" enctype="multipart/form-data">
                    <input type="text" name="title" placeholder="제목" id="title-box" required>
                    <input type="file" name="image" id="image-input" accept="image/*">
                    <textarea name="content" id="content-box" placeholder="내용을 입력하세요..." required></textarea>
                    <br>부적절한 게시글은 삭제될 수 있습니다
                    <button type="submit" class="post-btn">게시</button>
                </form>
            </div>
        </main>
    </div>

    <!-- 글보기 화면 (게시글 보기) -->
<div id="view-post-screen" class="screen hidden">
    <header>
        <img src="../images/logo.png" alt="Logo">
        <h1>게시글 보기</h1>
    </header>

    <main>
        <div class="post-view">
            <h2 id="view-post-title"></h2>
            <img id="view-post-image" alt="이미지" style="display:none;" />
            <p id="view-post-content"></p>
        </div>
        <button class="back-btn" onclick="goBackToBoard()">뒤로 가기</button>
    </main>
</div>


    <script src="notice.js"></script>
</body>
</html>