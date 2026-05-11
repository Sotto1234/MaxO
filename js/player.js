// GitHub raw URL base - CHANGE THIS TO YOUR REPO
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/';

async function loadVideos() {
    try {
        const response = await fetch(GITHUB_RAW_BASE + 'data/videos.json');
        const data = await response.json();
        renderVideos(data.videos);
    } catch (error) {
        console.error('Error loading videos:', error);
        document.getElementById('videoGrid').innerHTML = 
            '<p style="color:white;text-align:center;">Failed to load videos. Please try again later.</p>';
    }
}

function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-thumbnail">
                <div class="play-icon">▶</div>
            </div>
            <div class="video-info-card">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <span class="duration">⏱ ${video.duration}</span>
                <span class="duration" style="margin-left:5px;">📦 ${video.size}</span>
            </div>
        `;
        
        card.addEventListener('click', () => openVideo(video));
        grid.appendChild(card);
    });
}

function openVideo(video) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('promoPlayer');
    const videoSource = videoPlayer.querySelector('source');
    
    // Set video source
    videoSource.src = GITHUB_RAW_BASE + video.promo;
    videoPlayer.load();
    
    // Set video info
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoDescription').textContent = 
        `${video.description} (Full: ${video.fullDuration})`;
    document.getElementById('fileSize').textContent = `File size: ${video.size}`;
    
    // Set download link
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = GITHUB_RAW_BASE + video.full;
    downloadBtn.download = `${video.title}-full.mp4`;
    
    modal.style.display = 'block';
    
    // Auto play promo
    videoPlayer.play().catch(e => console.log('Auto-play prevented:', e));
}

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('promoPlayer');
    videoPlayer.pause();
    modal.style.display = 'none';
});

// Close on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('videoModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        document.getElementById('promoPlayer').pause();
    }
});

// Load videos on page load
loadVideos();
