// Admin Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin functionality
    initAdmin();
    
    // Form submission
    document.getElementById('blog-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveBlogPost('published');
    });
    
    // Save as draft
    document.getElementById('save-draft').addEventListener('click', function() {
        saveBlogPost('draft');
    });
    
    // Image preview
    document.getElementById('blog-image').addEventListener('change', function(e) {
        previewImage(e.target.files[0]);
    });
});

function initAdmin() {
    updateStats();
    loadRecentPosts();
    loadPostsTable();
}

function saveBlogPost(status) {
    const title = document.getElementById('blog-title').value;
    const excerpt = document.getElementById('blog-excerpt').value;
    const content = document.getElementById('blog-content').value;
    const category = document.getElementById('blog-category').value;
    const author = document.getElementById('blog-author').value;
    const imageFile = document.getElementById('blog-image').files[0];
    const video = document.getElementById('blog-video').value;
    
    if (!title || !excerpt || !content || !category || !author) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create blog post object
    const blogPost = {
        id: Date.now().toString(),
        title: title,
        excerpt: excerpt,
        content: content,
        category: category,
        author: author,
        video: video,
        status: status,
        date: new Date().toISOString()
    };
    
    // Handle image
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            blogPost.image = e.target.result;
            savePostToStorage(blogPost);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePostToStorage(blogPost);
    }
}

function savePostToStorage(blogPost) {
    const posts = getPostsFromStorage();
    posts.push(blogPost);
    localStorage.setItem('ncc_blog_posts', JSON.stringify(posts));
    
    // Reset form
    document.getElementById('blog-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    // Update UI
    updateStats();
    loadRecentPosts();
    loadPostsTable();
    
    // Show success message
    showAlert(`Post ${blogPost.status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
}

function previewImage(file) {
    const preview = document.getElementById('image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="img-fluid">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p class="text-muted">No image selected</p>';
    }
}

function updateStats() {
    const posts = getPostsFromStorage();
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.status === 'published').length;
    const draftPosts = posts.filter(post => post.status === 'draft').length;
    
    document.getElementById('total-posts').textContent = totalPosts;
    document.getElementById('published-posts').textContent = publishedPosts;
    document.getElementById('draft-posts').textContent = draftPosts;
}

function loadRecentPosts() {
    const recentPostsContainer = document.getElementById('recent-posts-list');
    const posts = getPostsFromStorage()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (posts.length === 0) {
        recentPostsContainer.innerHTML = '<p class="text-muted">No posts yet</p>';
        return;
    }
    
    let recentPostsHTML = '';
    posts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        recentPostsHTML += `
            <div class="recent-post-item">
                <div class="recent-post-thumb">
                    <img src="${post.image || 'https://images.pexels.com/photos/26100274/pexels-photo-26100274.jpeg'}" alt="${post.title}">
                </div>
                <div class="recent-post-info">
                    <h5>${post.title.substring(0, 30)}${post.title.length > 30 ? '...' : ''}</h5>
                    <p>${postDate} • <span class="status-${post.status}">${post.status}</span></p>
                </div>
            </div>
        `;
    });
    
    recentPostsContainer.innerHTML = recentPostsHTML;
}

function loadPostsTable() {
    const tableBody = document.getElementById('posts-table-body');
    const posts = getPostsFromStorage()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (posts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="fas fa-newspaper fa-2x mb-3"></i>
                    <p>No blog posts yet. Create your first post above!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let tableHTML = '';
    posts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        tableHTML += `
            <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.author}</td>
                <td>${postDate}</td>
                <td>
                    <span class="status-badge status-${post.status}">
                        ${post.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-action" onclick="editPost('${post.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action" onclick="deletePost('${post.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info btn-action" onclick="viewPost('${post.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

function editPost(postId) {
    const posts = getPostsFromStorage();
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Fill form with post data
    document.getElementById('blog-title').value = post.title;
    document.getElementById('blog-excerpt').value = post.excerpt;
    document.getElementById('blog-content').value = post.content;
    document.getElementById('blog-category').value = post.category;
    document.getElementById('blog-author').value = post.author;
    document.getElementById('blog-video').value = post.video || '';
    
    // Show image preview if exists
    if (post.image) {
        document.getElementById('image-preview').innerHTML = `<img src="${post.image}" alt="Preview" class="img-fluid">`;
    }
    
    // Remove the post from storage (will be re-added when saved)
    const updatedPosts = posts.filter(p => p.id !== postId);
    localStorage.setItem('ncc_blog_posts', JSON.stringify(updatedPosts));
    
    // Scroll to form
    document.getElementById('blog-title').scrollIntoView({ behavior: 'smooth' });
    
    showAlert('Post loaded for editing. Make your changes and save.', 'info');
}

function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const posts = getPostsFromStorage();
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('ncc_blog_posts', JSON.stringify(updatedPosts));
    
    // Update UI
    updateStats();
    loadRecentPosts();
    loadPostsTable();
    
    showAlert('Post deleted successfully!', 'success');
}

function viewPost(postId) {
    window.open(`blog-post.html?id=${postId}`, '_blank');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Utility function to get posts from localStorage
function getPostsFromStorage() {
    const postsJSON = localStorage.getItem('ncc_blog_posts');
    return postsJSON ? JSON.parse(postsJSON) : [];
}