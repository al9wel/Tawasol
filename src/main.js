const postsContainer = document.getElementById("posts");
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
getPosts();
