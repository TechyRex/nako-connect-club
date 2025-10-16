// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlog();
    
    // Load more posts functionality
    document.getElementById('load-more-btn').addEventListener('click', loadMorePosts);
});

let currentPage = 1;
const postsPerPage = 6;

function initBlog() {
    loadBlogPosts();
    loadCategories();
    loadRecentPosts();
}

function loadBlogPosts(page = 1) {
    const postsContainer = document.getElementById('blog-posts-container');
    
    // Show loading state
    postsContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">Loading posts...</p></div>';
    
    // Get posts from localStorage
    const posts = getPostsFromStorage();
    const publishedPosts = posts.filter(post => post.status === 'published');
    
    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = publishedPosts.slice(startIndex, endIndex);
    
    // Update current page
    currentPage = page;
    
    // Hide load more button if no more posts
    if (endIndex >= publishedPosts.length) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
    
    // Render posts
    if (postsToShow.length === 0 && page === 1) {
        postsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h3>No Blog Posts Yet</h3>
                <p class="text-muted">Check back later for updates from Nako Connect Club.</p>
            </div>
        `;
        return;
    }
    
    let postsHTML = page === 1 ? '' : postsContainer.innerHTML;
    
    postsToShow.forEach(post => {
        postsHTML += createBlogPostHTML(post);
    });
    
    postsContainer.innerHTML = postsHTML;
}

function loadMorePosts() {
    loadBlogPosts(currentPage + 1);
}

function createBlogPostHTML(post) {
    const postDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="blog-post">
            <div class="blog-post-image">
                <img src="${post.image || 'https://images.pexels.com/photos/26100274/pexels-photo-26100274.jpeg'}" alt="${post.title}">
                <div class="blog-post-category">${post.category}</div>
            </div>
            <div class="blog-post-content">
                <div class="blog-post-meta">
                    <span class="author">By ${post.author}</span>
                    <span class="date">${postDate}</span>
                </div>
                <h3><a href="blog-post.html?id=${post.id}">${post.title}</a></h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <a href="blog-post.html?id=${post.id}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

function loadCategories() {
    const categoriesContainer = document.getElementById('category-list');
    const posts = getPostsFromStorage();
    const publishedPosts = posts.filter(post => post.status === 'published');
    
    // Count posts by category
    const categoryCounts = {};
    publishedPosts.forEach(post => {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });
    
    let categoriesHTML = '';
    for (const [category, count] of Object.entries(categoryCounts)) {
        categoriesHTML += `
            <li>
                <a href="#" data-category="${category}">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                    <span class="category-count">${count}</span>
                </a>
            </li>
        `;
    }
    
    categoriesContainer.innerHTML = categoriesHTML;
    
    // Add event listeners for category filtering
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterPostsByCategory(category);
        });
    });
}

function filterPostsByCategory(category) {
    const posts = getPostsFromStorage();
    const publishedPosts = posts.filter(post => post.status === 'published' && post.category === category);
    
    const postsContainer = document.getElementById('blog-posts-container');
    
    if (publishedPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No Posts Found</h3>
                <p class="text-muted">No posts found in the ${category} category.</p>
            </div>
        `;
        document.getElementById('load-more-btn').style.display = 'none';
        return;
    }
    
    let postsHTML = '';
    publishedPosts.forEach(post => {
        postsHTML += createBlogPostHTML(post);
    });
    
    postsContainer.innerHTML = postsHTML;
    document.getElementById('load-more-btn').style.display = 'none';
}

function loadRecentPosts() {
    const recentPostsContainer = document.getElementById('recent-posts');
    const posts = getPostsFromStorage();
    const publishedPosts = posts.filter(post => post.status === 'published')
                               .sort((a, b) => new Date(b.date) - new Date(a.date))
                               .slice(0, 5);
    
    if (publishedPosts.length === 0) {
        recentPostsContainer.innerHTML = '<p class="text-muted">No recent posts</p>';
        return;
    }
    
    let recentPostsHTML = '';
    publishedPosts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        recentPostsHTML += `
            <div class="recent-post">
                <div class="recent-post-image">
                    <img src="${post.image || 'https://images.pexels.com/photos/26100274/pexels-photo-26100274.jpeg'}" alt="${post.title}">
                </div>
                <div class="recent-post-content">
                    <h4><a href="blog-post.html?id=${post.id}">${post.title.substring(0, 50)}${post.title.length > 50 ? '...' : ''}</a></h4>
                    <div class="recent-post-date">${postDate}</div>
                </div>
            </div>
        `;
    });
    
    recentPostsContainer.innerHTML = recentPostsHTML;
}

// Utility function to get posts from localStorage
function getPostsFromStorage() {
    const postsJSON = localStorage.getItem('ncc_blog_posts');
    return postsJSON ? JSON.parse(postsJSON) : [];
}