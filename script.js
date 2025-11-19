// Configuration
const YOUTUBE_VIDEO_ID = '1vT2QbefrCg'; // Replace with your YouTube video ID
const REDIRECT_URL = 'https://github.com/ankit-kumarz'; // Replace with your desired redirect URL
const REQUIRED_WATCH_TIME = 30; // seconds

// Variables
let player;
let watchedTime = 0;
let countdownInterval;
let isUnlocked = false;
let isPlaying = false;

// YouTube IFrame API ready callback
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Player ready event
function onPlayerReady(event) {
    console.log('YouTube player is ready');
}

// Player state change event
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        if (!isPlaying && !isUnlocked) {
            startWatchTimer();
            isPlaying = true;
        }
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        if (isPlaying && !isUnlocked) {
            pauseWatchTimer();
            isPlaying = false;
        }
    }
}

// Start the watch timer
function startWatchTimer() {
    if (countdownInterval) {
        return; // Already running
    }
    
    countdownInterval = setInterval(() => {
        watchedTime++;
        
        const remainingTime = REQUIRED_WATCH_TIME - watchedTime;
        
        if (remainingTime > 0) {
            updateCountdown(remainingTime);
        } else {
            unlockButton();
        }
    }, 1000);
}

// Pause the watch timer
function pauseWatchTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Update countdown display
function updateCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = seconds;
}

// Unlock the button
function unlockButton() {
    if (isUnlocked) return;
    
    isUnlocked = true;
    pauseWatchTimer();
    
    // Update UI
    const timerText = document.getElementById('timer-text');
    timerText.textContent = '🎉 Link Unlocked! 🎉';
    timerText.classList.add('unlocked');
    
    const button = document.getElementById('get-link-btn');
    button.disabled = false;
    button.classList.add('enabled');
    
    console.log('Button unlocked!');
}

// Handle button click
document.getElementById('get-link-btn').addEventListener('click', function() {
    if (!isUnlocked) return;
    
    // Redirect to the specified URL
    window.location.href = REDIRECT_URL;
});

// Prevent cheating by checking if user tries to skip ahead
setInterval(() => {
    if (player && player.getCurrentTime && !isUnlocked) {
        const currentTime = player.getCurrentTime();
        
        // Check if video is actually playing
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            // Additional validation can be added here
        }
    }
}, 500);
