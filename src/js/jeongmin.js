// import { db } from "./firebaseConfig.js";  // Firebase 설정 가져오기 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Firebase App Config
const firebaseConfig = {
    apiKey: "AIzaSyCJGXMZPnbtTNGSuRrXF5PU36mrE-4iJ-E",
    authDomain: "diporpour-41a58.firebaseapp.com",
    projectId: "diporpour-41a58",
    storageBucket: "diporpour-41a58.firebasestorage.app",
    messagingSenderId: "406083699748",
    appId: "1:406083699748:web:474a53c7f539a18297c4b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collection_name = "teamMember";
let members = []

// 랜덤 이미지 가져오기
const imageArray = [
    "a.png",
    "b.png",
    "c.png",
    "d.png",
    "e.png",
    "f.png",
];


document.addEventListener("DOMContentLoaded", async function () {
    // 파이어 베이스에서 팀원 데이터 조회
    let docs = await getDocs(collection(db, collection_name));
    docs.forEach((doc) => {
        let row = doc.data();
        members.push({
            docId: doc.id,
            img: row.memberPhoto,
            name: row.memberName,
            mbti: row.memberMBTI,
            blog: row.memberBlog,
            plan: row.passion,
        });

        // 멤버 카드에 읽어온 데이터 추가
        $('.row').append(
            `
            <div class="col">
                    <div class="card text-center shadow-sm p-3 team-card" id="${doc.id}">
                        <img src="${row.memberPhoto}" class="member-image rounded-profile mx-auto d-block" width="100"
                            alt="Profile">
                        <div class="card-body">
                            <h5 class="card-title member-name">${row.memberName}</h5>
                            <p class="card-text member-mbti">${row.memberMBTI}</p>
                        </div>
                    </div>
                </div>
                `
        )
    });

    // 메인페이지 팀원 상세정보 모달
    const modal1 = document.getElementById("profileModal");
    const closeModalBtn1 = document.getElementById("closeModalBtn");

    // 메인페이지 팀원 추가 모달
    const modal2 = document.getElementById("profileCreateModal");
    const openModalBtn = document.getElementById("team-add");
    const closeModalBtn2 = document.getElementById("modal_cancelBtn");

    // 팀원 상세정보 모달 내부 요소 가져오기
    const modalImage = document.getElementById("modal-profile-image");
    const nameInput = modal1.querySelector("input[placeholder='이름 입력']");
    const mbtiInput = modal1.querySelector("input[placeholder='MBTI 입력']");
    const blogInput = modal1.querySelector("input[placeholder='블로그 링크 입력']");
    const planInput = modal1.querySelector("input[placeholder='포부 입력']");

    //모달 나타나면 주위 배경 까매지게
    const fullScreen = document.getElementById("fullScreen");
    fullScreen.classList.add("display-none");

    // 카드 클릭시 이벤트 추가
    document.querySelectorAll(".team-card").forEach((card) => {
        card.addEventListener("click", function (event) {
            // 클릭한 카드에서 정보 가져오기
            console.log("카드 클릭됨", this);

            const imgElement = card.querySelector(".member-image").src;
            const nameElement = card.querySelector(".member-name").innerText;
            const mbtiElement = card.querySelector(".member-mbti").innerText;
            const memberId = card.id;
            const blogElement = members.find(member => member.docId == memberId)?.blog || null;
            const planElement = members.find(member => member.docId == memberId)?.plan || null;

            console.log("imgElement:" + imgElement);
            console.log("modalImage:" + modalImage.src);

            // 모달에 데이터 적용
            modalImage.src = imgElement;
            nameInput.value = nameElement;
            mbtiInput.value = mbtiElement;
            blogInput.value = blogElement;
            planInput.value = planElement;
            modal1.querySelector(".modal-content").id = memberId;

            // 모달 열기
            modal1.style.display = "flex";
            fullScreen.classList.remove("display-none");
        });
    });

    // 팀원 추가버튼 클릭시 프로필 모달 열기
    if (openModalBtn && modal2) {
        openModalBtn.addEventListener("click", function () {
            modal2.style.display = "flex";
            fullScreen.classList.remove("display-none");
            modal2.querySelector("#modal-update-image").src =
                `asset/memberImages/${imageArray[Math.floor(Math.random() * imageArray.length)]}`;       // 팀원 추가 시 랜덤 이미지 출력
        });
    }


    // 팀원 추가 이미지 업로드 버튼 기능 추가
    document.getElementById("upload-btn").addEventListener("click",
        function (e) {
            document.getElementById("modal-update-image").src =
                `asset/memberImages/${imageArray[Math.floor(Math.random() * imageArray.length)]}`;       // 프로필 업로드 버튼 클릭 시 랜덤 이미지 출력
        })

    // 모달1 닫기 (x클릭시)
    closeModalBtn1.addEventListener("click", closeModal1);

    // 모달2 닫기 (취소 클릭시)
    closeModalBtn2.addEventListener("click", closeModal2);

    // 모달1,2 열려있을 때 ESC키 입력시 닫기
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal1 && modal1.style.display === "flex") {
            closeModal1();
        }
        if (event.key === "Escape" && modal2 && modal2.style.display === "flex") {
            closeModal2();
        }
    });

    // 모달1 닫기 함수
    function closeModal1() {
        if (modal1) modal1.style.display = "none";
        fullScreen.classList.add("display-none");
    }
    // 모달2 닫기 함수
    function closeModal2() {
        if (modal2) modal2.style.display = "none";
        fullScreen.classList.add("display-none");
    }
})



// 팀원 추가
$("#modal_addBtn")
    .on('click', async (e) => {
        let memberInfo = {
            memberBlog: $("#blogInput").val(),
            memberMBTI: $("#mbtiInput").val(),
            memberName: $("#nameInput").val(),
            memberPhoto: $("#modal-update-image").attr("src"),
            passion: $("#planInput").val()
        };

        await addDoc(collection(db, collection_name), memberInfo);
        console.log('추가 성공');

        window.location.reload();
    });


// 팀원 삭제
$("#modal_deleteBtn")
    .on('click', async (e) => {

        let member = e.target.closest('.modal-content');              // 클릭된 수정 버튼을 포함하는 Member 찾기
        await deleteDoc(doc(db, collection_name, member.id));      // Member id와 일치하는 문서 제거
        window.location.reload();
    });


// 팀원 수정
$("#modal_updateBtn")
    .on('click', async (e) => {

        let member = e.target.closest('.modal-content');       // 클릭된 수정 버튼을 포함하는 Member 찾기

        let memberUpdateInfo = {
            memberBlog: $('#blogUpdate').val(),
            memberMBTI: $('#mbtiUpdate').val(),
            memberName: $('#nameUpdate').val(),
            passion: $('#planUpdate').val()
        };

        await updateDoc(doc(db, collection_name, member.id), memberUpdateInfo); // Member id와 일치 하는 문서 업데이트
        window.location.reload();
    })





