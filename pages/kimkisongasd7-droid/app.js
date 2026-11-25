/* 페이지: 플러스원(pages/내아이디/index.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 플러스원 페이지(쓰는 API: API 이름, 키 이름)
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 내 사이트 README.md의 생성형 AI 사용 내역에 */

// app.js : 키가 필요한 API를 불러와 결과 칸에 넣기(4단계). 주석을 따라 여러분이 채웁니다
async function loadPlusOne() {
  const result = document.getElementById("result");
  const key = getKey("DATA_GO_KR_KEY");   // 내 폴더 keys.js의 키(내 API의 키 이름으로 바꿈. 대문자와 밑줄, _KEY로 끝냄)
  if (key === "") {
    setState(result, "error", "이 폴더의 keys.js에 DATA_GO_KR_KEY가 없습니다");
    return;
  }
  setState(result, "loading", "불러오는 중입니다.");
  try {
    // 1. 주소 조립: 키는 위의 key를 넣고(공공데이터포털은 Encoding 키 그대로), 입력값은 encodeURIComponent로 감쌉니다.
    //    예(공공데이터포털 TourAPI 대전 관광지, 요청 값은 활용가이드 최신판에서 확인):
    //    const url = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2?serviceKey=" + key +
    //      "&MobileOS=ETC&MobileApp=Web&_type=json&numOfRows=10&pageNo=1&areaCode=3";
    // 2. 불러오기: const data = await fetchJSON(url);  (XML만 주는 API는 fetchXML(url, "item"))
    // 3. 응답 경로 찾기: console.log(data)로 펼쳐 보며 화면에 쓸 값의 경로를 찾습니다(예: data.response.body.items.item).
    // 4. 화면에 넣기: setState(result, "done", "") 뒤 값을 result에 넣습니다(HTML로 넣을 때는 escapeHTML).
    //    0건이면 setState(result, "empty", "찾은 결과가 없습니다.")
    setState(result, "empty", "아직 만들지 않았습니다(app.js의 4단계 주석을 따라 채웁니다).");   // 다 만들면 이 줄을 지움
  } catch (err) {
    setState(result, "error", "불러오지 못했습니다(" + err.message + ")");
  }
}
loadPlusOne();