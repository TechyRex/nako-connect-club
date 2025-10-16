// Individual Blog Post JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
        loadBlogPost(postId);
        loadComments(postId);
    } else {
        document.getElementById('blog-post-content').innerHTML = `
            <div class="alert alert-danger">
                <h4>Post Not Found</h4>
                <p>The requested blog post could not be found.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }
    
    // Handle comment form submission
    document.getElementById('comment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addComment(postId);
    });
});

function loadBlogPost(postId) {
    const posts = getPostsFromStorage();
    const post = posts.find(p => p.id === postId && p.status === 'published');
    
    const postContent = document.getElementById('blog-post-content');
    
    if (!post) {
        postContent.innerHTML = `
            <div class="alert alert-danger">
                <h4>Post Not Found</h4>
                <p>The requested blog post could not be found.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
        return;
    }
    
    const postDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let mediaHTML = '';
    if (post.video) {
        mediaHTML = `
            <div class="embed-responsive embed-responsive-16by9 mb-4">
                <iframe class="embed-responsive-item" src="${post.video}" allowfullscreen></iframe>
            </div>
        `;
    } else if (post.image) {
        mediaHTML = `
            <div class="blog-post-featured-image mb-4">
                <img src="${post.image}" alt="${post.title}" class="img-fluid rounded">
            </div>
        `;
    }
    
    postContent.innerHTML = `
        <article class="blog-post-detail">
            <header class="blog-post-header mb-4">
                <div class="post-category mb-3">
                    <span class="badge bg-primary">${post.category}</span>
                </div>
                <h1 class="display-5 mb-3">${post.title}</h1>
                <div class="post-meta d-flex align-items-center mb-4">
                    <div class="author-avatar me-3">
                        <div class="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div>
                        <div class="author-name fw-bold">${post.author}</div>
                        <div class="post-date text-muted">${postDate}</div>
                    </div>
                </div>
            </header>
            
            ${mediaHTML}
            
            <div class="blog-post-body">
                ${formatBlogContent(post.content)}
            </div>
            
            <footer class="blog-post-footer mt-5 pt-4 border-top">
                <div class="post-tags mb-3">
                    <strong>Tags:</strong>
                    <span class="badge bg-secondary me-1">${post.category}</span>
                    <span class="badge bg-secondary me-1">ncc</span>
                    <span class="badge bg-secondary">community</span>
                </div>
                <div class="social-share">
                    <strong>Share this post:</strong>
                    <div class="social-links mt-2">
                        <a href="#" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="btn btn-outline-info btn-sm me-2"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="btn btn-outline-danger btn-sm me-2"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="btn btn-outline-primary btn-sm"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </footer>
        </article>
    `;
    
    // Update page title
    document.title = `${post.title} - Nako Connect Club Blog`;
}

function formatBlogContent(content) {
    // Simple formatting - in a real app you might use a markdown parser
    return content.split('\n').map(paragraph => {
        if (paragraph.trim() === '') return '';
        return `<p>${paragraph}</p>`;
    }).join('');
}

function loadComments(postId) {
    const commentsContainer = document.getElementById('comments-container');
    const comments = getCommentsFromStorage(postId);
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-comments fa-2x mb-3"></i>
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
        return;
    }
    
    let commentsHTML = '';
    comments.forEach(comment => {
        const commentDate = new Date(comment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        commentsHTML += `
            <div class="comment mb-4 pb-4 border-bottom">
                <div class="comment-header d-flex justify-content-between align-items-center mb-2">
                    <div class="comment-author fw-bold">${comment.name}</div>
                    <div class="comment-date text-muted small">${commentDate}</div>
                </div>
                <div class="comment-body">
                    <p class="mb-0">${comment.text}</p>
                </div>
            </div>
        `;
    });
    
    commentsContainer.innerHTML = commentsHTML;
}

function addComment(postId) {
    const name = document.getElementById('comment-name').value;
    const email = document.getElementById('comment-email').value;
    const text = document.getElementById('comment-text').value;
    
    if (!name || !email || !text) {
        alert('Please fill in all fields');
        return;
    }
    
    const comment = {
        id: Date.now().toString(),
        postId: postId,
        name: name,
        email: email,
        text: text,
        date: new Date().toISOString()
    };
    
    // Save comment to localStorage
    saveCommentToStorage(comment);
    
    // Clear form
    document.getElementById('comment-form').reset();
    
    // Reload comments
    loadComments(postId);
    
    // Show success message
    const commentsContainer = document.getElementById('comments-container');
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show';
    successAlert.innerHTML = `
        <strong>Success!</strong> Your comment has been posted.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    commentsContainer.insertBefore(successAlert, commentsContainer.firstChild);
}

// Utility functions for comments
function getCommentsFromStorage(postId) {
    const commentsJSON = localStorage.getItem('ncc_blog_comments');
    const allComments = commentsJSON ? JSON.parse(commentsJSON) : [];
    return allComments.filter(comment => comment.postId === postId)
                     .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function saveCommentToStorage(comment) {
    const comments = getCommentsFromStorage(); // Get all comments
    comments.push(comment);
    localStorage.setItem('ncc_blog_comments', JSON.stringify(comments));
}

// Utility function to get posts from localStorage
function getPostsFromStorage() {
    const postsJSON = localStorage.getItem('ncc_blog_posts');
    return postsJSON ? JSON.parse(postsJSON) : [];
}