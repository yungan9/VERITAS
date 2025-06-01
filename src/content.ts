(() => {
    console.log('content script 실행');

    const articles = document.querySelectorAll('article.sdp-review__article__list.js_reviewArticleReviewList');
    if (articles.length === 0) {
        console.log('article 탐색 오류');
        return;
    }

    const data = Array.from(articles).map((article) => {
        const reviewId = article
            .querySelector('.sdp-review__article__list__help.js_reviewArticleHelpfulContainer')
            ?.getAttribute('data-review-id') ?? '';

        const ratingAttr = article
            .querySelector('.sdp-review__article__list__info__product-info__star-orange')
            ?.getAttribute('data-rating') ?? '0';
        const rating = parseFloat(ratingAttr);

        const content = article.querySelector('.sdp-review__article__list__review__content')?.textContent?.trim() ?? '';

        const boolimg = article.querySelector('.sdp-review__article__list__attachment__list') !== null;

        return {
            reviewId,
            rating,
            content,
            boolimg,
        };
    });

    console.log(`${data.length}개의 리뷰 데이터를 수집했습니다.`);
    console.log(data);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/analyze-reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.results) {
                console.log('분석 결과:', result.results);
            } else if (result.error) {
                console.error('분석 실패:', result.error.code, result.error.message);
            } else {
                console.warn('예외:', result);
            }
        })
        .catch((err) => {
            console.error('네트워크 또는 서버 오류:', err);
        });
})();
