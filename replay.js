export class Replay {
    constructor() {
        this.frames = [];
        this.isPlaying = false;
        this.playbackFrameIndex = 0;
        this.endPauseCounter = 0;
        this.endPauseDurationFrames = 180; // 3 seconds at 60fps
    }

    recordFrame(player, platforms, cameraY) {
        if (this.isPlaying) return;

        const frameData = {
            player: { x: player.x, y: player.y, width: player.width, height: player.height },
            platforms: platforms.map(p => ({ x: p.x, y: p.y, width: p.width, height: p.height })),
            cameraY: cameraY
        };

        this.frames.push(frameData);
    }

    startPlayback(fps = 60) {
        if (this.frames.length === 0) return;
        this.isPlaying = true;
        this.playbackFrameIndex = 0;
        this.endPauseCounter = 0;
        this.endPauseDurationFrames = 3 * fps;
    }

    stopPlayback() {
        this.isPlaying = false;
        this.frames = [];
    }

    getPlaybackFrame() {
        if (!this.isPlaying || this.frames.length === 0) return null;

        let frame;
        if (this.playbackFrameIndex < this.frames.length) {
            frame = this.frames[this.playbackFrameIndex];
            this.playbackFrameIndex++;
        } else {
            // Reached the end, show the last frame for the pause duration
            frame = this.frames[this.frames.length - 1];
            this.endPauseCounter++;
            if (this.endPauseCounter > this.endPauseDurationFrames) {
                // After pause, we just keep returning the last frame
                // but we could also set isPlaying to false if we wanted it to stop entirely.
                // For now, it will just pause on the last frame indefinitely.
            }
        }
        
        return frame;
    }
}