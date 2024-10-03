import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { StreamsService } from './services/streams.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'screenrc';
  mixedStream: MediaStream = new MediaStream();
  chunks: Blob[] = [];
  recorder: MediaRecorder | null = null;


  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('videoPlayer2', { static: false }) videoPlayer2!: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink!: ElementRef<HTMLAnchorElement>;
  constructor(private streamsService: StreamsService) {}

  setVideoSource(stream: MediaStream): void {
    const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;
    videoElement.srcObject = stream;  
    videoElement.play();  
  }

  
  async startRecording() {
    try {
      const videostream = await this.streamsService.setupVideoStream();

      const audiostream = await this.streamsService.setupAudioStream();  
      if (videostream) {
        this.setVideoSource(videostream); 

        // Add video tracks to mixed stream
        videostream.getVideoTracks().forEach(track => {
          this.mixedStream.addTrack(track);
        });
      }

      if (audiostream) {
      // Add audio tracks to mixed stream
      audiostream.getAudioTracks().forEach(track => {
        this.mixedStream.addTrack(track);
      });
    }

      
      if (this.mixedStream.getTracks().length > 0) {
        // Start recording the mixed stream
        this.recorder = new MediaRecorder(this.mixedStream);

        // Handle data when available
        this.recorder.ondataavailable = (event: BlobEvent) => {
          this.chunks.push(event.data);
        };

        // Handle when the recording stops
        this.recorder.onstop = this.handleStop.bind(this);

        // Start recording
        this.recorder.start(1000); // Capture data every second

        console.log('Recording started');
      }
    } catch (err) {
      console.error('Error in starting recording:', err);
    }
  }

  stopRecording(): void {
    if (this.recorder) {
      this.recorder.stop();
      console.log('Recording stopped');
    }
  }

  handleStop(): void {
    const videoElement2 = this.videoPlayer2.nativeElement;
    const downloadLink = this.downloadLink.nativeElement;

    // Create a Blob from the chunks
    const blob = new Blob(this.chunks, { type: 'video/mp4' });
    this.chunks = [];

    // Create a URL for the blob and set it as the video source
    const videoURL = URL.createObjectURL(blob);
    videoElement2.src = videoURL;
    videoElement2.load();
    videoElement2.play();

    // Set the download link with the blob URL
    downloadLink.href = videoURL;
    downloadLink.download = 'recorded-video.mp4';
    downloadLink.textContent = 'Download Recorded Video';
    downloadLink.style.display = 'block';

    // Stop all tracks in the stream
    this.mixedStream.getTracks().forEach(track => track.stop());

  }

}
