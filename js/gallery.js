class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.content = this.lightbox.querySelector('.lightbox-content');
        this.img = document.getElementById('lightboxImg');
        this.items = [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.bindEvents();
    }

    bindEvents() {
        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        
        // Nav buttons
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());
        
        // Click background to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target === this.content) {
                this.close();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch swipe
        this.lightbox.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.lightbox.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].screenX - this.touchStartX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.prev() : this.next();
            }
        }, { passive: true });
        
        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            this.items.push({
                src: item.dataset.full,
                type: item.dataset.type || 'image'
            });
            item.addEventListener('click', (e) => {
                // Prevent video controls from blocking lightbox
                if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
                    e.stopPropagation();
                    return;
                }
                this.open(index);
            });
        });
    }

    open(index) {
        this.currentIndex = index;
        this.show();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Clean up video if playing
        const existingVideo = this.content.querySelector('video');
        if (existingVideo) {
            existingVideo.pause();
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.show();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.show();
    }

    show() {
        const item = this.items[this.currentIndex];
        
        // Remove existing content
        while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
        }

        if (item.type === 'video') {
            this.showVideo(item.src);
        } else {
            this.showImage(item.src);
        }
    }

    showImage(src) {
        this.img.classList.remove('loaded');
        const tempImg = new Image();
        
        tempImg.onload = () => {
            this.img.src = src;
            this.img.style.display = 'block';
            requestAnimationFrame(() => {
                this.img.classList.add('loaded');
            });
        };
        
        tempImg.onerror = () => {
            console.error('Failed to load image:', src);
        };
        
        tempImg.src = src;
    }

    showVideo(src) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.backgroundColor = '#000';
        
        video.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        this.content.appendChild(video);
        
        // Auto play
        setTimeout(() => {
            video.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});
