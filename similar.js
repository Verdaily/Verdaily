document.addEventListener('DOMContentLoaded', function () {
    const articleList = document.getElementById('article-list');
    const searchInput = document.getElementById('searchInput');
    const spinner = document.getElementById('spinner'); // Spinner element

    // Get the article number from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentArticleNumber = urlParams.get('article');

    fetch('articles.csv')
        .then(response => response.text())
        .then(data => {
            let articles = parseCSV(data);

            // Find the current article to get its tags
            const currentArticle = articles.find(article => article.number === currentArticleNumber);
            const currentTags = currentArticle ? currentArticle.tags : [];

            // Filter articles by current article's tags
            let filteredArticles = articles.filter(article => {
                return article.number !== currentArticleNumber && // Exclude the current article
                    currentTags.some(tag => article.tags && article.tags.includes(tag));
            });

            // Sort filtered articles by latest date first
            filteredArticles.sort((a, b) => parseDate(b.postDate) - parseDate(a.postDate));

            renderArticles(filteredArticles);

            searchInput.addEventListener('input', function () {
                const query = searchInput.value.toLowerCase();
                showSpinner(); // Show the spinner while searching

                // Use a timeout to avoid firing the search on every keystroke
                setTimeout(() => {
                    const searchFilteredArticles = filteredArticles.filter(article => {
                        // Check title, category1, category2, and all tags for the search query
                        return (
                            article.title.toLowerCase().includes(query) ||
                            article.category1.toLowerCase().includes(query) ||
                            article.category2.toLowerCase().includes(query) ||
                            (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
                        );
                    });
                    renderArticles(searchFilteredArticles);
                    hideSpinner(); // Hide the spinner after rendering
                }, 300); // Delay for search (300 ms)
            });
        })
        .catch(error => console.error('Error loading articles:', error));

    function parseCSV(data) {
        const rows = data.trim().split('\n').slice(1); // Remove the header row
        return rows.map(row => {
            const cols = row.split(',');
            const tags = cols.slice(6).filter(tag => tag !== '?'); // Collect all tags from columns starting from index 6
            return {
                number: cols[0],
                title: cols[1] === '?' ? '' : cols[1],
                imageSrc: cols[2] === '?' ? 'placeholder.png' : cols[2],
                postDate: cols[3] === '?' ? '01-01-1970' : cols[3], // Set a default date if unknown
                category1: cols[4] === '?' ? '' : cols[4],
                category2: cols[5] === '?' ? '' : cols[5],
                tags: tags.length > 0 ? tags : null // Include tags in the article object
            };
        });
    }

    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
    }

    function renderArticles(articles) {
        articleList.innerHTML = '';
        articles.forEach(article => {
            const articleItem = createArticleItem(article);
            articleList.appendChild(articleItem);
        });
    }

    function createArticleItem(article) {
        const articleItem = document.createElement('div');
        articleItem.classList.add('article-item');
        articleItem.innerHTML = `
                <div class="article-image">
                    <img src="${article.imageSrc}" alt="${article.title}">
                </div>
                <div class="article-content">
                    <div class="article-title">${article.title}</div>
                    <div class="article-meta">${formatDate(article.postDate)} | ${article.category1}${article.category2 ? ' | ' + article.category2 : ''}</div>
                </div>
                <div class="article-actions">
                    <button class="bookmark-btn" title="Bookmark Article">
                        <i class="fa-regular fa-bookmark"></i>
                    </button>
                </div>
            `;

        // Handle article click (excluding bookmark button)
        articleItem.addEventListener('click', function (e) {
            if (!e.target.closest('.bookmark-btn')) {
                window.location.href = `article.html?article=${article.number}`;
            }
        });

        // Handle bookmark button click
        const bookmarkBtn = articleItem.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent triggering the article click
            toggleBookmark(article, bookmarkBtn);
        });

        // Initialize bookmark state
        updateBookmarkIcon(article, bookmarkBtn);

        return articleItem;
    }

    function formatDate(dateStr) {
        // Optional: Format the date to a more readable format if desired
        const [day, month, year] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    }

    // Show the spinner at the bottom
    function showSpinner() {
        spinner.style.display = 'block'; // Show the spinner
    }

    // Hide the spinner once loading is done
    function hideSpinner() {
        spinner.style.display = 'none'; // Hide the spinner
    }

    // Bookmark Functionality
    function toggleBookmark(article, button) {
        let bookmarks = getBookmarks();
        const articleIndex = bookmarks.findIndex(item => item.number === article.number);

        if (articleIndex > -1) {
            // Article is already bookmarked; remove it
            bookmarks.splice(articleIndex, 1);
        } else {
            // Add the article to bookmarks
            bookmarks.push(article);
        }

        // Save updated bookmarks to localStorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

        // Update the bookmark icon
        updateBookmarkIcon(article, button);
    }

    // Function to get bookmarks from localStorage
    function getBookmarks() {
        const bookmarks = localStorage.getItem('bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    }

    // Function to update the bookmark icon based on bookmark state
    function updateBookmarkIcon(article, button) {
        const bookmarks = getBookmarks();
        const isBookmarked = bookmarks.some(item => item.number === article.number);
        const icon = button.querySelector('i');

        if (isBookmarked) {
            icon.classList.remove('fa-regular', 'fa-bookmark');
            icon.classList.add('fa-solid', 'fa-bookmark');
        } else {
            icon.classList.remove('fa-solid', 'fa-bookmark');
            icon.classList.add('fa-regular', 'fa-bookmark');
        }
    }
});

