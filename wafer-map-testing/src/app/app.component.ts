import { Component, OnInit } from '@angular/core';
import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import type { WaferMapDie } from '@ni/nimble-components/dist/esm/wafer-map/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wafer-map-testing';
  dieCount: number = 1000;
  loginData = { username: '', password: '' };
  errorMessage: string = '';
  apiUrl = environment.apiUrl;
  tag = '';
  lastGeneratedWafer = document.createElement(waferMapTag);
  loginButtonClicked = false;
  loginSuccessful = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        this.loginButtonClicked = true;
      });
    }

    const waferMapContainer = document.getElementById('wafer-map-container');
    if (waferMapContainer) {
      waferMapContainer.append(this.lastGeneratedWafer);
    }
  }

 onSubmit() {
    this.http.post(`${this.apiUrl}/Auth/login`, this.loginData).subscribe(
      () => {
        alert('Login successful!');
        this.loginSuccessful = true;
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Invalid username or password';
        this.loginSuccessful = false;
      }
    );
  }

  changeHighlightedTag(tag: string) {
    if (tag === "") {
      this.lastGeneratedWafer.highlightedTags = [];
    }
    else {
      this.lastGeneratedWafer.highlightedTags = [tag];
    }
  }

  generateWaferMap(dieCount: number) {
    const waferMapDies = this.generateDies(dieCount);
    this.lastGeneratedWafer.dies = waferMapDies;
    this.lastGeneratedWafer.colorScale = {
      colors: ['red', 'orange', 'yellow', 'green'],
      values: ['1', '33', '66', '100']
    };
  }

  generateDies(diesCount: number): WaferMapDie[] {
    const wafermapDieSet: WaferMapDie[] = [];
    const sideLength = Math.sqrt(diesCount / Math.PI) * 2;
    const radius = sideLength / 2;
    const centerX = radius;
    const centerY = centerX;
    for (let i = 0; i <= sideLength; i++) {
      for (let j = 0; j <= sideLength; j++) {
        const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
        if (distance <= radius) {
          wafermapDieSet.push({ x: i, y: j, value: `${this.getRandomNumber(1, 100)}`, tags: this.getRandomTag() });
        }
      }
    }
    return wafermapDieSet;
  }

  getRandomTag(): any {
    const hardBin = 'HardBin' + this.getRandomWholeNumber(1, 5);
    const softBin = 'SoftBin' + this.getRandomWholeNumber(1, 5);
    const binType = 'BinType' + this.getRandomNumber(0, 1) ? 'Good' : 'Bad';
    return [hardBin, softBin, binType];
  }

  getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  getRandomWholeNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  deleteLoginButton() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.remove();
    }
  }
}
