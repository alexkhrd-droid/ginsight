 
function renderRelatedPosts(json) {
  const container = document.getElementById('related-posts-container');
  if (!container) return;

  const currentPostId = document.getElementById('related-posts-data')?.getAttribute('data-post-id');
  if (!currentPostId) return;

  let html = '<div class="related-grid">';
  let added = 0;
  const maxPosts = 3;

  json.feed.entry?.forEach(post => {
    if (added >= maxPosts) return;

    const postId = post.id?.$t?.split('post-')[1];
    if (postId === currentPostId) return; // пропускаем текущий пост

    const title = post.title?.$t || 'Без заголовка';
    const url = post.link?.find(l => l.rel === 'alternate')?.href || '#';
    const thumb = post.media$thumbnail
      ? post.media$thumbnail.url.replace('/s72-c/', '/s600/')
      : 'https://via.placeholder.com/600x400?text=No+Image'; // можно убрать или заменить на свой заглушек

    html += `
      <article class="bottom-card">
        <a href="${url}">
          <img src="${thumb}" class="bottom-card-img" alt="${title}" loading="lazy"/>
        </a>
        <div class="bottom-card-body">
          <h3 class="bottom-card-title">
            <a href="${url}">${title}</a>
          </h3>
        </div>
      </article>`;

    added++;
  });

  html += '</div>';

  if (added > 0) {
    container.innerHTML = html;
  } else {
    container.style.display = 'none'; // или container.innerHTML = '';
  }
}

// Автозапуск только если есть нужный контейнер с данными
(function () {
  const dataEl = document.getElementById('related-posts-data');
  if (!dataEl) return;

  const label = dataEl.getAttribute('data-label');
  if (!label) return;

  const script = document.createElement('script');
  script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=6&callback=renderRelatedPosts`;
  document.head.appendChild(script);
})();
