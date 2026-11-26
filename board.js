/* 페이지: 보드(index.html)   만든 사람: 김기송(kimkisongasd7-droid)
   맡은 기능: 필수 1 실시간 목록, 2 요청을 바꾸는 검색, 3 정렬 2가지, 5 찜과 찜 모두 지우기
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에 */
function sortBy(list, key, desc) {
    return [...list].sort((a, b) => {
        let result = 0;
        if (typeof a[key] === "string") {
            result = a[key].localeCompare(b[key]);
        } else {
            result = a[key] - b[key];
        }
        const sign = desc ? -1 : 1;
        return result * sign;
    });
}

async function loadSearch(keyword){
  const board = document.getElementById("board");
  setState(board, "loading", "영화 목록을 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("search/movie", { query: keyword }));
    setState(board, "done", "");
    movies = data.results.map(toMovie);
    refresh();
  } catch (err) {
    setState(board, "error", "검색 결과를 불러오지 못했습니다(" + err.message + ")");
  }
}



let movies = [];

const liked = loadLiked();



// board.js : 상영 중 목록 불러오기(기본형)
async function loadNowPlaying() {
  const board = document.getElementById("board");
  setState(board, "loading", "영화 목록을 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("movie/now_playing", { region: "KR" }));
    setState(board, "done", "");
    movies = data.results.map(toMovie);
    refresh();
  } catch (err) {
    setState(board, "error", "목록을 불러오지 못했습니다(" + err.message + ")");
  }
}
loadNowPlaying();

// TODO 필수 1: 이 renderCards를 #3의 renderCards로 바꾸기(평점 배지, 대체 표지, ♥ 버튼. 맨 아래 바꿔야 하는 4 곳)
// renderCards : 영화 배열 ⇒ 보드에 간단한 카드를 그림(반환값 없음). #3의 renderCards로 바꿀 자리입니다
const renderCards = (list) => {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) {
            card.classList.add("hot");
        }


        card.setAttribute("data-type", m.type);
        card.setAttribute("data-id", m.id);
        let rank = "";
        if (m.type === "boxoffice") {
            rank = `<span class="rank">${m.rank}</span>`;
        }
        let poster = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${escapeHTML(m.title)} 포스터">`;
        if (m.poster === null) {
            card.classList.add("no-poster");
            poster = `<div class="poster-fallback">${escapeHTML(m.title[0])}</div>`;
        }
        let heart = "like";
        if (liked.includes(m.id)) {
            heart = "like liked";
        }
        let rating = "평점 없음";
        if (m.rating > 0) {
            rating = m.rating.toFixed(1);
        }

        card.innerHTML = `
           ${poster}
           ${rank}
           <span class="badge">${rating}</span>
           <div class="info">
           <h3>${m.title}</h3>
           <p class="year">${m.year || "개봉일 미정"}</p>
           <button class="${heart}" type="button">♥</button>
           </div>`;
        board.appendChild(card);
     
        //updateLikeCount();
    }
    document.querySelector("#count").textContent = list.length + "편";
    document.getElementById("likeCount").textContent = liked.length;
    if (list.length === 0) {
      setState(board, "empty", "조건에 맞는 영화가 없습니다.");
    }
}
function getView() {
    const key = document.getElementById("sort").value;
    return sortBy(movies, key, key !== "title");
}

function refresh() { 
    renderCards(getView()); 
}










document.getElementById("sort").addEventListener("change", refresh);
//검색 이벤트
document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const keyword = e.target.value.trim();
  if(keyword === "") {
    loadNowPlaying();
  }else {
    loadSearch(keyword);
  }
});
// 찜 이벤트
document.querySelector(".board").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = Number(card.getAttribute("data-id"));
    if (e.target.closest(".like")) {
        const i = liked.indexOf(id);
        if (i === -1) {
            liked.push(id);
        } else {
            liked.splice(i, 1);
        }
        saveLiked(liked);
        refresh();
        return;
    }
    location.href = "detail.html?id=" + id;
});
// 찜 모두 지우기 이벤트
document.getElementById("clearLiked").addEventListener("click", () => {
  liked.splice(0, liked.length);
  saveLiked(liked);
  refresh();
});


// TODO 필수 2: 검색창에서 Enter를 치면 tmdbUrl("search/movie", { query: 검색어 })로 다시 불러와 그리기
// TODO 필수 3: #2의 sortBy와 #3의 getView로 정렬 2가지 이상(검색 결과에도 적용)
// TODO 필수 5: #3의 찜(보드 클릭 리스너 하나)을 loadLiked, saveLiked와 영화 id로 옮기고 찜 모두 지우기 버튼

/* 과제 #3 코드를 재사용할 때, 바꿔야 하는 4 곳(STARTER.md 7절과 같음)
   1. 데이터: movies 대신 data.results.map(toMovie)로 만든 배열
   2. 찜 키: "liked" 대신 loadLiked, saveLiked(키 final-liked, web-hw3의 찜과 섞이지 않게)
   3. 찜 기준: 제목 대신 id(data-title ⇒ data-id). 속성값은 문자열이라 Number()로 바꿔 m.id와 비교합니다.
   4. 상세: <dialog> 대신 detail.html?id=영화번호로 이동(카드 안의 링크나 location.href).
      openDetail의 그리기 코드는 detail.js로 가져와 movie/{id} 응답으로 채웁니다.
   #3 renderCards의 평점 배지를 그대로 쓰면 평점 0이 "0"으로 보이니 위 카드처럼 "평점 없음"으로 바꿉니다. */
