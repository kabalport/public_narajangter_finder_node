const axios = require('axios');
const { SERVICE_KEY } = require('./config');  // config.js 파일에서 API 키 불러오기

// 나라장터 API 키와 기본 설정
const BASE_URL = 'http://apis.data.go.kr/1230000/BidPublicInfoService04';

// 현재 시각을 'YYYYMMDDHHmm' 형식으로 반환하는 함수
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
};

// 현재 연도의 첫날을 'YYYYMMDDHHmm' 형식으로 반환하는 함수
const getStartOfYearDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}01010000`;
};

// 특정 키워드로 공고 목록을 조회하는 함수
const fetchBidNotices = async (keyword) => {
    try {
        const response = await axios.get(`${BASE_URL}/getBidPblancListInfoCnstwk01`, {
            params: {
                ServiceKey: SERVICE_KEY,
                inqryDiv: 1,
                inqryBgnDt: getStartOfYearDateTime(), // 조회 시작일시를 현재 연도의 첫날로 설정
                inqryEndDt: getCurrentDateTime(), // 조회 종료일시를 현재 시각으로 설정
                numOfRows: 10,
                pageNo: 1,
                type: 'json',
            },
        });

        // 응답 데이터 구조 확인
        console.log(response.data);

        const items = response.data.response.body.items.item;

        // items가 배열인지 확인 후 필터링
        const filteredItems = Array.isArray(items) ? items.filter(item =>
            item.bidNtceNm.includes(keyword)
        ) : [];

        return filteredItems;

    } catch (error) {
        console.error('Error fetching bid notices:', error);
        return [];
    }
};

// 테스트 실행 함수
const testFetchBidNotices = async () => {
    const keyword = '광주'; // 검색할 키워드
    const notices = await fetchBidNotices(keyword);

    if (notices.length > 0) {
        console.log(`Found ${notices.length} notices with keyword "${keyword}":`);
        notices.forEach(notice => {
            console.log(`- ${notice.bidNtceNm} (공고번호: ${notice.bidNtceNo})`);
        });
    } else {
        console.log(`No notices found with keyword "${keyword}".`);
    }
};

// 테스트 실행
testFetchBidNotices();
