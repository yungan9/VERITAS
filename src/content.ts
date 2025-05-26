(() => {
    console.log('content script 실행');

    const container = document.querySelector('div.review-article-container');
    if (!container) {
        console.log('div.review-article-container 탐색 오류');
        return;
    }

    const articles = container.querySelectorAll('article.sdp-review__article__list.js_reviewArticleReviewList');
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

    console.log(`✅ ${data.length}개의 리뷰 데이터를 수집했습니다.`);
    console.log(data);


})();
