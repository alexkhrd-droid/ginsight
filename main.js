
// Утилита: обрезка текста с удалением тегов
function truncate(text, limit) {
  if (!text) return '';
  text = text.replace(/<[^>]+>/g, '');
  return text.length > limit ? text.substring(0, limit) + '…' : text;
}

// 1. Главный пост (Hero Post) — метка "featured", первый пост
function renderHeroPost(json) {
  const container = document.getElementById('hero-main-container');
  if (!container) return console.error('Контейнер hero-main-container не найден!');

  if (!json.feed.entry || json.feed.entry.length === 0) {
    container.innerHTML = '<p>Избранные посты не найдены.</p>';
    return;
  }

  const post = json.feed.entry[0];
  const title = post.title.$t;
  const snippet = post.summary ? truncate(post.summary.$t, 120) : '';

  let postUrl = '';
  for (let i = 0; i < post.link.length; i++) {
    if (post.link[i].rel === 'alternate') {
      postUrl = post.link[i].href; break;
    }
  }

  let displayLabel = '';
  if (post.category) {
    for (let i = 0; i < post.category.length; i++) {
      if (post.category[i].term !== 'featured') {
        displayLabel = post.category[i].term; break;
      }
    }
  }

  const postDate = new Date(post.published.$t).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s1600/') : '';

  const html = `
    <article class="hero-main">
      <a href="${postUrl}">
        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${title}" class="hero-img">` : ''}
      </a>
      <div class="hero-text">
        ${displayLabel ? `<span class="hero-label">${displayLabel}</span>` : ''}
        <h1 class="hero-title"><a href="${postUrl}">${title}</a></h1>
        <p class="hero-meta"><span class="hero-date">${postDate}</span></p>
        <p class="hero-desc">${snippet}</p>
      </div>
    </article>`;

  container.innerHTML = html;
}

// 2. Колонка новостей — метка "recent news"
function renderNewsPosts(json) {
  const container = document.getElementById('news-column-container');
  if (!container) return;

  if (!json.feed.entry || json.feed.entry.length === 0) return;

  let html = '<div class="news-column">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    let postUrl = '';
    for (let i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') { postUrl = post.link[i].href; break; }
    }

    let displayLabel = '';
    if (post.category) {
      for (let i = 0; i < post.category.length; i++) {
        if (post.category[i].term !== 'recent news') {
          displayLabel = post.category[i].term; break;
        }
      }
    }

    const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s400/') : '';

    html += `
      <article class="news-small">
        <a href="${postUrl}">
          ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${title}" class="news-small-img"/>` : ''}
        </a>
        <div class="news-small-text">
          ${displayLabel ? `<span class="news-small-label">${displayLabel}</span>` : ''}
          <h3 class="news-small-title"><a href="${postUrl}">${title}</a></h3>
          <p class="news-small-date">${postDate}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
});

