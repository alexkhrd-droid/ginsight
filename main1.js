// main.js — финальная версия, только то, что нужно
// Подключается только на главной через <b:if> в шаблоне

function truncate(text, limit) {
  if (!text) return '';
  text = text.replace(/<[^>]+>/g, '');
  return text.length > limit ? text.substring(0, limit) + '…' : text;
}

// 1. Hero Post (featured, первый пост)
function renderHeroPost(json) {
  const container = document.getElementById('hero-main-container');
  if (!container || !json.feed.entry?.[0]) return;
  const post = json.feed.entry[0];
  const title = post.title.$t;
  const snippet = post.summary ? truncate(post.summary.$t, 120) : '';
  let postUrl = post.link.find(l => l.rel === 'alternate')?.href || '#';
  let displayLabel = post.category?.find(c => c.term !== 'featured')?.term || '';
  const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const thumb = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s1600/') : '';

  container.innerHTML = `
    <article class="hero-main">
      <a href="${postUrl}">${thumb ? `<img src="${thumb}" alt="${title}" class="hero-img">` : ''}</a>
      <div class="hero-text">
        ${displayLabel ? `<span class="hero-label">${displayLabel}</span>` : ''}
        <h1 class="hero-title"><a href="${postUrl}">${title}</a></h1>
        <p class="hero-meta"><span class="hero-date">${postDate}</span></p>
        <p class="hero-desc">${snippet}</p>
      </div>
    </article>`;
}

// 2. News Column
function renderNewsPosts(json) {
  const container = document.getElementById('news-column-container');
  if (!container || !json.feed.entry) return;
  let html = '<div class="news-column">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    const url = post.link.find(l => l.rel === 'alternate')?.href || '#';
    const label = post.category?.find(c => c.term !== 'recent news')?.term || '';
    const date = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumb = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s400/') : '';
    html += `
      <article class="news-small">
        <a href="${url}">${thumb ? `<img src="${thumb}" alt="${title}" class="news-small-img">` : ''}</a>
        <div class="news-small-text">
          ${label ? `<span class="news-small-label">${label}</span>` : ''}
          <h3 class="news-small-title"><a href="${url}">${title}</a></h3>
          <p class="news-small-date">${date}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// 3. Legal Guide
function renderLegalGuidePosts(json) {
  const container = document.getElementById('guide-grid-container');
  if (!container || !json.feed.entry) return;
  let html = '<div class="guide-grid">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    const url = post.link.find(l => l.rel === 'alternate')?.href || '#';
    const label = post.category?.find(c => c.term.toLowerCase() !== 'legal guide')?.term || 'Legal Guide';
    const date = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    html += `
      <article class="guide-block">
        <a href="${url}">
          <div class="guide-meta-top">
            <span class="guide-label">${label}</span>
            <time class="guide-date">${date}</time>
          </div>
          <h3 class="guide-heading">${title}</h3>
        </a>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// 4. Three Cards
function renderThreeCardsPosts(json) {
  const container = document.getElementById('three-cards-container');
  if (!container || !json.feed.entry) return;
  let html = '<div class="three-cards">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    const url = post.link.find(l => l.rel === 'alternate')?.href || '#';
    const label = post.category?.find(c => c.term.toLowerCase() !== 'litigation')?.term || '';
    const date = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumb = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s600/') : '';
    html += `
      <article class="card-item">
        <a href="${url}">${thumb ? `<img src="${thumb}" alt="${title}" class="card-img">` : ''}</a>
        <div class="card-body">
          ${label ? `<span class="card-label">${label}</span>` : ''}
          <h3 class="card-title"><a href="${url}">${title}</a></h3>
          <p class="card-date">${date}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// 5. Второй пост с меткой featured
function renderSecondFeaturedPost(json) {
  const container = document.getElementById('bottom-hero-container');
  if (!container || !json.feed.entry?.[1]) return;
  const post = json.feed.entry[1];
  const title = post.title.$t;
  const snippet = post.summary ? truncate(post.summary.$t, 220) : '';
  const url = post.link.find(l => l.rel === 'alternate')?.href || '#';
  const label = post.category?.find(c => c.term.toLowerCase() !== 'featured')?.term || '';
  const date = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const thumb = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s1600/') : '';

  container.innerHTML = `
    <article class="bottom-hero">
      <a href="${url}">${thumb ? `<img src="${thumb}" class="bottom-hero-img" alt="${title}">` : ''}</a>
      <div class="bottom-hero-text">
        <h2 class="bottom-hero-title"><a href="${url}">${title}</a></h2>
        <p class="bottom-hero-meta">
          ${label ? `<span class="bottom-hero-label">${label}</span>` : ''}
          <span class="bottom-hero-date">${date}</span>
        </p>
        <p class="bottom-hero-desc">${snippet}</p>
      </div>
    </article>`;
}

// 6. Bottom Grid
function renderBottomGridPosts(json) {
  const container = document.getElementById('bottom-grid-container');
  if (!container || !json.feed.entry) return;
  let html = '<div class="bottom-grid">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    const url = post.link.find(l => l.rel === 'alternate')?.href || '#';
    const label = post.category?.find(c => c.term.toLowerCase() !== 'articles')?.term || '';
    const date = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumb = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s600/') : '';
    html += `
      <article class="bottom-card">
        <a href="${url}">${thumb ? `<img src="${thumb}" class="bottom-card-img" alt="${title}">` : ''}</a>
        <div class="bottom-card-body">
          ${label ? `<span class="bottom-card-label">${label}</span>` : ''}
          <h3 class="bottom-card-title"><a href="${url}">${title}</a></h3>
          <p class="bottom-card-date">${date}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// ===========================================
// Запуск всех запросов сразу (без ожидания DOMContentLoaded)
// ===========================================
[
  { url: '/feeds/posts/default/-/featured?alt=json-in-script&max-results=1&callback=renderHeroPost' },
  { url: '/feeds/posts/default/-/recent%20news?alt=json-in-script&max-results=4&callback=renderNewsPosts' },
  { url: '/feeds/posts/default/-/legal%20guide?alt=json-in-script&max-results=4&callback=renderLegalGuidePosts' },
  { url: '/feeds/posts/default/-/litigation?alt=json-in-script&max-results=3&callback=renderThreeCardsPosts' },
  { url: '/feeds/posts/default/-/featured?alt=json-in-script&max-results=2&callback=renderSecondFeaturedPost' },
  { url: '/feeds/posts/default/-/articles?alt=json-in-script&max-results=4&callback=renderBottomGridPosts' }
].forEach(item => {
  const s = document.createElement('script');
  s.src = item.url;
  document.head.appendChild(s);
});
