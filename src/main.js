const postsContainer = document.getElementById("posts");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const btnContainer = document.getElementById("btnContainer");
const logedinBtnContainer = document.getElementById("logedinBtnContainer");
const logoutBtn = document.getElementById("logoutBtn");
const addPostBtn = document.getElementById("addPostBtn");
const profileBtn = document.getElementById("profile");
const loader = document.querySelector(".loader1");
const loginForm = document.getElementById("login-form");
const regForm = document.getElementById("reg-form");
const infoPic = document.getElementById("infoPic");
const infoName = document.getElementById("infoName");
const limit = 20;
let p = 10;
let scrolled = false
window.addEventListener("scroll", () => {
    const scrollP = window.scrollY + window.innerHeight;
    const pageH = document.body.offsetHeight;
    if (scrollP >= pageH && !scrolled) {
        scrolled = true
        p += 10;
        getPosts(p)
    }
})
// main functions
async function getPosts(plus = 0) {
    if (plus === 0) {
        p = 10;
    }
    showHideBtns();
    showLoader();
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/posts?limit=${plus + limit}`);
        if (!response.ok) {
            console.log(response)
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
        if (plus != 0) {
            scrolled = false
        }
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
        console.log(error)
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
    if (token == null) {
        Swal.fire({
            icon: "info",
            title: "تنبيه",
            text: `قم بتسجيل الدخول لكتابه تعليق`,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }
    else {
        let comment = document.getElementById(`commentInput-${id}`).value;
        if (comment != '') {
            try {
                let com = {
                    "body": comment
                }
                showLoader("");
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
}
async function login(username, password) {
    let info = {
        username: username,
        password: password
    }
    showLoader();
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/login`, {
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
        })
        let data = await response.json();
        if (!response.ok) {
            closeLoader();
            successError("error", data.message);
            return;
        }
        else {
            closeLoader();
            let token = data.token;
            let user = data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            await successError("success", "تم تسجيل الدخول بنجاح");
            getPosts();
        }
    }
    catch (error) {
        closeLoader();
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: `خطأ في الشبكه تحقق من اتصال الانترنت`,
            color: "#fff",
            background: "#050f16",
            confirmButtonText: "حسنا",
            confirmButtonColor: "#263238",
        });
    }
}
async function reg(name, username, email, password, image) {

    let formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)
    if (image != null) {
        formData.append("image", image)
    }
    formData.append("name", name)
    formData.append("email", email)
    showLoader();
    try {
        let response = await fetch(`https://tarmeezacademy.com/api/v1/register`, {
            method: `POST`,
            headers: {
                "Accept": "application/json",
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
            console.log(response);
            console.log(data);
            return;
        }
        else {
            closeLoader();
            let token = data.token;
            let user = data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            await successError("success", "تم انشاء الحساب بنجاح");
            showHideBtns();
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
            getPosts();
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
// main events
loginBtn.addEventListener("click", async () => {
    let { value: info } = await Swal.fire({
        title: "تسجيل الدخول",
        html: `
        <input  style="width:70%;" type="text" id="swal-input1" class="swal2-input" placeholder="اسم المستخدم">
        <input  style="width:70%;" type="password" id="swal-input2" class="swal2-input" placeholder=" كلمه المرور">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        },
        showCloseButton: true,
        color: "#fff",
        background: "#050f16",
        confirmButtonText: "دخول",
        confirmButtonColor: "#263238",
    });
    if (info) {
        login(info[0], info[1]);
    }

});
logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await successError("info", "تم تسجيل الخروج بنجاح");
    getPosts();
});
registerBtn.addEventListener("click", async () => {
    let { value: info } = await Swal.fire({
        title: "تسجيل حساب",
        html: `
        <input  style="width:70%; " type="text" id="swall-input1" class="swal2-input" placeholder="الاسم">
        <input  style="width:70%; " type="text" id="swall-input2" class="swal2-input" placeholder="اسم المستخدم">
        <input  style="width:70%; " type="email" id="swall-input3" class="swal2-input" required placeholder=" الايميل">
        <input  style="width:70%; " type="password" id="swall-input4" class="swal2-input" placeholder="كلمه المرور">
        <div>
            <input accept="image/*" onchange="selectImages('swall-input6','postImageProfile','delBtnProfile')" type="file" id="swall-input6">
            <label  for="swall-input6" class="up-btn p-2 rounded-md">اختيار صوره</label>
        </div>
        <div style="width: 80%; margin: 10px auto; display: flex; justify-content: center;align-items: center; flex-direction: column-reverse; gap: 10px;">
            <button onclick="delPic('swall-input6','postImageProfile','delBtnProfile')" id="delBtnProfile" style="color: #ffffff;background:rgb(38, 50, 56);" class="rounded-full p-2 hidden cursor-pointer">حذف</button>
            <img id="postImageProfile" style="width: 150px;height: 150px;object-fit: cover;border: 1px solid white;" class="rounded-full hidden" src="" alt="">
        </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swall-input1").value,
                document.getElementById("swall-input2").value,
                document.getElementById("swall-input3").value,
                document.getElementById("swall-input4").value,
                document.getElementById("swall-input6").files[0]
            ];
        },
        showCloseButton: true,
        color: "#fff",
        background: "#050f16",
        confirmButtonText: "تسجيل",
        confirmButtonColor: "#263238",
    });
    if (info) {
        reg(info[0], info[1], info[2], info[3], info[4]);
    }
})
addPostBtn.addEventListener("click", async () => {
    let { value: info } = await Swal.fire({
        title: "منشور جديد",
        html: `
        <input  style="width:70%; " type="text" id="swall-input1" class="swal2-input" placeholder="العنوان">
        <textarea style="width:70%; margin-top:15px;" id="swall-input2" class="border border-blue-50 rounded-md p-2" placeholder="الوصف" rows="4" cols="50"></textarea>
        <div>
            <input accept="image/*" onchange="selectImages('swall-input5','postImage','delBtn')" type="file" id="swall-input5">
            <label  for="swall-input5" class="up-btn bg-red-500 p-2 rounded-md">اختيار صوره</label>
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
// side functions
function selectImages(btnID, imageID, delBtnId) {
    document.getElementById("postImageProfile").classList.remove("hidden")
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
    document.getElementById("postImageProfile").classList.add("hidden")
}
function toggleMenu2(userID, postID) {
    document.getElementById(`togl-${postID}`).classList.toggle("hidden")
}

function sendPost(id) {
    console.log(id);
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
    let items = ``
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        if (userID == user.id) {
            items = `
            <li onclick="gotoProfile(${userID})"><i class="fa-solid fa-location-dot"></i> <span style="margin:0px 5px ;">زياره</span></li>
            <li onclick="updatePost(${number})"><i class="fa-solid fa-pen"></i> <span style="margin:0px 5px ;">تعديل</span></li>
            <li onclick="deletePost(${number})"><i class="fa-solid fa-trash"></i> <span style="margin:0px 5px ;">حذف</span></li>
            <li onclick="sendPost(${number})"><i class="fa-solid fa-share"></i> <span style="margin:0px 0px ;">مشاركه</span></li>
            `
        }
        else {
            items = `
            <li onclick="gotoProfile(${userID})"><i class="fa-solid fa-location-dot"></i> <span style="margin:0px 5px ;">زياره</span></li>
            <li onclick="sendPost(${number})"><i class="fa-solid fa-share"></i> <span style="margin:0px 0px ;">مشاركه</span></li>
            `
        }
    }
    else {
        items = `
        <li onclick="gotoProfile(${userID})"><i class="fa-solid fa-location-dot"></i> <span style="margin:0px 5px ;">زياره</span></li>
        <li onclick="sendPost(${number})"><i class="fa-solid fa-share"></i> <span style="margin:0px 0px ;">مشاركه</span></li>
        `
    }
    return `<div class="bg-gray-900 w-11/12 sm:w-1/2 flex justify-center items-center flex-col rounded-md gap-2" style="border: 2px solid #ffffff87;">
                <div class="flex justify-between items-center gap-2 p-2 bg-gray-700 w-full rounded-t-md">
                    <div class="flex justify-start items-center gap-2">
                    <img onclick="gotoProfile(${userID})" class="cursor-pointer rounded-full border border-blue-50" style="width: 40px; height: 40px; object-fit:cover;" src="${profileImg}" onerror="this.src='../images/user.png'">
                    <div class="flex items-center justify-center flex-col">
                    <h2 style="align-self: flex-start;font-size: 20px;" onclick="gotoProfile(${userID})" class="cursor-pointer text-blue-100 font-bold tracking-wider">${name}</h2>
                    <h2 style="color: #ffffff94;font-size: 13px;align-self: flex-start;" onclick="showUserPage(${userID})" class="cursor-pointer text-gray-500 text-sm tracking-wider">${username}@</h2>
                    </div>
                    </div>
                    <div style="position: relative;"> 
                    <i style="margin-left: 20px;color: #ffffffa3;" onclick="toggleMenu2(${userID},${number})" class="fa-solid fa-ellipsis-vertical text-2xl text-blue-50 cursor-pointer"></i>
                    <ul id="togl-${number}" class="tog-m hidden">
                            ${items}
                        </ul>
                    </div>
                </div>
                <div class="relative overflow-hidden rounded-md w-11/12">
                    <img id="postImage-${number}" style="width:100%;" loading="lazy" src="${img}" alt="" />
                </div>
                <div class="text-blue-100 w-full px-6">
                    <h1 id="postTitle-${number}"  class="md:font-bold font-medium md:text-2xl text-xl overflow-hidden">${title}</h1>
                    <p id="postBody-${number}"  class="md:text-xl text-sm m-2 overflow-hidden">${body}</p>
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
            getPosts()
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
                getPosts()
            }
            catch (error) {
                closeLoader();
                successError("error", "حدثت مشكله اثناء حذف المنشور")
            }
        }
    });
}
function showLoader() {
    loader.classList.remove("hidden");
}
function closeLoader() {
    loader.classList.add("hidden");
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
function showHideBtns() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    // let addCommentBtn = document.getElementById("addComment")
    if (token == null) {
        btnContainer.classList.remove("hidden");
        logedinBtnContainer.classList.add("hidden");
        addPostBtn.classList.add("hidden");
        profileBtn.classList.add("hidden");
        // addCommentBtn.classList.add("hidden");
    }
    else {
        btnContainer.classList.add("hidden");
        logedinBtnContainer.classList.remove("hidden");
        addPostBtn.classList.remove("hidden");
        profileBtn.classList.remove("hidden");
        // addCommentBtn.classList.remove("hidden");
        infoName.innerHTML = user.username;
        infoPic.setAttribute("src", user.profile_image)
    }
}
function gotoProfile(id) {
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
        let currentID = user.id
        if (id == null) {
            window.location.href = `profile.html?id=${currentID}`
        }
        else {
            window.location.href = `profile.html?id=${id}`
        }
    }
}
function toggleMenu() {
    let menu = document.getElementById('dropdownMenu');
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}
// calling functions
getPosts();
// document.addEventListener("click", () => {
//     let menus = document.querySelectorAll(".tog-m");
//     menus.forEach((menu) => {
//         menu.classList.add("hidden")
//     })
// })
