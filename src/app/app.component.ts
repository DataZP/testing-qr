import { Component, OnInit, ViewChild} from '@angular/core';
import { QrScannerComponent } from 'ang-qrscanner';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(QrScannerComponent, {static: true}) qrScannerComponent: QrScannerComponent ;
  
  title = 'qr-project';

  constructor(
    private router: Router,
  ) {}

  scanResult: string;

  ngOnInit() {
    try {
      this.qrScannerComponent.getMediaDevices().then(devices => {
        console.log(devices);
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0){
            let choosenDev;
            for (const dev of videoDevices){
                if (dev.label.includes('back')){
                    choosenDev = dev;
                    break;
                }
            }
            if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
            } else {
                this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
            }
        }
    });
    this.qrScannerComponent.capturedQr.subscribe(result => console.log(result));
    } catch(error) {
      console.log(error)
    }
  }

  onCodeResult(result: string) {
    this.scanResult = result;
    if (this.scanResult.length === 10) {
      this.scanResult = "Yep, it works!";
    } else {
      this.router.navigate(['/'])
    }
  }

  clearScan(): void {
    this.scanResult = null;
  }

}
