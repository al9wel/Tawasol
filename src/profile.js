const loader = document.querySelector(".loader1");
function fillCurrentUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fillUserInfo(id);
}
function gotoHome() {
    window.location.href = 'index.html';
}
async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await successError("info", "تم تسجيل الخروج بنجاح");
    window.location.href = 'index.html';
}
async function successError(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        color: "#fff",
        background: "#050f16",
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    await Toast.fire({
        icon: icon,
        title: title
    });
}
function gotoProfile() {
    const token = localStorage.getItem("token");
    if (token == null) {
        Swal.fire({
            icon: "info",
            title: "تنبيه",
            text: `قم بتسجيل الدخول لرؤيه منشورات المستخدم `,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }
    else {
        const user = JSON.parse(localStorage.getItem("user"));
        window.location.href = `profile.html?id=${user.id}`
    }
}
async function fillUserInfo(id) {
    const userInfoContainer = document.getElementById("userInfo")
    userInfoContainer.classList.remove("bac")
    userInfoContainer.classList.add("hidden")
    showLoader()
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/users/${id}`)
        if (!response.ok) {
            closeLoader();
            successError("error", "حدث خطأ اثناء جلب معلومات المستخدم");
            return;
        }
        let data = await response.json();
        let user = data.data;
        console.log(user)
        userInfoContainer.classList.add("bac")
        userInfoContainer.classList.remove("hidden")
        userInfoContainer.innerHTML = `
        <div class="card flex flex-col items-center  justify-center gap-4" style="
    background-color: #36415369;
    padding: 20px;
    border-radius: 7px;
    position: relative;
    width: 90%;
    border: 1px solid #ffffff91;
    ">
        <img class="rounded-full" src="${user.profile_image}" onerror="this.src='../images/user.png'"
        style="
        width: 120px;
        height: 120px;
        margin-top: -60px;
        object-fit: cover;
        background-color: #364153;
        border: 2px solid white;
        " alt="" />
        <div>
            <h1 style="text-align: center;
            color: white;
            font-weight: bold;
            font-size: 30px;">${user.name}</h1>
            <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">${user.username}@</h1>
        </div>
        <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">${user.email}</h1>
        <div class="flex items-center justify-center gap-2">
            <div>
                <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">المنشورات</h1>
                <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">${user.posts_count}</h1>
            </div>
            <div>
                <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">التعليقات</h1>
                <h1 style="text-align: center;
            color: rgba(255, 255, 255, 0.582);
            font-weight: bold;
            font-size: 20px;">${user.comments_count}</h1>
            </div>
        </div>
    </div>
        `
        closeLoader();
        fillUserPosts(id)
    }
    catch (error) {
        closeLoader();
        successError("error", "حدث خطأ اثناء جلب معلومات المستخدم")
    }
}
async function fillUserPosts(id) {
    let postsContainer = document.getElementById("posts");
    showLoader();
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/users/${id}/posts`);
        if (!response.ok) {
            closeLoader();
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: `Error happend with status of : ${response.status}`,
                color: "#fff",
                background: "#050f16",
                confirmButtonText: "حسنا",
                confirmButtonColor: "#263238",
            });
            return;
        }
        let data = await response.json();
        let posts = data.data;
        postsContainer.innerHTML = "";
        let content = ``;
        posts.forEach(post => {
            let username = post.author.username;
            let userID = post.author.id;
            let postID = post.id;
            let name = post.author.name;
            let title = post.title;
            let body = post.body;
            let commentsCount = post.comments_count;
            let published = post.created_at;
            let img = post.image;
            let profileImg = post.author.profile_image;
            let tags = post.tags;
            let publishedNums = `${published[0]}${published[1]}`
            if (published.includes(`second`) || published.includes(`seconds`)) {
                published = `قبل ${publishedNums} ثانيه`
            }
            else if (published.includes(`minutes`) || published.includes(`minute`)) {
                published = `قبل ${publishedNums} دقيقه`
            }
            else if (published.includes(`week`) || published.includes(`weeks`)) {
                published = `قبل ${publishedNums} اسبوع`
            }
            else if (published.includes(`day`) || published.includes(`days`)) {
                published = `قبل ${publishedNums} يوم`
            }
            else {
                published = `قبل ${publishedNums} ساعه`
            }
            content += pagePost(name, title, body, commentsCount, published, img, profileImg, tags, postID, userID, username);
        });
        postsContainer.innerHTML = content
        closeLoader();
    }
    catch (error) {
        closeLoader();
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: `${error}`,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }
}
function fillComments(id) {
    let commentContainer = document.getElementById(`comments-container-${id}`)
    showLoader();
    fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then((res) => {
            if (!res.ok) {
                closeLoader();
                successError("error", "حدث خطا اثناء جلب التعليقات");
                return;
            }
            return res.json();
        })
        .then((data) => {
            let comments = data.data.comments
            let commentsCount = document.getElementById(`commentsCount${id}`);
            commentsCount.innerHTML = data.data.comments_count;
            let content = ""
            comments.forEach((c) => {
                content += `
                <div id="comment" class="flex gap-2 flex-col">
                <div id="commentInfo" class="flex items-center gap-2 ">
                <img style="width: 35px; height: 35px;" class="rounded-full border border-blue-50"
                src="${c.author.profile_image}" onerror="this.src='../images/user.png'" alt="">
                <p>${c.author.name}</p>
                </div>
                <p id="commentText" style="color: rgba(255, 255, 255, 0.402); font-weight: normal;">
                ${c.body}
                </p>
                </div>`
                commentContainer.innerHTML = content
            })
            closeLoader()
        })
        .catch(() => {
            closeLoader();
            successError("error", ` حدث خطا اثناء جلب التعليقات`);
        })
}
async function addComment(id) {
    let token = localStorage.getItem("token");
    let comment = document.getElementById(`commentInput-${id}`).value;
    if (comment != '') {
        try {
            let com = {
                "body": comment
            }
            showLoader();
            let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(com)
            })
            if (!response.ok) {
                closeLoader();
                successError("error", "حدث خطا اثناء ارسال التعليقات");
                return
            }
            let data = await response.json();
            fillComments(id)
            document.getElementById(`commentInput-${id}`).value = ''
            closeLoader();
        }
        catch (error) {
            closeLoader();
            successError("error", "حدث خطا اثناء ارسال التعليقات");
        }
    }

}
document.addEventListener('click', function (event) {
    let menu = document.getElementById('dropdownMenu');
    let toggleButton = document.querySelector('.menu-btn');
    if (!menu.contains(event.target) && event.target !== toggleButton) {
        menu.style.display = 'none';
    }
});
function sendPost(id) {
    console.log(id)
}
function pagePost(name, title, body, commentsCount, published, img, profileImg, tags, number, userID, username) {
    let tagContent = "";
    let icon = ``;
    tags.forEach((tag) => {
        if (tag.arabic_name === "رياضة") {
            icon = `<i class="fa-solid fa-volleyball"></i>`
        }
        else if (tag.arabic_name === "اقتصاد") {
            icon = `<i class="fa-solid fa-coins"></i>`
        }
        else if (tag.arabic_name === "سياسة") {
            icon = `<i class="fa-solid fa-landmark"></i>`
        }
        else if (tag.arabic_name === "ترفيه") {
            icon = `<i class="fa-solid fa-gamepad"></i>`
        }
        tagContent += `
        <li class="tooltip-link">
            <a class="tooltip-links" href="#">
                ${icon}
                ${tag.arabic_name}
            </a>
        </li>
        `
    })
    let btns = ``
    const user = JSON.parse(localStorage.getItem("user"));
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (user) {
        if (id == user.id) {
            btns = `    <div id="updatebtns">
                        <button onclick="updatePost(${number})" class="up-btn2 p-2 rounded-md"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deletePost(${number})" class="up-btn1 p-2 rounded-md"><i class="fa-solid fa-trash"></i></button>
                        <button onclick="sendPost(${number})" class="up-btn3 p-2 rounded-md"><i class="fa-solid fa-share"></i></button>
                        </div>`
        }
        else {
            btns = `
            <button onclick="sendPost(${number})" class="up-btn3 p-2 rounded-md"><i class="fa-solid fa-share"></i></button>
            `
        }
    }
    else {
        btns = `
        <button onclick="sendPost(${number})" class="up-btn3 p-2 rounded-md"><i class="fa-solid fa-share"></i></button>
        `
    }
    return `<div class="bg-gray-900 w-11/12 sm:w-1/2 flex justify-center items-center flex-col rounded-md gap-2"style="border: 2px solid #ffffff87;">
                <div class="flex justify-between items-center gap-2 p-2 bg-gray-700 w-full rounded-t-md">
                    <div class="flex justify-start items-center gap-2">
                    <img onclick="gotoProfile(${userID})" class="cursor-pointer rounded-full border border-blue-50" style="width: 40px; height: 40px; object-fit:cover;" src="${profileImg}" onerror="this.src='../images/user.png'">
                    <div class="flex items-center justify-center flex-col">
                    <h2 style="align-self: flex-start;font-size: 20px;" onclick="gotoProfile(${userID})" class="cursor-pointer text-blue-100 font-bold tracking-wider">${name}</h2>
                    <h2 style="color: #ffffff94;font-size: 13px;align-self: flex-start;" onclick="showUserPage(${userID})" class="cursor-pointer text-gray-500 text-sm tracking-wider">${username}@</h2>
                    </div>
                    </div>
                    ${btns}
                </div>
                <div class="relative overflow-hidden rounded-md w-11/12">
                    <img id="postImage-${number}" style="width:100%;" loading="lazy" src="${img}" alt="" />
                </div>
                <div class="text-blue-100 w-full px-6">
                    <h1 id="postTitle-${number}" class="md:font-bold font-medium md:text-2xl text-xl overflow-hidden">${title}</h1>
                    <p id="postBody-${number}" class="md:text-xl text-sm m-2 overflow-hidden">${body}</p>
                    <span class="md:text-sm text-xs text-gray-500">${published} </span>
                </div>
                <hr style="width:100%;height: 2px; background: -webkit-gradient(linear, 0 0, 100% 0, from(transparent), to(transparent), color-stop(50%, black));"
                    class="bg-linear-to-tr bg-no-repeat from-blue-950 to-black border-0 my-2">
                <div class="w-full text-blue-200 font-bold px-6 pb-2 text-sm">
                    <div class="flex gap-2 items-center justify-between w-full">
                        <div onclick="fillComments(${number})" class=" flex gap-2 items-center cursor-pointer hover:text-blue-800 w-fit">
                            <p class="">التعليقات</p>
                            <span>(<span id="commentsCount${number}">${commentsCount}</span>)</span>
                        </div>
                        <div style="color:#37474F;" class=" flex gap-2 items-center cursor-pointer w-fit text-xs">
                            <div class="tooltip-wrapper">
                                <ul class="tooltip-container">
                                    <li style="--i: 1.1s" class="nav-link">
                                        <div class=" tooltip-tab bg-linear-to-bl bg-no-repeat from-blue-950 to-gray-800">
                                            <i class="fa-solid fa-tags text-sm"></i>
                                            التاقات
                                        </div>
                                        <div class="tooltip">
                                            <ul class="tooltip-menu-with-icon bg-linear-to-bl bg-no-repeat from-blue-950 to-gray-800">
                                                ${tagContent}
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <div id="comments-container-${number}" class="comments-container flex gap-2 flex-col" style="max-height: 150px; overflow-y: auto; ">
                        </div>
                        <hr style="width:100%;height: 2px; background: -webkit-gradient(linear, 0 0, 100% 0, from(transparent), to(transparent), color-stop(50%, black));"
                            class="bg-linear-to-tr bg-no-repeat from-blue-950 to-black border-0 my-2">
                        <div class="flex items-center justify-center gap-4">
                            <button style="padding-left: 15px;padding-right: 15px;" onclick="addComment(${number})" id="addCommentBtn"
                                class="borderborder-blue-50 p-2 rounded-md cursor-pointer"><i class="fa-solid fa-paper-plane"></i></button>
                            <input id="commentInput-${number}" type="text" class="rounded-md border border-blue-50 p-2" style="width: 70%;"
                                placeholder="اكتب تعليق">
                        </div>
                    </div>
                </div>
            </div>`;
}
function showLoader() {
    loader.classList.remove("hidden");
}
function closeLoader() {
    loader.classList.add("hidden");
}
function toggleMenu() {
    var menu = document.getElementById('dropdownMenu');
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}
addPostBtn.addEventListener("click", async () => {
    let { value: info } = await Swal.fire({
        title: "منشور جديد",
        html: `
        <input  style="width:70%; " type="text" id="swall-input1" class="swal2-input" placeholder="العنوان">
        <textarea style="width:70%; margin-top:15px;" id="swall-input2" class="border border-blue-50 rounded-md p-2" placeholder="الوصف" rows="4" cols="50"></textarea>
        <div>
            <input accept="image/*" onchange="selectImages('swall-input5','postImage','delBtn')" type="file" id="swall-input5">
            <label  for="swall-input5" class="up-btn p-2 rounded-md">اختيار صوره</label>
        </div>
        <div style="width: 80%; margin: 10px auto; display: flex; justify-content: center;align-items: center; flex-direction: column-reverse; gap: 10px;">
            <button onclick="delPic('swall-input5','postImage','delBtn')" id="delBtn" style="color: #ffffff;background:rgb(38, 50, 56);" class="rounded-full p-2 hidden cursor-pointer">حذف</button>
            <img id="postImage" style="max-width: 80%;" class="rounded-md" src="" alt="">
        </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swall-input1").value,
                document.getElementById("swall-input2").value,
                document.getElementById("swall-input5").files[0]
            ];
        },
        showCloseButton: true,
        color: "#fff",
        background: "#050f16",
        confirmButtonText: "نشر",
        confirmButtonColor: "#263238",
    });
    if (info) {
        newPost(info[0], info[1], info[2]);
    }
})
async function newPost(title, body, img) {
    let formData = new FormData();
    if (img != null) {
        formData.append("image", img)
    }
    formData.append("body", body)
    formData.append("title", title)
    showLoader();
    let token = localStorage.getItem("token");
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/posts`, {
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
                // "Content-Type": "multipart/form-data",
            },
            // عند استخدام فورم داتا لاحاجه لاستخدام كونتنت تايب
            // لانها ستسبب مشاكل
            body: formData
        })
        let data = await response.json();
        if (!response.ok) {
            closeLoader();
            successError("error", data.message);
            return;
        }
        else {
            closeLoader();
            await successError("success", "تم النشر بنجاح");
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            fillUserPosts(id)
        }
    }
    catch (error) {
        closeLoader();
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: error,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }
}
function selectImages(btnID, imageID, delBtnId) {
    let btn = document.getElementById(btnID);
    let image = document.getElementById(imageID);
    let delBtn = document.getElementById(delBtnId);
    let reader = new FileReader();
    reader.readAsDataURL(btn.files[0])
    reader.onload = () => {
        image.setAttribute("src", reader.result)
        delBtn.classList.remove("hidden");
    }
}
function delPic(btnID, imageID, delBtnId) {
    let btn = document.getElementById(btnID);
    let image = document.getElementById(imageID);
    let delBtn = document.getElementById(delBtnId);
    image.setAttribute("src", null);
    delBtn.classList.add("hidden");
    btn.value = '';
}
async function updatePost(id) {
    let postImage = document.getElementById(`postImage-${id}`).getAttribute("src")
    let postTitle = document.getElementById(`postTitle-${id}`).innerHTML
    let postBody = document.getElementById(`postBody-${id}`).innerHTML
    let { value: info } = await Swal.fire({
        title: "تعديل منشور",
        html: `
        <input value="${postTitle}"  style="width:70%; " type="text" id="swall-input1" class="swal2-input" placeholder="العنوان">
        <textarea style="width:70%; margin-top:15px;" id="swall-input2" class="border border-blue-50 rounded-md p-2" placeholder="الوصف" rows="4" cols="50">${postBody}</textarea>
        <div>
            <input accept="image/*" onchange="selectImages('swall-input5','postImage','delBtn')" type="file" id="swall-input5">
            <label  for="swall-input5" class="up-btn p-2 rounded-md">اختيار صوره</label>
        </div>
        <div style="width: 80%; margin: 10px auto; display: flex; justify-content: center;align-items: center; flex-direction: column-reverse; gap: 10px;">
            <img id="postImage" style="max-width: 80%;" class="rounded-md" src="${postImage}" alt="">
        </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            // if
            return [
                document.getElementById("swall-input1").value,
                document.getElementById("swall-input2").value,
                document.getElementById("swall-input5").files[0]
            ];
        },
        showCloseButton: true,
        color: "#fff",
        background: "#050f16",
        confirmButtonText: "تعديل",
        confirmButtonColor: "#263238",
    });
    if (info) {
        updatePost2(info[0], info[1], info[2], id);
    }
}
async function updatePost2(title, body, img, id) {
    let formData = new FormData();
    if (img != null) {
        formData.append("image", img)
    }
    formData.append("body", body)
    formData.append("title", title)
    formData.append("_method", "put")
    showLoader();
    let token = localStorage.getItem("token");
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
                // "Content-Type": "multipart/form-data",
            },
            // عند استخدام فورم داتا لاحاجه لاستخدام كونتنت تايب
            // لانها ستسبب مشاكل
            body: formData
        })
        let data = await response.json();
        if (!response.ok) {
            closeLoader();
            successError("error", data.message);
            return;
        }
        else {
            closeLoader();
            await successError("success", "تم تعديل المنشور بنجاح");
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            fillUserPosts(id)
        }
    }
    catch (error) {
        closeLoader();
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: error,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }

}
async function deletePost(id) {
    Swal.fire({
        title: "هل انت متاكد من الحذف؟",
        showDenyButton: true,
        confirmButtonText: "رجوع",
        icon: "question",
        background: "#050f16",
        denyButtonText: "حذف"
    }).then(async (result) => {
        if (result.isDenied) {
            try {
                let token = localStorage.getItem("token")
                showLoader()
                let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "authorization": `Bearer ${token}`,
                    }
                })
                if (!response.ok) {
                    closeLoader();
                    successError("error", "حدثت مشكله اثناء حذف المنشور");
                    return
                }
                let data = await response.json();
                closeLoader()
                successError("success", "تم حذف المنشور بنجاح")
                const urlParams = new URLSearchParams(window.location.search);
                const userID = urlParams.get('id');
                fillUserInfo(userID)
            }
            catch (error) {
                closeLoader();
                successError("error", "حدثت مشكله اثناء حذف المنشور")
            }
        }
    });
}
fillCurrentUserInfo();