// 3. Legal Guide — метка "legal guide"
function renderLegalGuidePosts(json) {
  const container = document.getElementById('guide-grid-container');
  if (!container) return;

  if (!json.feed.entry || json.feed.entry.length === 0) return;

  let html = '<div class="guide-grid">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    let postUrl = '';
    for (let i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') { postUrl = post.link[i].href; break; }
    }

    let displayLabel = 'Legal Guide';
    if (post.category) {
      for (let i = 0; i < post.category.length; i++) {
        if (post.category[i].term.toLowerCase() !== 'legal guide') {
          displayLabel = post.category[i].term; break;
        }
      }
    }

    const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s1600/') : '';

    html += `
      <article class="guide-block">
        <a href="${postUrl}">
          <div class="guide-meta-top">
            <span class="guide-label">${displayLabel}</span>
            <time class="guide-date">${postDate}</time>
          </div>
          <h3 class="guide-heading">${title}</h3>
        </a>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// 4. Three Cards — метка "litigation"
function renderThreeCardsPosts(json) {
  const container = document.getElementById('three-cards-container');
  if (!container) return;

  if (!json.feed.entry || json.feed.entry.length === 0) return;

  let html = '<div class="three-cards">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    let postUrl = '';
    for (let i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') { postUrl = post.link[i].href; break; }
    }

    let displayLabel = '';
    if (post.category) {
      for (let i = 0; i < post.category.length; i++) {
        if (post.category[i].term.toLowerCase() !== 'litigation') {
          displayLabel = post.category[i].term; break;
        }
      }
    }

    const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s600/') : '';

    html += `
      <article class="card-item">
        <a href="${postUrl}">
          ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${title}" class="card-img"/>` : ''}
        </a>
        <div class="card-body">
          ${displayLabel ? `<span class="card-label">${displayLabel}</span>` : ''}
          <h3 class="card-title"><a href="${postUrl}">${title}</a></h3>
          <p class="card-date">${postDate}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// 5. Второй избранный пост (bottom-hero) — берём второй пост с меткой "featured"
function renderSecondFeaturedPost(json) {
  const container = document.getElementById('bottom-hero-container');
  if (!container) return;

  if (!json.feed.entry || json.feed.entry.length < 2) return;

  const post = json.feed.entry[1];
  const title = post.title.$t;
  const snippet = post.summary ? truncate(post.summary.$t, 220) : '';

  let postUrl = '';
  for (let i = 0; i < post.link.length; i++) {
    if (post.link[i].rel === 'alternate') { postUrl = post.link[i].href; break; }
  }

  let displayLabel = '';
  if (post.category) {
    for (let i = 0; i < post.category.length; i++) {
      if (post.category[i].term.toLowerCase() !== 'featured') {
        displayLabel = post.category[i].term; break;
      }
    }
  }

  const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s1600/') : '';

  const html = `
    <article class="bottom-hero">
      <a href="${postUrl}">
        ${thumbnailUrl ? `<img src="${thumbnailUrl}" class="bottom-hero-img" alt="${title}"/>` : ''}
      </a>
      <div class="bottom-hero-text">
        <h2 class="bottom-hero-title"><a href="${postUrl}">${title}</a></h2>
        <p class="bottom-hero-meta">
          ${displayLabel ? `<span class="bottom-hero-label">${displayLabel}</span>` : ''}
          <span class="bottom-hero-date">${postDate}</span>
        </p>
        <p class="bottom-hero-desc">${snippet}</p>
      </div>
    </article>`;

  container.innerHTML = html;
}

// 6. Нижняя сетка — метка "articles"
function renderBottomGridPosts(json) {
  const container = document.getElementById('bottom-grid-container');
  if (!container) return;

  if (!json.feed.entry || json.feed.entry.length === 0) return;

  let html = '<div class="bottom-grid">';
  json.feed.entry.forEach(post => {
    const title = post.title.$t;
    let postUrl = '';
    for (let i = 0; i < post.link.length; i++) {
      if (post.link[i].rel === 'alternate') { postUrl = post.link[i].href; break; }
    }

    let displayLabel = '';
    if (post.category) {
      for (let i = 0; i < post.category.length; i++) {
        if (post.category[i].term.toLowerCase() !== 'articles') {
          displayLabel = post.category[i].term; break;
        }
      }
    }

    const postDate = new Date(post.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumbnailUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('/s72-c/', '/s600/') : '';

    html += `
      <article class="bottom-card">
        <a href="${postUrl}">
          ${thumbnailUrl ? `<img src="${thumbnailUrl}" class="bottom-card-img" alt="${title}"/>` : ''}
        </a>
        <div class="bottom-card-body">
          ${displayLabel ? `<span class="bottom-card-label">${displayLabel}</span>` : ''}
          <h3 class="bottom-card-title"><a href="${postUrl}">${title}</a></h3>
          <p class="bottom-card-date">${postDate}</p>
        </div>
      </article>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// =============================================
// Автозапуск всех блоков только на главных страницах
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  // Защищаем от запуска на страницах отдельных постов
  if (document.body.classList.contains('item') || document.body.classList.contains('static_page')) return;

  // 1. Hero Post
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/featured?alt=json-in-script&max-results=1&callback=renderHeroPost';
    document.head.appendChild(s);
  })();

  // 2. News Column
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/recent%20news?alt=json-in-script&max-results=4&callback=renderNewsPosts';
    document.head.appendChild(s);
  })();

  // 3. Legal Guide
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/legal%20guide?alt=json-in-script&max-results=4&callback=renderLegalGuidePosts';
    document.head.appendChild(s);
  })();

  // 4. Three Cards (litigation)
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/litigation?alt=json-in-script&max-results=3&callback=renderThreeCardsPosts';
    document.head.appendChild(s);
  })();

  // 5. Второй избранный пост
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/featured?alt=json-in-script&max-results=2&callback=renderSecondFeaturedPost';
    document.head.appendChild(s);
  })();

  // 6. Bottom Grid (articles)
  (function () {
    const s = document.createElement('script');
    s.src = '/feeds/posts/default/-/articles?alt=json-in-script&max-results=4&callback=renderBottomGridPosts';
    document.head.appendChild(s);
  })();
});
 
