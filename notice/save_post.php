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

// 폼 데이터 받아오기
$title = mysqli_real_escape_string($conn, $_POST['title']);
$content = mysqli_real_escape_string($conn, $_POST['content']);
$imagePath = null;  // 기본값

// 이미지 처리
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["image"]["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check !== false) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $imagePath = $target_file;  // 업로드된 파일 경로를 저장
        } else {
            echo "이미지 업로드 중 오류가 발생했습니다.";
            exit;
        }
    } else {
        echo "업로드된 파일이 이미지가 아닙니다.";
        exit;
    }
}

// 데이터베이스에 제목, 내용, 이미지 경로 저장
$sql = "INSERT INTO posts (title, content, image_path) VALUES ('$title', '$content', '$imagePath')";

if ($conn->query($sql) === TRUE) {
    // 저장 후 notice.html로 리디렉션
    header("Location: notice.php");
    exit();
} else {
    echo "게시물 저장 중 오류: " . $conn->error;
}

$conn->close();
?>
