import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreamsService {

  stream: MediaStream = new MediaStream();
  audio: MediaStream = new MediaStream();
  recorder: MediaRecorder | null = null;
  chunks: Blob[] = [];
  constructor() { }


  async setupVideoStream(): Promise<MediaStream | null> {
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      return this.stream;
    } catch (err) {
      console.error('Error setting up Video stream:', err);
      return null;
    }
  }

  async setupAudioStream(): Promise<MediaStream | null> {
    try {
      this.audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }

        
      });

      return this.audio;
    } catch (err) {
      console.error('Error setting up Audio stream:', err);
      return null;
    }
  }


}
