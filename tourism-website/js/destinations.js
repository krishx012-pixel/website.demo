// ============================================================
//  DESTINATIONS.JS — Filter, Search & Category Logic
// ============================================================

const destinations = [
  {
    id: 1, name: 'Rishikesh', location: 'Uttarakhand, India',
    category: 'adventure', rating: 5,
    desc: 'The adventure capital of India — bungee jumping, river rafting, and yoga on the Ganges.',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
  },
  {
    id: 2, name: 'Manali', location: 'Himachal Pradesh, India',
    category: 'adventure', rating: 5,
    desc: 'Snow-capped peaks, trekking trails, and the iconic Rohtang Pass.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80'
  },
  {
    id: 3, name: 'Wayanad', location: 'Kerala, India',
    category: 'nature', rating: 4,
    desc: 'Lush greenery, mist-covered hills, and pristine waterfalls deep in Kerala.',
    img: 'https://images.unsplash.com/photo-1594135824961-109f94f7d5e5?w=600&q=80'
  },
  {
    id: 4, name: 'Coorg', location: 'Karnataka, India',
    category: 'nature', rating: 4,
    desc: 'Coffee plantations, dense forests, and the scenic Abbey Falls.',
    img: 'https://images.unsplash.com/photo-1529514569979-ea6862ce2fa4?w=600&q=80'
  },
  {
    id: 5, name: 'Jim Corbett', location: 'Uttarakhand, India',
    category: 'wildlife', rating: 5,
    desc: "India's oldest national park — home to Bengal tigers and over 500 bird species.",
    img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80'
  },
  {
    id: 6, name: 'Ranthambore', location: 'Rajasthan, India',
    category: 'wildlife', rating: 4,
    desc: 'Famous tiger reserve set against the dramatic ruins of Ranthambore Fort.',
    img: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&q=80'
  },
  {
    id: 7, name: 'Goa Beaches', location: 'Goa, India',
    category: 'beach', rating: 5,
    desc: 'Golden sands, turquoise waters, vibrant nightlife, and fresh seafood.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'
  },
  {
    id: 8, name: 'Andaman Islands', location: 'Andaman & Nicobar',
    category: 'beach', rating: 5,
    desc: 'Crystal-clear waters, coral reefs, and pristine untouched beaches.',
    img: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=600&q=80'
  },
  {
    id: 9, name: 'Hampi', location: 'Karnataka, India',
    category: 'cultural', rating: 5,
    desc: 'Ancient ruins of the Vijayanagara Empire — a UNESCO World Heritage Site.',
    img: 'https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=600&q=80'
  },
  {
    id: 10, name: 'Varanasi', location: 'Uttar Pradesh, India',
    category: 'cultural', rating: 4,
    desc: "One of the world's oldest cities — temples, ghats, and Ganga Aarti.",
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f396?w=600&q=80'
  },
  {
    id: 11, name: 'Darjeeling', location: 'West Bengal, India',
    category: 'hills', rating: 4,
    desc: 'Tea gardens, toy train rides, and stunning views of Kanchenjunga.',
    img: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=600&q=80'
  },
  {
    id: 12, name: 'Ooty', location: 'Tamil Nadu, India',
    category: 'hills', rating: 4,
    desc: 'Queen of the Nilgiris — rose gardens, tea estates, and mountain air.',
    img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&q=80'
  }
];

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getBadgeClass(cat) {
  const map = { adventure: 'badge-adventure', nature: 'badge-nature', wildlife: 'badge-wildlife',
                beach: 'badge-beach', cultural: 'badge-cultural', hills: 'badge-hills' };
  return map[cat] || 'badge-nature';
}

function getCategoryLabel(cat) {
  const map = { adventure: '🏔️ Adventure', nature: '🌿 Nature', wildlife: '🦁 Wildlife',
                beach: '🏖️ Beach', cultural: '🏛️ Cultural', hills: '⛰️ Hill Station' };
  return map[cat] || cat;
}

function createCard(d) {
  return `
    <div class="col-lg-4 col-md-6 dest-item fade-in" data-category="${d.category}" data-name="${d.name.toLowerCase()}">
      <div class="dest-card">
        <div class="dest-card-img">
          <img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80'">
          <span class="dest-badge ${getBadgeClass(d.category)}">${getCategoryLabel(d.category)}</span>
        </div>
        <div class="dest-card-body">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <h5 class="dest-card-title mb-0">${d.name}</h5>
            <span class="star-rating">${renderStars(d.rating)}</span>
          </div>
          <div class="dest-card-location"><span>📍</span>${d.location}</div>
          <p class="dest-card-desc">${d.desc}</p>
          <a href="#" class="btn-view" onclick="return false;">View More →</a>
        </div>
      </div>
    </div>`;
}

function renderAll(list) {
  const grid    = document.getElementById('destGrid');
  const noRes   = document.getElementById('noResults');
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(createCard).join('') : '';
  if (noRes) noRes.style.display = list.length ? 'none' : 'block';
}

(function initDestinations() {
  if (!document.getElementById('destGrid')) return;

  let activeCategory = 'all';
  let searchQuery    = '';

  renderAll(destinations);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat || 'all';
      applyFilters();
    });
  });

  // Search
  const searchInput = document.getElementById('destSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  function applyFilters() {
    let filtered = destinations;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(d => d.category === activeCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchQuery) ||
        d.location.toLowerCase().includes(searchQuery) ||
        d.desc.toLowerCase().includes(searchQuery)
      );
    }
    renderAll(filtered);
  }
})();

// ============================================================
//  HOME PAGE — Featured Destinations (first 6)
// ============================================================
(function initHomeDest() {
  const grid = document.getElementById('homeFeaturedGrid');
  if (!grid) return;
  const featured = destinations.slice(0, 6);
  grid.innerHTML = featured.map(createCard).join('');
})();

// ============================================================
//  SHARED — Back to Top & Nav Active State
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Back to top
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title = 'Back to Top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Active nav
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Show logged-in user name in navbar if available
  const userData = JSON.parse(localStorage.getItem('tourismLoggedIn') || sessionStorage.getItem('tourismLoggedIn') || 'null');
  const authBtns = document.getElementById('authButtons');
  const userInfo = document.getElementById('userInfo');
  if (userData && authBtns && userInfo) {
    authBtns.style.display = 'none';
    userInfo.style.display = 'flex';
    const nameEl = document.getElementById('navUserName');
    if (nameEl) nameEl.textContent = userData.fullname;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('tourismLoggedIn');
      sessionStorage.removeItem('tourismLoggedIn');
      window.location.reload();
    });
  }
});
