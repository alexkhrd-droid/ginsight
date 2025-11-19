// similar.js — Похожие посты по ВСЕМ меткам текущего поста
// ВЕРСИЯ 2.0 - Совместима со всеми шаблонами Blogger

const MAX_RELATED = 4;
const REQUEST_PER_LABEL = 6;

let collectedPosts = [];
let processedLabels = 0;
let totalLabels = 0;
let currentPostId = '';

function renderRelatedPosts(json) {
  if (!json.feed.entry) return;

  // Добавляем посты из текущего запроса, исключая текущий
  json.feed.entry.forEach(entry => {
    const id = entry.id?.$t?.split('post-')[1];
    if (id && id !== currentPostId) {
      collectedPosts.push(entry);
    }
  });

  processedLabels++;

  if (processedLabels < totalLabels) return;

  // Убираем дубли по id
  const uniquePosts = [];
  const seenIds = new Set();
  collectedPosts.forEach(post => {
    const id = post.id.$t.split('post-')[1];
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniquePosts.push(post);
    }
  });

  // Сортируем по дате
  uniquePosts.sort((a, b) => new Date(b.published.$t) - new Date(a.published.$t));

  const finalPosts = uniquePosts.slice(0, MAX_RELATED);
  const container = document.getElementById('related-posts-container');
  if (!container || finalPosts.length === 0) {
    if (container) container.style.display = 'none';
    return;
  }

  let html = '<div class="related-grid">';
  finalPosts.forEach(post => {
    const title = post.title?.$t || 'Без названия';
    const url = post.link?.find(l => l.rel === 'alternate')?.href || '#';
    const thumb = post.media$thumbnail
      ? post.media$thumbnail.url.replace('/s72-c/', '/s600/')
      : 'https://via.placeholder.com/600x400/eeeeee/999999?text=No+Image';

    html += `
      <article class="bottom-card">
        <a href="${url}" aria-label="${title}">
          <img src="${thumb}" class="bottom-card-img" alt="${title}" loading="lazy"/>
        </a>
        <div class="bottom-card-body">
          <h3 class="bottom-card-title">
            <a href="${url}">${title}</a>
          </h3>
        </div>
      </article>`;
  });
  html += '</div>';

  container.innerHTML = html;
}

// =========================================
// Автозапуск
// =========================================
(function () {
  const dataEl = document.getElementById('related-posts-data');
  const idEl = document.getElementById('related-post-id');

  if (!dataEl || !idEl) return;
  
  currentPostId = idEl.textContent.trim();

  // НОВЫЙ СПОСОБ ПОЛУЧЕНИЯ МЕТОК
  const labelSpans = dataEl.querySelectorAll('.label-name');
  if (labelSpans.length === 0) return;

  const labels = Array.from(labelSpans).map(span => span.textContent.trim());

  totalLabels = labels.length;
  processedLabels = 0;
  collectedPosts = [];

  labels.forEach(label => {
    const script = document.createElement('script');
    script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=${REQUEST_PER_LABEL}&callback=renderRelatedPosts`;
    document.head.appendChild(script);
  });
})();
