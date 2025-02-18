/**
 * 기능
 * 팀원: 추가, 수정, 삭제, 조회
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, collection,addDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


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

// 랜덤 이미지 가져오기
const imageArray = [
            "a.png",
            "b.png",
            "c.png",
            "d.png",
            "e.png",
            "f.png",
    ]; 


// Read Members
$(document).ready(async function () {
    let docs = await getDocs(collection(db, collection_name));
    docs.forEach((doc) => {
        let row = doc.data();
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
});


// Create Members
$("#modal_addBtn")
    .on('click', async (e) => {
        let memberInfo = {
            memberBlog: $("#blogInput").val(),
            memberMBTI: $("#mbtiInput").val(),
            memberName: $("#nameInput").val(),
            memberPhoto: `../asset/memberImages/${imageArray[Math.floor(Math.random() * imageArray.length)]}`,
            passion: $("#planInput").val()
        };

        await addDoc(collection(db, collection_name), memberInfo);
        console.log('추가 성공');

        window.location.reload();
    });


// Delete Members
$("#modal_deleteBtn")
    .on('click', async (e) => {

    let userId = e.target.closest('.team-card').id;              // 가장 가까운 member 클래스의 userId
    console.log('Delete Target: '+userId);

    await deleteDoc(doc(db, collection_name, userId));      // userId와 일치하는 컬렉션 제거
    console.log('삭제 성공');
    window.location.reload();
});


// Update Members
$("#modal_updateBtn")
    .on('click', async (e) => {

    let member = e.target.closest('.team-card');       // 클릭된 수정 버튼을 포함하는 Member 찾기
    console.log('Update Target: '+member.id);

    let memberUpdateInfo = {
        memberBlog: $('#blogUpdate').val(),
        memberMBTI: $('#mbtiUpdate').val(),
        memberName: $('#nameUpdate').val(),
        passion: $('#planUpdate').val()
    };

    await updateDoc(doc(db, collection_name, member.id), memberUpdateInfo);
    console.log('업데이트 성공: '+memberName);
    window.location.reload();
});