/**
 * F.Y.I. (For Your Information) - Core Client Engine
 * Handles theme toggling (light/dark), mobile drawer, reading progress, and automated post registry rendering.
 */

(function () {
  'use strict';

  // 1. Theme Management (Light & Dark Mode)
  function initTheme() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('fyi_theme', theme);
      toggleBtns.forEach((btn) => {
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme);

    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = active === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });

    // Listen for OS system theme changes if user hasn't explicitly set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('fyi_theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  initTheme();

  // 2. Mobile Menu Drawer
  const menuButton = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (menuButton && sidebar) {
    menuButton.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Reading Progress Bar on Article Pages
  const article = document.querySelector('.post');
  if (article) {
    let progressBar = document.getElementById('reading-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'reading-progress';
      document.body.prepend(progressBar);
    }
    window.addEventListener(
      'scroll',
      () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
          progressBar.style.width = `${progress}%`;
        }
      },
      { passive: true }
    );

    // Initialize In-Browser Audio Mode & Share Toolbar
    initArticleToolbar(article);
  }

  /**
   * In-Browser Audio Player (SpeechSynthesis) & Share Controls
   */
  function initArticleToolbar(postEl) {
    let toolbar = postEl.querySelector('.article-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'article-toolbar';
      const leadEl = postEl.querySelector('.lead');
      if (leadEl) {
        leadEl.parentNode.insertBefore(toolbar, leadEl);
      } else {
        const h1 = postEl.querySelector('h1');
        if (h1) h1.after(toolbar);
        else postEl.prepend(toolbar);
      }
    }

    toolbar.innerHTML = `
      <div class="audio-group" id="audio-group">
        <button class="audio-play-btn" id="audio-play-btn" aria-label="Listen to this note">
          <svg class="icon-play" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <svg class="icon-pause" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span id="audio-label">Listen</span>
        </button>
        <div class="audio-controls" id="audio-controls">
          <button class="audio-speed-btn" id="audio-speed-btn" title="Playback speed">1.0x</button>
          <button class="audio-stop-btn" id="audio-stop-btn" title="Stop audio" aria-label="Stop audio">
            <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"></rect></svg>
          </button>
          <span class="audio-status" id="audio-status">Playing...</span>
        </div>
      </div>
      <div class="share-group">
        <button class="share-btn" id="share-copy-btn" title="Copy link" aria-label="Share note">
          <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          <span>Share</span>
        </button>
        <a class="share-icon-btn" id="share-x-btn" target="_blank" rel="noopener" title="Share on X" aria-label="Share on X">
          <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        </a>
        <a class="share-icon-btn" id="share-li-btn" target="_blank" rel="noopener" title="Share on LinkedIn" aria-label="Share on LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <div class="share-toast" id="share-toast">Link copied!</div>
      </div>
    `;

    // 1. Share handlers
    const shareBtn = toolbar.querySelector('#share-copy-btn');
    const shareX = toolbar.querySelector('#share-x-btn');
    const shareLi = toolbar.querySelector('#share-li-btn');
    const shareToast = toolbar.querySelector('#share-toast');

    const pageUrl = window.location.href;
    const pageTitle = document.title.split('—')[0].trim();

    shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
    shareLi.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

    function showCopiedToast() {
      shareToast.classList.add('show');
      setTimeout(() => shareToast.classList.remove('show'), 2200);
    }

    shareBtn.addEventListener('click', () => {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        navigator
          .share({ title: pageTitle, url: pageUrl })
          .catch(() => copyToClipboard(pageUrl, showCopiedToast));
      } else {
        copyToClipboard(pageUrl, showCopiedToast);
      }
    });

    function copyToClipboard(text, onSuccess) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
      } else {
        fallbackCopy(text, onSuccess);
      }
    }

    function fallbackCopy(text, onSuccess) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        onSuccess();
      } catch (e) {
        console.warn('Copy fallback failed', e);
      }
      document.body.removeChild(textarea);
    }

    // 2. Audio Mode (SpeechSynthesis)
    const audioGroup = toolbar.querySelector('#audio-group');
    if (!('speechSynthesis' in window)) {
      audioGroup.style.display = 'none';
      return;
    }

    const playBtn = toolbar.querySelector('#audio-play-btn');
    const labelEl = toolbar.querySelector('#audio-label');
    const speedBtn = toolbar.querySelector('#audio-speed-btn');
    const stopBtn = toolbar.querySelector('#audio-stop-btn');
    const statusEl = toolbar.querySelector('#audio-status');

    // Extract read time from meta if present
    const metaEl = postEl.querySelector('.card-meta');
    if (metaEl) {
      const match = metaEl.textContent.match(/(\d+\s*min)/);
      if (match) {
        labelEl.textContent = `Listen (${match[1]})`;
      }
    }

    // Extract sentences from content
    const textNodes = postEl.querySelectorAll('p, h2, li');
    const sentences = [];
    textNodes.forEach((node) => {
      if (node.closest('.sources') || node.closest('.post-diagram') || node.closest('.data-table') || node.closest('.code-block') || node.closest('.article-toolbar')) {
        return;
      }
      const raw = node.textContent.replace(/\s+/g, ' ').trim();
      if (!raw) return;
      const chunks = raw.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
      if (chunks) {
        chunks.forEach((c) => {
          const s = c.trim();
          if (s.length > 2) sentences.push(s);
        });
      }
    });

    let state = 'idle'; // 'idle' | 'playing' | 'paused'
    let sentenceIdx = 0;
    const speeds = [1.0, 1.25, 1.5, 0.8];
    let speedIdx = 0;

    function getRate() {
      return speeds[speedIdx];
    }

    function speakNext() {
      if (sentenceIdx >= sentences.length) {
        stopAudio();
        return;
      }
      if (state !== 'playing') return;

      const utterance = new SpeechSynthesisUtterance(sentences[sentenceIdx]);
      utterance.rate = getRate();
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (state === 'playing') {
          sentenceIdx++;
          updateStatus();
          speakNext();
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech error:', e);
          sentenceIdx++;
          speakNext();
        }
      };

      window.speechSynthesis.speak(utterance);
      updateStatus();
    }

    function updateStatus() {
      statusEl.textContent = `Playing ${sentenceIdx + 1}/${sentences.length}`;
    }

    function startAudio() {
      window.speechSynthesis.cancel();
      state = 'playing';
      audioGroup.classList.add('active');
      playBtn.classList.add('is-playing');
      labelEl.textContent = 'Pause';
      speakNext();
    }

    function pauseAudio() {
      state = 'paused';
      window.speechSynthesis.cancel();
      playBtn.classList.remove('is-playing');
      labelEl.textContent = 'Resume';
      statusEl.textContent = 'Paused';
    }

    function resumeAudio() {
      state = 'playing';
      playBtn.classList.add('is-playing');
      labelEl.textContent = 'Pause';
      speakNext();
    }

    function stopAudio() {
      state = 'idle';
      sentenceIdx = 0;
      window.speechSynthesis.cancel();
      audioGroup.classList.remove('active');
      playBtn.classList.remove('is-playing');
      if (metaEl) {
        const match = metaEl.textContent.match(/(\d+\s*min)/);
        labelEl.textContent = match ? `Listen (${match[1]})` : 'Listen';
      } else {
        labelEl.textContent = 'Listen';
      }
    }

    playBtn.addEventListener('click', () => {
      if (state === 'idle') {
        startAudio();
      } else if (state === 'playing') {
        pauseAudio();
      } else if (state === 'paused') {
        resumeAudio();
      }
    });

    stopBtn.addEventListener('click', () => {
      stopAudio();
    });

    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      const rate = getRate();
      speedBtn.textContent = `${rate}x`;
      if (state === 'playing') {
        window.speechSynthesis.cancel();
        speakNext();
      }
    });

    window.addEventListener('beforeunload', () => {
      window.speechSynthesis.cancel();
    });
  }

  // 4. Centralized Post Registry Auto-Loader
  const isPostPage = window.location.pathname.includes('/posts/');
  const basePath = isPostPage ? '../' : './';
  const postsJsonUrl = `${basePath}posts.json`;

  fetch(postsJsonUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((posts) => {
      if (!Array.isArray(posts)) return;

      renderSidebarCategories(posts, isPostPage, basePath);
      renderHomepageFeed(posts, basePath);
    })
    .catch((err) => {
      console.info('Using static fallback for posts:', err.message);
    });

  /**
   * Render consistent category links in sidebar across all pages
   */
  function renderSidebarCategories(posts, isPostPage, basePath) {
    const navSections = document.getElementById('nav-sections');
    if (!navSections) return;

    // Group posts by category
    const categoryMap = new Map();
    posts.forEach((post) => {
      const cat = post.category || 'General';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat).push(post);
    });

    const currentPath = window.location.pathname;

    let html = '';
    categoryMap.forEach((catPosts, category) => {
      const count = catPosts.length;
      const targetPost = catPosts[0];
      const postUrl = isPostPage ? `${targetPost.slug}.html` : `${basePath}${targetPost.url}`;
      const isActive = catPosts.some((p) => currentPath.endsWith(p.slug + '.html') || currentPath.endsWith(p.url));

      html += `
        <a class="nav-link ${isActive ? 'active' : ''}" href="${postUrl}">
          <span>${escapeHtml(category)}</span>
          <span class="nav-count" title="${count} note${count > 1 ? 's' : ''}">${count}</span>
        </a>
      `;
    });

    navSections.innerHTML = html;
  }

  /**
   * Automatically render latest note & archive list on index.html
   */
  function renderHomepageFeed(posts, basePath) {
    const latestContainer = document.getElementById('latest-note-container');
    const recentContainer = document.getElementById('recent-notes-container');
    const filterContainer = document.getElementById('category-filters');

    if (!latestContainer || !recentContainer) return;

    const sortedPosts = [...posts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    const latestPost = sortedPosts[0];
    const recentPosts = sortedPosts.slice(1);

    // 1. Render Latest Note
    if (latestPost) {
      latestContainer.innerHTML = `
        <article class="featured-card">
          <div class="card-meta">
            <span>${escapeHtml(latestPost.category)}</span>
            <span>${escapeHtml(latestPost.readTime || '5 min read')}</span>
          </div>
          <h3><a href="${basePath}${latestPost.url}">${escapeHtml(latestPost.title)}</a></h3>
          <p>${escapeHtml(latestPost.excerpt)}</p>
          <a class="text-link" href="${basePath}${latestPost.url}">
            Read the note <span aria-hidden="true">&rarr;</span>
          </a>
        </article>
      `;
    }

    // 2. Render Filter Pills
    const categories = ['All', ...new Set(posts.map((p) => p.category))];
    if (filterContainer && categories.length > 2) {
      filterContainer.innerHTML = categories
        .map(
          (cat, idx) =>
            `<button class="pill-btn ${idx === 0 ? 'active' : ''}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
        )
        .join('');

      filterContainer.querySelectorAll('.pill-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const selected = btn.getAttribute('data-category');
          renderRecentList(selected);
        });
      });
    }

    // 3. Render Recent Notes List
    function renderRecentList(categoryFilter = 'All') {
      const filtered = recentPosts.filter((p) => categoryFilter === 'All' || p.category === categoryFilter);

      if (filtered.length === 0) {
        recentContainer.innerHTML = `
          <div class="empty-state">
            <p>No notes in this category yet. New notes arrive when there is something worth understanding.</p>
          </div>
        `;
        return;
      }

      recentContainer.innerHTML = filtered
        .map(
          (post) => `
        <article class="featured-card">
          <div class="card-meta">
            <span>${escapeHtml(post.category)}</span>
            <span>${escapeHtml(post.readTime || '5 min read')}</span>
          </div>
          <h3><a href="${basePath}${post.url}">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <a class="text-link" href="${basePath}${post.url}">
            Read the note <span aria-hidden="true">&rarr;</span>
          </a>
        </article>
      `
        )
        .join('');
    }

    renderRecentList();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
