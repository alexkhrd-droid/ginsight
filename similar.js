 
// similar.js — Похожие посты по ВСЕМ меткам текущего поста
// Подключается только на страницах item (отдельных постов)

const MAX_RELATED = 3;           // сколько показывать
const REQUEST_PER_LABEL = 6;    // сколько запрашивать с каждой метки (на случай, если текущий пост попадёт)

let collectedPosts = [];        // сюда соберём все посты из всех меток
let processedLabels = 0;
const currentPostId = document.getElementById('related-posts-data')?.getAttribute('data-post-id');

function renderRelatedPosts(json) {
  if (!json.feed.entry) return;

  // Добавляем посты из текущего запроса
  json.feed.entry.forEach(entry => {
    const id = entry.id?.$t?.split('post-')[1];
    if (id && id !== currentPostId) {
      collectedPosts.push(entry);
    }
  });

  processedLabels++;

  // Ждём, пока придут ответы со всех меток
  if (processedLabels < totalLabels) return;

  // Убираем дубли по id (на всякий случай)
  const uniquePosts = [];
  const seenIds = new Set();
  collectedPosts.forEach(post => {
    const id = post.id.$t.split('post-')[1];
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniquePosts.push(post);
    }
  });

  // Сортируем по дате (новые сверху) — опционально
  uniquePosts.sort((a, b) => new Date(b.published.$t) - new Date(a.published.$t));

  // Берём первые MAX_REL постов
  const finalPosts = uniquePosts.slice(0, MAX_REL);

  // Если ничего не нашли — прячем блок
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
// Автозапуск — только на страницах постов
// =========================================
(function () {
  const dataEl = document.getElementById('related-posts-data');
  if (!dataEl) return;

  const labelsRaw = dataEl.getAttribute('data-labels'); // строка типа "litigation, news, law"
  if (!labelsRaw) return;

  const labels = labelsRaw.split(',')
                         .map(l => l.trim())
                         .filter(l => l.length > 0);

  if (labels.length === 0) return;

  totalLabels = labels.length;
  processedLabels = 0;
  collectedPosts = [];

  // Делаем отдельный запрос на каждую метку
  labels.forEach(label => {
    const script = document.createElement('script');
    script.src = `/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json-in-script&max-results=${REQUEST_PER_LABEL}&callback=renderRelatedPosts`;
    document.head.appendChild(script);
  });
})();

